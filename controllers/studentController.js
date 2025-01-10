const Course = require('../models/Course');
const User = require('../models/User');
const Batch = require('../models/Batch');
const Job=require('../models/Job');
const PromoCode = require('../models/PromoCode');
const Transaction = require('../models/Transaction');

exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId).select('title price'); // Only fetch title and price
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const student = await User.findById(req.user.id);
    if (!student.enrolledCourses.includes(courseId)) {
      student.enrolledCourses.push(courseId);
      await student.save();
    } else {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    res.status(200).json({
      message: 'Enrolled in course successfully',
      course, // Only returns title and price
    });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course' });
  }
};




// exports.enrollInCourse = async (req, res) => {
//   try {
//     const { courseId } = req.body;

//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ message: 'Course not found' });

//     const student = await User.findById(req.user.id);
//     if (!student.enrolledCourses.includes(courseId)) {
//       student.enrolledCourses.push(courseId);
//       await student.save();
//     }

//     res.status(200).json({ message: 'Enrolled in course successfully', course });
//   } catch (error) {
//     res.status(500).json({ error: 'Error enrolling in course' });
//   }
// };

  // exports.submitAssignment = async (req, res) => {
  //   try {
  //     const { batchId, courseId, submission } = req.body;
  
  //     // Fetch the batch
  //     const batch = await Batch.findById(batchId);
  //     if (!batch) return res.status(404).json({ message: 'Batch not found' });
  
  //     // Debug logs
  //     console.log('Batch Assignments:', batch.assignments);
  //     console.log('Batch Students:', batch.students);
  //     console.log('Request User ID:', req.user.id);
  //     console.log('Request Course ID:', courseId);
  
  //     // Verify student enrollment
  //     if (!batch.students.includes(req.user.id)) {
  //       return res.status(400).json({ message: 'Student not enrolled in this batch' });
  //     }
  
  //     // Find the assignment
  //     const assignment = batch.assignments.find(
  //       (a) =>
  //         a.studentId.toString() === req.user.id.toString() &&
  //         a.courseId.toString() === courseId.toString()
  //     );
  
  //     if (!assignment) {
  //       console.log('Assignment not found for student and course');
  //       return res.status(404).json({ message: 'Assignment not found for this student and course' });
  //     }
  
  //     // Update the assignment
  //     assignment.submission = submission;
  //     await batch.save();
  
  //     res.status(200).json({ message: 'Assignment submitted successfully', assignment });
  //   } catch (error) {
  //     console.error('Error submitting assignment:', error.message);
  //     res.status(500).json({ error: 'Error submitting assignment' });
  //   }
  // };

  // exports.submitAssignment = async (req, res) => {
  //   try {
  //     const { batchId, courseId, submission } = req.body;
  
  //     const batch = await Batch.findById(batchId);
  //     if (!batch) {
  //       return res.status(404).json({ message: 'Batch not found' });
  //     }
  
  //     if (!batch.students.includes(req.user.id)) {
  //       return res.status(403).json({ message: 'You are not enrolled in this batch' });
  //     }
  
  //     // Add assignment submission
  //     batch.assignments.push({
  //       studentId: req.user.id,
  //       courseId,
  //       submission,
  //       submittedAt: new Date(),
  //     });
  
  //     await batch.save();
  
  //     res.status(200).json({ message: 'Assignment submitted successfully' });
  //   } catch (error) {
  //     console.error('Error submitting assignment:', error);
  //     res.status(500).json({ message: 'Error submitting assignment', error: error.message });
  //   }
  // };
  



  // exports.viewProgress = async (req, res) => {
  //   try {
  //     const student = await User.findById(req.user.id).populate('enrolledCourses');
  //     res.status(200).json({ message: 'Student progress retrieved', progress: student.enrolledCourses });
  //   } catch (error) {
  //     res.status(500).json({ error: 'Error fetching progress' });
  //   }
  // };
  

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    // Fetch the job
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Ensure the student exists
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if student has already applied
    const alreadyApplied = job.applications.find(
      (app) => app.studentId.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Add the student's application to the job
    job.applications.push({ studentId: req.user.id, status: 'Pending' });
    await job.save();

    res.status(200).json({ message: 'Job application submitted successfully', job });
  } catch (error) {
    console.error('Error applying to job:', error.message);
    res.status(500).json({ error: 'Error applying to job' });
  }
};
exports.getStudentProgress = async (req, res) => {
  try {
    // Fetch all batches where the student is enrolled
    const batches = await Batch.find({ students: req.user.id })
      .populate({
        path: 'courseId',
        select: 'title', // Only include the course title
      })
      .populate('assignments.studentId', 'name email'); // Include student details in assignments

    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: 'No progress found for this student' });
    }

    // Map student progress for each batch
    const progress = batches.map((batch) => {
      // Filter assignments for the logged-in student
      const studentAssignments = batch.assignments.filter(
        (assignment) => assignment.studentId.toString() === req.user.id
      );

      // Calculate completed assignments and scores
      const completedAssignments = studentAssignments.length;
      const totalScore = studentAssignments.reduce((acc, assignment) => acc + (assignment.score || 0), 0);
      const averageScore = completedAssignments > 0 ? (totalScore / completedAssignments).toFixed(2) : 0;

      return {
        batchName: batch.name,
        courseTitle: batch.courseId.title,
        completedAssignments: completedAssignments,
        totalAssignments: batch.assignments.length,
        totalScore: totalScore,
        averageScore: averageScore,
        submissions: studentAssignments.map((assignment) => ({
          submissionUrl: assignment.submission || 'Not Submitted',
          score: assignment.score !== null ? assignment.score : 'Pending',
          feedback: assignment.feedback || 'No feedback',
        })),
      };
    });

    res.status(200).json({ message: 'Student progress retrieved', progress });
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};



// exports.applyPromoCode = async (req, res) => {
//   try {
//     const { promoCode, courseId } = req.body;

//     const promo = await PromoCode.findOne({ code: promoCode });
//     if (!promo || promo.expiryDate < new Date()) {
//       return res.status(400).json({ message: 'Invalid or expired promo code' });
//     }

//     if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
//       return res.status(400).json({ message: 'Promo code usage limit exceeded' });
//     }

//     if (promo.courseId && promo.courseId.toString() !== courseId) {
//       return res.status(400).json({ message: 'Promo code not applicable for this course' });
//     }

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     const discountedPrice = course.price - (course.price * promo.discountPercentage) / 100;

//     promo.usedCount += 1;
//     await promo.save();

//     res.status(200).json({
//       message: 'Promo code applied successfully',
//       originalPrice: course.price,
//       discountedPrice,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Error applying promo code' });
//   }
// };

exports.applyPromoCode = async (req, res) => {
  try {
    const { promoCode, courseId } = req.body;

    const promo = await PromoCode.findOne({ code: promoCode });
    if (!promo) {
      return res.status(400).json({ message: 'Invalid promo code' });
    }

    if (promo.expiryDate < new Date()) {
      return res.status(400).json({ message: 'Promo code expired' });
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ message: 'Promo code usage limit exceeded' });
    }

    if (promo.courseId && (!courseId || promo.courseId.toString() !== courseId)) {
      return res.status(400).json({ message: 'Promo code not applicable for this course' });
    }

    let discountedPrice = null;
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      discountedPrice = course.price - (course.price * promo.discountPercentage) / 100;
    }

    promo.usedCount += 1;
    await promo.save();

    res.status(200).json({
      message: 'Promo code applied successfully',
      ...(courseId && { originalPrice: discountedPrice / (1 - promo.discountPercentage / 100) }),
      ...(discountedPrice && { discountedPrice }),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error applying promo code' });
  }
};



exports.updateResume = async (req, res) => {
  try {
    const { personalDetails, education, experience, skills } = req.body;

    const student = await User.findById(req.user.id);
    student.resume = { personalDetails, education, experience, skills };
    await student.save();

    res.status(200).json({ message: 'Resume updated successfully', resume: student.resume });
  } catch (error) {
    res.status(500).json({ error: 'Error updating resume' });
  }
};

exports.getResume = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    res.status(200).json({ resume: student.resume });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving resume' });
  }
};
exports.getCourses = async (req, res) => {
  try {
    // Fetch only necessary fields: title and price
    const courses = await Course.find().select('title price');
    
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

exports.getStudentBatches = async (req, res) => {
  try {
    // Find batches where the logged-in student is enrolled
    const batches = await Batch.find({ students: req.user.id }).populate('courseId', 'title price');

    if (batches.length === 0) {
      return res.status(404).json({ message: 'No batches found for this student' });
    }

    res.status(200).json({ batches });
  } catch (error) {
    console.error('Error fetching student batches:', error);
    res.status(500).json({ message: 'Error fetching batches' });
  }
};

exports.getBatchDetails = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId).populate('courseId', 'title price');
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ batch });
  } catch (error) {
    console.error('Error fetching batch details:', error);
    res.status(500).json({ message: 'Error fetching batch details' });
  }
};



// Enhance Analytics and Progress Tracking for Admin and Students.
// Finalize Real-Time Features, like group chat or notifications.
// Implement Testing and Deployment of the backend.

 // Employer Dashboard (Optional)
// Create an endpoint for employers to:

// View all their created jobs.
// View applications for a specific job.
exports.getStudentTransactions = async (req, res) => {
  try {
    const studentId = req.user.id; // Logged-in student ID

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required.' });
    }

    console.log("Logged-in user ID:", studentId); // Debug log

    const transactions = await Transaction.find({ userId: studentId })
      .populate('courseId', 'title') // Populate course details
      .populate('batchId', 'name') // Populate batch details
      .sort({ paymentDate: -1 });

    console.log("Fetched Transactions:", transactions); // Debug log

    if (!transactions.length) {
      return res
        .status(404)
        .json({ message: 'No transactions found for this student.' });
    }

    res.status(200).json({
      message: 'Transactions fetched successfully.',
      transactions,
    });
  } catch (error) {
    console.error('Error fetching student transactions:', error.message);
    res.status(500).json({ error: 'Error fetching student transactions.' });
  }
};


 
// Controller function to handle assignment submission
exports.submitAssignment = async (req, res) => {
  try {
    const { studentId, courseId, lessonId, assignmentId, answers } = req.body;

    // Ensure the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    // Find the specific lesson and assignment
    const lesson = course.lessons.find(lesson => lesson.lessonId === lessonId);
    if (!lesson) {
      return res.status(400).json({ message: "Lesson not found" });
    }

    const assignment = lesson.assignments.find(assignment => assignment._id.toString() === assignmentId);
    if (!assignment) {
      return res.status(400).json({ message: "Assignment not found" });
    }

    // Process the answers and calculate the score (modify as needed)
    const score = calculateScore(answers, lesson.quizzes);  // Call the function to calculate the score

    // Find the student and update their assignment submission
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    // Update student's submission (add new submission record)
    student.assignmentsSubmitted.push({
      assignmentId,
      answers,
      score,
      submissionDate: new Date(),
    });

    await student.save();  // Save the student data

    return res.status(200).json({
      message: "Assignment submitted successfully",
      student,  // Returning the updated student
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return res.status(500).json({ message: "Error submitting assignment", error });
  }
};

// Helper function to calculate the score based on answers
const calculateScore = (answers, quizzes) => {
  let score = 0;
  quizzes.forEach((quiz, index) => {
    if (answers[index] === quiz.correctAnswer) {
      score += 10;  // Add points for each correct answer (adjust as needed)
    }
  });
  return score;
};

exports.submitQuiz = async (req, res) => {
  try {
    const { studentId, quizId, answers } = req.body; // Collect answers submitted by student

    const quiz = await Quiz.findById(quizId);

    let score = 0;
    // Check answers and calculate score
    answers.forEach((answer, index) => {
      if (answer === quiz.correctAnswers[index]) {
        score += 10; // 10 points for each correct answer
      }
    });

    // Update the student's EvoScore
    const student = await User.findById(studentId);
    student.evoScore += score; // Increment the student's score
    await student.save();

    res.status(200).json({
      message: 'Quiz submitted successfully.',
      evoScore: student.evoScore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz.', error });
  }
};

exports.getEvoScore = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student EvoScore fetched successfully.',
      evoScore: student.evoScore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching EvoScore.', error });
  }
};
