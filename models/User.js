
// // const mongoose = require('mongoose');
// // const bcrypt = require('bcrypt');

// // const userSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true },
// //     email: { type: String, unique: true, required: true },
// //     password: { type: String, select: false }, // Optional password for OAuth users
// //     assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to assigned courses
// //     enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

// //     role: {
// //       type: String,
// //       enum: ['Admin', 'Manager', 'Creator', 'Mentor', 'Student', 'Employer'],
// //       required: true,
// //     },
// //     isOAuthUser: { type: Boolean, default: false }, // Flag to indicate if the user was created via OAuth
// //   },
// //   { timestamps: true } // Add timestamps to track createdAt and updatedAt
// // );

// // // Hash password before saving the document
// // userSchema.pre('save', async function (next) {
// //   // Skip hashing if the password is not modified or if it's an OAuth user
// //   if (!this.isModified('password') || this.isOAuthUser) return next();
// //   this.password = await bcrypt.hash(this.password, 12); // Hash the password
// //   next();
// // });

// // // Method to compare passwords
// // userSchema.methods.comparePassword = async function (candidatePassword) {
// //   return await bcrypt.compare(candidatePassword, this.password);
// // };

// // module.exports = mongoose.model('User', userSchema);
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, select: false }, // Optional password for OAuth users
//     assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to assigned courses
//     enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
//     courses: [],
//     role: {
//       type: String,
//       enum: ['Admin', 'Manager', 'Creator', 'Mentor', 'Student', 'Employer'],
//       required: true,
//     },
    
//     isOAuthUser: { type: Boolean, default: false }, // Flag to indicate if the user was created via OAuth

//     // Resume field
//     resume: {
//       personalDetails: {
//         name: { type: String },
//         email: { type: String },
//         phone: { type: String },
//       },
//       education: [
//         {
//           degree: { type: String },
//           institution: { type: String },
//           year: { type: String },
//         },
//       ],
//       experience: [
//         {
//           company: { type: String },
//           role: { type: String },
//           duration: { type: String },
//         },
//       ],
//       skills: [{ type: String }],
//     },
//   },
//   { timestamps: true } // Add timestamps to track createdAt and updatedAt
// );

// // Hash password before saving the document
// userSchema.pre('save', async function (next) {
//   // Skip hashing if the password is not modified or if it's an OAuth user
//   if (!this.isModified('password') || this.isOAuthUser) return next();
//   this.password = await bcrypt.hash(this.password, 12); // Hash the password
//   next();
// });

// // Method to compare passwords
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false }, // Optional password for OAuth users
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Creator', 'Mentor', 'Student', 'Employer'],
      required: true,
    },

    // Manager-specific fields
    dob: { type: Date }, // Date of Birth
    username: { type: String, unique: true }, // Unique username
    contactNumber: { type: String }, // Contact number
    photo: { type: String }, // URL for photo
    about: { type: String }, // Short bio or description
    address: { type: String }, // Physical address
    workingMode: { type: String, enum: ['In-office', 'WFH'] }, // Working mode
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        year: { type: Number },
      },
    ],

    // Mentor-specific fields
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to assigned courses
    assignedBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }], // Reference to assigned batches

    // Flags and other fields
    isOAuthUser: { type: Boolean, default: false }, // Flag for OAuth users
  },
  { timestamps: true }
);

// Hash password before saving the document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isOAuthUser) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
