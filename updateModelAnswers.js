const mongoose = require('mongoose');
const Course = require('./models/Course'); // Adjust the path to your Course model

// Connect to your MongoDB
const dbURI = 'your_mongo_db_connection_string_here'; // Replace with your MongoDB URI
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Script to update existing data
async function updateModelAnswers() {
  try {
    const courses = await Course.find(); // Fetch all courses

    for (const course of courses) {
      let updated = false;

      course.lessons.forEach((lesson) => {
        lesson.assignments.forEach((assignment) => {
          if (!assignment.modelAnswer) {
            // Add a default modelAnswer if missing
            assignment.modelAnswer = 'Default model answer. Update this value manually if needed.';
            updated = true;
          }
        });
      });

      if (updated) {
        await course.save();
        console.log(`Updated course: ${course.name}`);
      }
    }

    console.log('All courses updated successfully!');
  } catch (error) {
    console.error('Error updating assignments:', error.message);
  } finally {
    mongoose.disconnect(); // Disconnect from the database
  }
}

// Run the script
updateModelAnswers();
