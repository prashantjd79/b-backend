const Course = require('../models/Course');
const User = require('../models/User'); // ✅ Ensure this is correct

const Batch = require('../models/Batch');
const Job=require('../models/Job');
const PromoCode = require('../models/PromoCode');
const Transaction = require('../models/Transaction');
const calculateEvoScore = require('../utils/evoScoreCalculator');
const Category = require('../models/Category');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

const Path = require('../models/Path');

const mongoose = require("mongoose");




const Blog = require('../models/Blog'); // Ensure correct model path

// 📌 Fetch All Learning Paths
exports.getAllPaths = async (req, res) => {
  try {
    console.log("📌 Fetching all learning paths...");

    const paths = await Path.find({}); // Fetch all paths from database

    if (!paths.length) {
      return res.status(404).json({ message: "No paths found" });
    }

    console.log("✅ Paths Fetched:", paths.length);
    res.status(200).json({ paths });
  } catch (error) {
    console.error("❌ Error fetching paths:", error.message);
    res.status(500).json({ message: "Error fetching paths", error: error.message });
  }
};

// 📌 Fetch All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    console.log("📌 Fetching all blogs...");

    const blogs = await Blog.find({}); // Fetch all blogs from database

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs available" });
    }

    console.log("✅ Blogs Fetched:", blogs.length);
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error.message);
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};


exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // 🔍 Validate course ID format
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    // 🔍 Check if the course exists
    const course = await Course.findById(courseId).select('title price');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 🔍 Find the student by ID from the decoded token
    const student = await User.findById(req.user.userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🔍 Check if already enrolled
    if (student.coursesEnrolled.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // ✅ Enroll the student
    student.coursesEnrolled.push(courseId);
    await student.save();

    res.status(200).json({
      message: 'Enrolled in course successfully',
      course, // Return course title and price
    });
  } catch (error) {
    console.error("❌ Error enrolling in course:", error);
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


 
// // Controller function to handle assignment submission
// exports.submitAssignment = async (req, res) => {
//   try {
//     const { studentId, courseId, lessonId, assignmentId, answers } = req.body;

//     // Ensure the course exists
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(400).json({ message: "Course not found" });
//     }

//     // Find the specific lesson and assignment
//     const lesson = course.lessons.find(lesson => lesson.lessonId === lessonId);
//     if (!lesson) {
//       return res.status(400).json({ message: "Lesson not found" });
//     }

//     const assignment = lesson.assignments.find(assignment => assignment._id.toString() === assignmentId);
//     if (!assignment) {
//       return res.status(400).json({ message: "Assignment not found" });
//     }

//     // Process the answers and calculate the score (modify as needed)
//     const score = calculateScore(answers, lesson.quizzes);  // Call the function to calculate the score

//     // Find the student and update their assignment submission
//     const student = await User.findById(studentId);
//     if (!student) {
//       return res.status(400).json({ message: "Student not found" });
//     }

//     // Update student's submission (add new submission record)
//     student.assignmentsSubmitted.push({
//       assignmentId,
//       answers,
//       score,
//       submissionDate: new Date(),
//     });

//     await student.save();  // Save the student data

//     return res.status(200).json({
//       message: "Assignment submitted successfully",
//       student,  // Returning the updated student
//     });
//   } catch (error) {
//     console.error('Error submitting assignment:', error);
//     return res.status(500).json({ message: "Error submitting assignment", error });
//   }
// };

// // Helper function to calculate the score based on answers
// const calculateScore = (answers, quizzes) => {
//   let score = 0;
//   quizzes.forEach((quiz, index) => {
//     if (answers[index] === quiz.correctAnswer) {
//       score += 10;  // Add points for each correct answer (adjust as needed)
//     }
//   });
//   return score;
// };

// exports.submitQuiz = async (req, res) => {
//   try {
//     const { studentId, quizId, answers } = req.body; // Collect answers submitted by student

//     const quiz = await Quiz.findById(quizId);

//     let score = 0;
//     // Check answers and calculate score
//     answers.forEach((answer, index) => {
//       if (answer === quiz.correctAnswers[index]) {
//         score += 10; // 10 points for each correct answer
//       }
//     });

//     // Update the student's EvoScore
//     const student = await User.findById(studentId);
//     student.evoScore += score; // Increment the student's score
//     await student.save();

//     res.status(200).json({
//       message: 'Quiz submitted successfully.',
//       evoScore: student.evoScore,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error submitting quiz.', error });
//   }
// };

// exports.getEvoScore = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const student = await User.findById(studentId);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     res.status(200).json({
//       message: 'Student EvoScore fetched successfully.',
//       evoScore: student.evoScore,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching EvoScore.', error });
//   }
// };
const Submission = require('../models/Submission');

// exports.submitQuizAndAssignment = async (req, res) => {
//   try {
//     const { 
//       studentId, 
//       courseId, 
//       lessonId, 
//       quizId, 
//       assignmentId, 
//       submittedQuizAnswers, 
//       assignmentSubmission 
//     } = req.body;

//     // Validate student
//     const student = await User.findById(studentId);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Fetch the course and validate the lesson
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     const lesson = course.lessons.find((l) => l._id.toString() === lessonId);
//     if (!lesson) {
//       return res.status(404).json({ message: 'Lesson not found in this course' });
//     }

//     // Fetch the quiz and validate
//     const quiz = lesson.quizzes.find((q) => q._id.toString() === quizId);
//     if (!quiz) {
//       return res.status(404).json({ message: 'Quiz not found in this lesson' });
//     }

//     // Validate assignment
//     const assignment = lesson.assignments.find((a) => a._id.toString() === assignmentId);
//     if (!assignment) {
//       return res.status(404).json({ message: 'Assignment not found in this lesson' });
//     }

//     // Calculate quiz scores
//     let correctAnswers = 0;
//     quiz.questions.forEach((question, index) => {
//       if (submittedQuizAnswers[index] === question.correctAnswer) {
//         correctAnswers++;
//       }
//     });
//     const totalQuestions = quiz.questions.length;

//     // Validate assignment submission (Manual Review Ready)
//     const assignmentDetails = {
//       completed: assignmentSubmission?.completed || false,
//       submissionText: assignmentSubmission?.submissionText || '', // Assignment content
//       submissionURL: assignmentSubmission?.submissionURL || '',  // Supporting file/project link
//       reviewed: false,  // Assignment is pending review
//       grade: null,      // Grade to be assigned during review
//       feedback: '',     // Feedback to be provided during review
//     };

//     // Save or update submission
//     let submission = await Submission.findOne({ studentId, courseId, lessonId });
//     if (!submission) {
//       submission = new Submission({
//         studentId,
//         courseId,
//         lessonId,
//         quiz: {
//           correctAnswers,
//           totalQuestions,
//         },
//         assignment: assignmentDetails,
//       });
//     } else {
//       // Update existing submission
//       submission.quiz.correctAnswers = correctAnswers;
//       submission.quiz.totalQuestions = totalQuestions;
//       submission.assignment = { ...submission.assignment, ...assignmentDetails };
//     }

//     await submission.save();

//     // Automatically recalculate EvoScore
//     const newEvoScore = await calculateEvoScore(studentId);

//     // Update the student's EvoScore
//     student.evoScore = newEvoScore;
//     await student.save();

//     res.status(200).json({
//       message: 'Submission recorded and EvoScore updated successfully',
//       submission,
//       evoScore: newEvoScore,
//     });
//   } catch (error) {
//     console.error('Error submitting quiz and assignment:', error.message);
//     res.status(500).json({ error: 'Error submitting quiz and assignment', details: error.message });
//   }
// };
exports.submitQuizAndAssignment = async (req, res) => {
  try {
    const { studentId, courseId, lessonId, quizId, assignmentId, submittedQuizAnswers, assignmentSubmission } = req.body;

    // Validate student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch the course and validate the lesson
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lesson = course.lessons.find((l) => l._id.toString() === lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found in this course' });
    }

    // Fetch the quiz and validate
    const quiz = lesson.quizzes.find((q) => q._id.toString() === quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found in this lesson' });
    }

    // Validate assignment
    const assignmentExists = lesson.assignments.some((assignment) => assignment._id.toString() === assignmentId);
    if (!assignmentExists) {
      return res.status(404).json({ message: 'Assignment not found in this lesson' });
    }

    // Calculate quiz scores
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === submittedQuizAnswers[index]) {
        correctAnswers++;
      }
    });
    const totalQuestions = quiz.questions.length;

    // Validate assignment submission
    const assignmentCompleted = assignmentSubmission?.completed || false;

    // Save or update submission
    let submission = await Submission.findOne({ studentId, courseId, lessonId });
    if (!submission) {
      submission = new Submission({
        studentId,
        courseId,
        lessonId,
        quiz: {
          correctAnswers,
          totalQuestions,
        },
        assignment: {
          completed: assignmentCompleted,
          submissionURL: assignmentSubmission?.submissionURL || '',
        },
      });
    } else {
      // Update existing submission
      submission.quiz.correctAnswers = correctAnswers;
      submission.quiz.totalQuestions = totalQuestions;
      submission.assignment.completed = assignmentCompleted;
      submission.assignment.submissionURL = assignmentSubmission?.submissionURL || '';
    }

    await submission.save();

    // Automatically recalculate EvoScore
    await calculateEvoScore(studentId);

    res.status(200).json({
      message: 'Submission recorded successfully',
      submission,
    });
  } catch (error) {
    console.error('Error submitting quiz and assignment:', error.message);
    res.status(500).json({ error: 'Error submitting quiz and assignment', details: error.message });
  }
};


exports.getEvoScore = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate the student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Respond with the student's EvoScore
    res.status(200).json({
      message: 'EvoScore retrieved successfully',
      studentId: student._id,
      name: student.name, // Include student name if available
      evoScore: student.evoScore,
    });
  } catch (error) {
    console.error('Error fetching EvoScore:', error.message);
    res.status(500).json({ error: 'Error fetching EvoScore', details: error.message });
  }
};





// exports.studentSignup = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if email is already in use
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     // Hash password before saving
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create new user with role 'Student'
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       role: 'Student'
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'Signup successful' });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ message: 'Error signing up', error: error.message });
//   }
// };




exports.studentSignup = async (req, res) => {
  try {
    console.log("Received Signup Request:", req.body);

    const { email, password, dob, contactNumber, education, interests, wannaBe, experience } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user with additional details
    const newUser = new User({
      email,
      password: hashedPassword,
      role: 'Student',
      dob,
      contactNumber,
      education, // Array of education details
      interests, // Array of student interests
      wannaBe, // Career aspiration
      experience, // Array of experience details
    });

    await newUser.save();
    console.log("✅ Student Registered:", newUser);

    res.status(201).json({ message: 'Signup successful', user: newUser });
  } catch (error) {
    console.error("❌ Signup error:", error.message);
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
};


exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user and ensure password is selected
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log("🔒 Stored Hashed Password from DB:", user.password);
    console.log("🔑 Entered Password:", password);

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log("🔍 bcrypt.compare() result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password comparison failed");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("✅ Login successful! Token generated.");
    res.json({ token, message: 'Login successful' });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};
exports.getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from token

    // Find the student by ID and exclude password
    const student = await User.findById(userId).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error("❌ Error fetching student profile:", error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};












exports.getEnrolledCourses = async (req, res) => {
  try {
    const student = await User.findById(req.user.userId)
      .populate('coursesEnrolled', 'title description') // Fetch only title & description
      .select('coursesEnrolled'); // Only return enrolled courses

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ enrolledCourses: student.coursesEnrolled });
  } catch (error) {
    console.error("❌ Error fetching enrolled courses:", error);
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
};

exports.enrollInPath = async (req, res) => {
  try {
    const { pathId } = req.body;

    // Validate Path exists
    const path = await Path.findById(pathId).select('title description');
    if (!path) {
      return res.status(404).json({ message: 'Path not found' });
    }

    // Find Student
    const student = await User.findById(req.user.userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if already enrolled
    if (student.roadmapEnrolled && student.roadmapEnrolled.toString() === pathId) {
      return res.status(400).json({ message: 'Already enrolled in this path' });
    }

    // Enroll in the path
    student.roadmapEnrolled = pathId;
    await student.save();

    res.status(200).json({
      message: 'Successfully enrolled in the path',
      path, // Returns only title and description
    });
  } catch (error) {
    console.error("❌ Error enrolling in path:", error);
    res.status(500).json({ message: 'Error enrolling in path' });
  }
};
exports.getEnrolledPath = async (req, res) => {
  try {
    // Find Student & Populate Enrolled Path
    const student = await User.findById(req.user.userId)
      .populate('roadmapEnrolled', 'title description')
      .select('roadmapEnrolled');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ enrolledPath: student.roadmapEnrolled || null });
  } catch (error) {
    console.error("❌ Error fetching enrolled path:", error);
    res.status(500).json({ message: 'Error fetching enrolled path' });
  }
};


exports.getStudentBatches = async (req, res) => {
  try {
    console.log("Decoded Token:", req.user); // Debugging

    const userId = req.user.userId; // Ensure correct key

    if (!userId) {
      console.error("❌ Error: userId is undefined in token");
      return res.status(400).json({ message: "Invalid token, userId not found" });
    }

    console.log("✅ Fetching batches for student ID:", userId);

    // Find batches where the student is included in the 'students' array
    const batches = await Batch.find({ students: userId }).populate("courseId", "name description");

    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: "No batches found for this student" });
    }

    res.status(200).json({ batches });
  } catch (error) {
    console.error("❌ Error fetching student batches:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAvailableJobs = async (req, res) => {
  try {


    // Fetch only active jobs
    const jobs = await Job.find({ status: 'Active' }).select('-__v');

    // Log the fetched jobs
    

    if (!jobs || jobs.length === 0) {
     
      return res.status(404).json({ message: 'No jobs available at the moment' });
    }

    
    res.status(200).json({ jobs });

  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
};
exports.getCategories = async (req, res) => {
  try {
    console.log('🔍 Fetching available categories for student...');
    console.log('🆔 Decoded Token User ID:', req.user.id);

    // Fetch all categories from the database
    const categories = await Category.find().select('-__v');

    // Log the fetched categories
    console.log('📋 Fetched Categories:', categories);

    if (!categories || categories.length === 0) {
      console.log('⚠️ No categories found in the database.');
      return res.status(404).json({ message: 'No categories available at the moment' });
    }

    console.log('✅ Returning categories to the student.');
    res.status(200).json({ categories });

  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};




exports.getStudentSessions = async (req, res) => {
  try {
    console.log("📌 Full Decoded Token User:", req.user);

    if (!req.user || !req.user.id) {
      console.error("❌ Error: User ID is missing in request object.");
      return res.status(401).json({ message: "Unauthorized: User ID not found in request." });
    }

    const studentId = req.user.id;
    console.log("✅ Extracted Student ID:", studentId);

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      console.error("❌ Invalid Student ID Format:", studentId);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    console.log("✅ Converted Student Object ID:", studentObjectId);

    const sessions = await Session.find({ studentId: studentObjectId })
      .populate("mentorId", "name email")
      .populate("batchId", "name")
      .exec();

    console.log("🔍 Fetched Sessions:", sessions);

    if (!sessions || sessions.length === 0) {
      console.log("⚠️ No sessions found for this student.");
      return res.status(404).json({ message: "No sessions found for this student" });
    }

    res.status(200).json({
      message: "Sessions fetched successfully",
      sessions,
    });

  } catch (error) {
    console.error("❌ Error fetching student sessions:", error);
    res.status(500).json({ message: "Error fetching student sessions", error: error.message });
  }
};
