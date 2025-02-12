



const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    // Common fields for all roles
    name: { type: String, required: false },

    email: { type: String, unique: true, required: true },
    evoScore: { type: Number, default: 0 }, 
    password: { type: String, select: false }, // Optional password for OAuth users
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Creator', 'Mentor', 'Student', 'Employer', 'CourseCreator'], // Added Course Creator role
      required: true,
    },
    dob: { type: Date }, // Date of Birth
    username: { type: String, unique: true }, // Unique username
    contactNumber: { type: String }, // Contact number
    photo: { type: String }, // URL for photo
    about: { type: String }, // Short bio or description
    address: { type: String }, // Physical address
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        year: { type: Number },
      },
    ],

    // Manager-specific fields
    workingMode: { type: String, enum: ['In-office', 'WFH'] }, // Working mode

    // Mentor-specific fields
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to assigned courses
    assignedBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }], // Reference to assigned batches
    timeAvailability: { type: String, default: 'Not Set' }, // Mentor's time availability

    // Creator-specific fields
    skills: [{ type: String }], // Array of skills (e.g., "Content Writing", "Video Editing")
    batchAssignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch', // Reference to Batch model
      },
    ],

    // Student-specific fields
    guardianName: { type: String }, // Guardian's name
    coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // References to enrolled courses
    interests: [{ type: String }], // Array of interests (e.g., "AI", "Web Development")
    languagesPreferred: [{ type: String }], // Array of preferred languages
    wannaBe: { type: String }, // Career aspiration (e.g., "Software Developer")
    experience: [
      {
        category: { type: String }, // Field of experience (e.g., "Web Development")
        company: { type: String }, // Company name
      },
    ],
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }, // Reference to the batch the student is part of
    roadmapEnrolled: { type: mongoose.Schema.Types.ObjectId, ref: 'Path' }, // Reference to the roadmap/path the student is enrolled in
    assignmentsSubmitted: [
      {
        assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
        submissionDate: { type: Date },
      },
    ],
    progressTracking: {
      completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Completed courses
      overallProgress: { type: Number, default: 0 }, // Percentage progress
    },
    resume: {
      personalDetails: {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
      },
      education: [
        {
          degree: { type: String },
          institution: { type: String },
          year: { type: String },
        },
      ],
      experience: [
        {
          company: { type: String },
          role: { type: String },
          duration: { type: String },
        },
      ],
      skills: [{ type: String }],
    },

    // Employer-specific fields
    industry: { type: String }, // Industry or domain
    companySize: { type: String }, // Company size (e.g., Small, Medium, Large)
    jobCampaigns: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        campaignName: { type: String },
      },
    ],
    status: { type: String, enum: ['Approved', 'Disapproved'], default: 'Disapproved' }, // Approval status

    // Course Creator-specific fields
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to courses created by this user

    // EvoScore field for students
    evoScore: { type: Number, default: 0 }, // Track EvoScore

    // Flags and other fields
    isOAuthUser: { type: Boolean, default: false }, // Flag for OAuth users
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Hash password before saving the document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isOAuthUser) return next(); // Prevent hashing if password is not modified or for OAuth users

  // ✅ Prevent double hashing by checking if password is already hashed
  if (this.password.startsWith("$2b$")) {
    console.log("⚠️ Password already hashed, skipping hashing process.");
    return next();
  }

  try {
    console.log("🔑 Hashing Password Before Saving:", this.password);
    this.password = await bcrypt.hash(this.password, 12);
    console.log("🔒 Hashed Password Saved:", this.password);
    next();
  } catch (err) {
    next(err);
  }
});



// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


