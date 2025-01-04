const Session = require('../models/Session');
const Batch = require('../models/Batch');
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

exports.createAssignment = async (req, res) => {
  try {
    const { batchId, studentId, courseId,startDate,endDate, submission } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    // Check if assignment exists
    const existingAssignment = batch.assignments.find(
      (a) =>
        a.studentId.toString() === studentId.toString() &&
        a.courseId.toString() === courseId.toString()
    );

    if (existingAssignment) {
      return res.status(400).json({ message: 'Assignment already exists' });
    }

    // Add new assignment
    batch.assignments.push({
      studentId,
      courseId,
      startDate,
      endDate,
      submission: submission || null, // Add the submission from request or set to null
    });
    await batch.save();

    res.status(201).json({ message: 'Assignment created successfully', batch });
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


