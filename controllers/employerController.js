const Job = require('../models/Job');
const User = require('../models/User');


exports.createJob = async (req, res) => {
  try {
    const { title, description, skillsRequired, location, salary } = req.body;

    const job = new Job({
      employerId: req.user.id,
      title,
      description,
      skillsRequired,
      location,
      salary,
    });

    await job.save();
    res.status(201).json({ message: 'Job campaign created successfully', job });
  } catch (error) {
    res.status(500).json({ error: 'Error creating job campaign' });
  }
};


exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).select('name email resume');
    res.status(200).json({ message: 'Students retrieved successfully', students });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching students' });
  }
};
// exports.updateApplicationStatus = async (req, res) => {
//     try {
//       const { jobId, studentId, status } = req.body;
  
//       const job = await Job.findById(jobId);
//       if (!job) {
//         return res.status(404).json({ message: 'Job not found' });
//       }
  
//       // Find the specific application
//       const application = job.applications.find(
//         (app) => app.studentId.toString() === studentId
//       );
  
//       if (!application) {
//         return res.status(404).json({ message: 'Application not found' });
//       }
  
//       // Update the status
//       application.status = status;
//       await job.save();
  
//       res.status(200).json({
//         message:'Application status updated to ${status}',
//         application,
//       });
//     } catch (error) {
//       res.status(500).json({ error: 'Error updating application status' });
//     }
//   };
  // exports.getApplications = async (req, res) => {
  //   try {
  //     const { jobId } = req.params;
  
  //     // Validate jobId
  //     if (!jobId) {
  //       return res.status(400).json({ message: 'Job ID is required' });
  //     }
  
  //     // Fetch the job and populate applications
  //     const job = await Job.findById(jobId).populate('applications.studentId', 'name email');
  //     if (!job) {
  //       return res.status(404).json({ message: 'Job not found' });
  //     }
  
  //     res.status(200).json({ applications: job.applications });
  //   } catch (error) {
  //     console.error('Error fetching applications:', error.message);
  //     res.status(500).json({ error: 'Error fetching applications' });
  //   }
  // };
  

  
  exports.getJobApplications = async (req, res) => {
    try {
      const { jobId } = req.params;
  
      if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required.' });
      }
  
      const job = await Job.findById(jobId).populate('applications.studentId');
  
      if (!job) {
        return res.status(404).json({ error: 'Job not found.' });
      }
  
      const applications = job.applications.map(app => ({
        studentId: app.studentId._id,
        studentName: app.studentId.name,
        studentEmail: app.studentId.email,
        status: app.status,
      }));
  
      res.status(200).json({ message: 'Applications fetched successfully.', applications });
    } catch (error) {
      console.error('Error fetching applications:', error.message);
      res.status(500).json({ error: 'Error fetching applications' });
    }
  };
  exports.updateApplicationStatus = async (req, res) => {
    try {
      const { jobId, studentId, status } = req.body;
  
      if (!jobId || !studentId || !status) {
        return res.status(400).json({ message: 'Job ID, Student ID, and Status are required.' });
      }
  
      const job = await Job.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found.' });
      }
  
      const application = job.applications.find(
        (app) => app.studentId.toString() === studentId
      );
  
      if (!application) {
        return res.status(404).json({ message: 'Application not found for this student.' });
      }
  
      application.status = status; // Update the status
      await job.save(); // Save the updated job document
  
      res.status(200).json({ message: 'Application status updated successfully.' });
    } catch (error) {
      console.error('Error updating application status:', error.message);
      res.status(500).json({ error: 'Error updating application status' });
    }
  };
  