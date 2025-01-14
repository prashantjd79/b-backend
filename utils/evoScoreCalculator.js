const Submission = require('../models/Submission');

const calculateEvoScore = async (studentId) => {
  try {
    // Fetch all submissions for the student
    const submissions = await Submission.find({ studentId });

    let totalCorrectAnswers = 0; // Total correct answers across all quizzes
    let totalQuestions = 0; // Total quiz questions across all lessons
    let totalAssignmentsCompleted = 0; // Total completed assignments
    let totalAssignments = 0; // Total assignments across all lessons

    // Aggregate performance data from submissions
    submissions.forEach((submission) => {
      totalCorrectAnswers += submission.quiz.correctAnswers || 0;
      totalQuestions += submission.quiz.totalQuestions || 0;
      totalAssignmentsCompleted += submission.assignment.completed ? 1 : 0;
      totalAssignments += 1; // Count every lesson's assignment
    });

    // Calculate quiz score (percentage of correct answers)
    const quizScore = totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0;

    // Calculate assignment score (percentage of completed assignments)
    const assignmentScore = totalAssignments > 0 ? (totalAssignmentsCompleted / totalAssignments) * 100 : 0;

    // Calculate EvoScore (weighted average)
    const evoScore = ((quizScore * 0.7) + (assignmentScore * 0.3)).toFixed(2); // 70% quiz, 30% assignments

    return parseFloat(evoScore);
  } catch (error) {
    console.error('Error calculating EvoScore:', error.message);
    throw new Error('EvoScore calculation failed');
  }
};

module.exports = calculateEvoScore;
