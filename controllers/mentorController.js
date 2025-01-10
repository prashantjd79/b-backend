const Session = require('../models/Session');

const Batch = require('../models/Batch');
const Course = require('../models/Course'); // Import the Course model
// Assuming you have a Session model
exports.scheduleSession = async (req, res) => {
  try {
    const { studentId, batchId, topic, dateTime } = req.body;

    // Validate student and batch
    if (!studentId || !batchId || !topic || !dateTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save session in the database
    const session = new Session({
      studentId,
      batchId,
      topic,
      dateTime,
    });

    await session.save();

    res.status(201).json({ message: 'Session scheduled successfully', session });
  } catch (error) {
    console.error('Error scheduling session:', error.message);
    res.status(500).json({ message: 'Server error: Unable to schedule session' });
  }
};



 // Ensure Lesson model is available
const Assignment = require('../models/Assignment');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, submissionURL } = req.body;
    const { lessonId } = req.params;

    // Validate the input
    if (!title || !description || !lessonId) {
      return res.status(400).json({ message: 'Title, description, and lessonId are required' });
    }

    // Find the lesson by ID
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check for duplicate assignment titles
    const existingAssignment = await Assignment.findOne({ lesson: lessonId, title: title.trim() });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Assignment with this title already exists for this lesson' });
    }

    // Create the assignment
    const assignment = new Assignment({
      title: title.trim(),
      description,
      submissionURL,
      lesson: lessonId,
    });

    // Save the assignment
    await assignment.save();

    // Add the assignment to the lesson
    lesson.assignments.push(assignment._id);
    await lesson.save();

    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    console.error('Error creating assignment:', error.message);
    res.status(500).json({ error: 'Error creating assignment' });
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


 