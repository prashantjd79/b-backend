const Session = require('../models/Session');
const Submission = require('../models/Submission'); // Correct path to your Submission model
const calculateEvoScore = require('../utils/evoScoreCalculator'); // Adjust the path based on your folder structure
const User = require('../models/User'); // Adjust the path to your User model if needed

const Batch = require('../models/Batch');
const Course = require('../models/Course'); // Import the Course model
// Assuming you have a Session model
// exports.scheduleSession = async (req, res) => {
//   try {
//     const { studentId, batchId, topic, dateTime } = req.body;

//     // Validate student and batch
//     if (!studentId || !batchId || !topic || !dateTime) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Save session in the database
//     const session = new Session({
//       studentId,
//       batchId,
//       topic,
//       dateTime,
//     });

//     await session.save();

//     res.status(201).json({ message: 'Session scheduled successfully', session });
//   } catch (error) {
//     console.error('Error scheduling session:', error.message);
//     res.status(500).json({ message: 'Server error: Unable to schedule session' });
//   }
// };

exports.scheduleSession = async (req, res) => {
  try {
    const { studentId, batchId, topic, dateTime } = req.body;

    if (!studentId || !batchId || !topic || !dateTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const session = new Session({
      studentId,
      batchId,
      topic,
      dateTime,
      mentorId: req.user.id // ✅ Save Mentor ID
    });

    await session.save();

    res.status(201).json({ message: 'Session scheduled successfully', session });
  } catch (error) {
    console.error('❌ Error scheduling session:', error.message);
    res.status(500).json({ message: 'Server error: Unable to schedule session' });
  }
};




exports.addAssignment = async (req, res) => {
  try {
    const { courseId, lessonId, assignment } = req.body;

    // Validate the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the lesson
    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Add the assignment to the lesson
    lesson.assignments.push(assignment);

    // Save the updated course
    await course.save();

    res.status(201).json({ message: 'Assignment added successfully', lesson });
  } catch (error) {
    console.error('Error adding assignment:', error.message);
    res.status(500).json({ error: 'Error adding assignment', details: error.message });
  }
};



  exports.gradeAssignment = async (req, res) => {
    try {
      const { batchId, studentId, courseId, score } = req.body;
  
      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
      }
  
      // Find the assignment using studentId and courseId
      const assignment = batch.assignments.find(
        (a) => a.studentId.toString() === studentId && a.courseId.toString() === courseId
      );
  
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
  
      // Update the assignment score
      assignment.score = score;
      await batch.save(); // Save the updated batch document
  
      res.status(200).json({ message: 'Assignment graded successfully', assignment });
    } catch (error) {
      console.error('Error grading assignment:', error.message);
      res.status(500).json({ error: 'Error grading assignment', details: error.message });
    }
  };


  exports.getAssignmentSubmission = async (req, res) => {
    try {
      const { submissionId } = req.params;
  
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }
  
      res.status(200).json({
        message: 'Assignment submission retrieved successfully',
        assignment: submission.assignment,
        quiz: submission.quiz, // Optionally include quiz details for reference
      });
    } catch (error) {
      console.error('Error fetching assignment submission:', error.message);
      res.status(500).json({ error: 'Error fetching assignment submission', details: error.message });
    }
  };
  exports.reviewAssignment = async (req, res) => {
    try {
      const { submissionId, grade, feedback } = req.body;
  
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }
  
      // Update assignment review details
      submission.assignment.reviewed = true;
      submission.assignment.grade = grade;
      submission.assignment.feedback = feedback;
      submission.assignment.completed = true;
  
      await submission.save();
  
      // Automatically recalculate EvoScore after review
      const newEvoScore = await calculateEvoScore(submission.studentId);
  
      // Update the student's EvoScore
      const student = await User.findById(submission.studentId);
      student.evoScore = newEvoScore;
      await student.save();
  
      res.status(200).json({
        message: 'Assignment reviewed successfully and EvoScore updated',
        submission,
        evoScore: newEvoScore,
      });
    } catch (error) {
      console.error('Error reviewing assignment:', error.message);
      res.status(500).json({ error: 'Error reviewing assignment', details: error.message });
    }
  };



// 📌 Fetch All Submissions with Student Info
exports.getAllSubmissions = async (req, res) => {
  try {
    console.log("📌 Fetching all submissions with student details...");

    // Populate student details (student ID & name)
    const submissions = await Submission.find()
      .populate('studentId', 'name email') // Fetch Student Name & Email
      .select('_id studentId submittedAt status'); // Select relevant fields

    if (!submissions.length) {
      return res.status(404).json({ message: "No submissions found" });
    }

    // Formatting Response
    const formattedSubmissions = submissions.map(sub => ({
      submissionId: sub._id,
      student: sub.studentId ? { id: sub.studentId._id, name: sub.studentId.name, email: sub.studentId.email } : null,
      submittedAt: sub.submittedAt,
      status: sub.status
    }));

    console.log("✅ Submissions Found:", formattedSubmissions.length);
    res.status(200).json({ submissions: formattedSubmissions });
  } catch (error) {
    console.error("❌ Error fetching submissions:", error.message);
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
};

