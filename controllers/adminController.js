
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');
const Batch = require('../models/Batch');
const Blog = require('../models/Blog');
const bcrypt=require('bcrypt');
const Announcement = require('../models/Announcement'); // Adjust the path as needed
const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const PromoCode = require('../models/PromoCode');
const Manager = require('../models/User');
const Mentor=require('../models/User');
const mongoose = require('mongoose');
const Path = require('../models/Path');





exports.deleteManager = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedManager = await Manager.findByIdAndDelete(id);
    if (!deletedManager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    res.status(200).json({ message: 'Manager deleted successfully' });
  } catch (error) {
    console.error('Error deleting manager:', error.message);
    res.status(500).json({ error: 'Error deleting manager' });
  }
};
exports.updateManager = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input fields
    const updateData = req.body;

    const allowedFields = [
      "name",
      "username",
      "email",
      "dob",
      "contactNumber",
      "photo",
      "about",
      "address",
      "workingMode",
    ];

    // Filter only allowed fields
    const filteredData = Object.keys(updateData).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        acc[key] = updateData[key];
      }
      return acc;
    }, {});

    const updatedManager = await User.findByIdAndUpdate(
      id,
      filteredData,
      { new: true, select: "-resume" } // Exclude the resume field from the response
    );

    if (!updatedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.status(200).json({
      message: "Manager updated successfully",
      updatedManager,
    });
  } catch (error) {
    console.error("Error updating manager:", error.message);
    res.status(500).json({ error: "Error updating manager" });
  }
};
exports.getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "Manager" }, "-resume -education"); // Exclude these fields

    res.status(200).json({
      message: "Managers fetched successfully",
      managers,
    });
  } catch (error) {
    console.error("Error fetching managers:", error.message);
    res.status(500).json({ error: "Error fetching managers" });
  }
};
exports.createManager = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      dob,
      contactNumber,
      photo,
      about,
      address,
      workingMode,
    } = req.body;

    const manager = new User({
      name,
      username,
      email,
      password,
      dob,
      contactNumber,
      photo,
      about,
      address,
      workingMode,
      role: "Manager", // Explicitly setting the role to Manager
    });

    await manager.save();

    res.status(201).json({
      message: "Manager created successfully",
      manager: {
        name: manager.name,
        username: manager.username,
        email: manager.email,
        dob: manager.dob,
        contactNumber: manager.contactNumber,
        photo: manager.photo,
        about: manager.about,
        address: manager.address,
        workingMode: manager.workingMode,
        role: manager.role,
        createdAt: manager.createdAt,
        updatedAt: manager.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating manager:", error.message);
    res.status(400).json({ error: error.message });
  }
};
exports.createUser = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Debug log
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error); // Debug log
    res.status(500).json({ error: 'Error creating user' });
  }
};
// Create a new course
// exports.createCourse = async (req, res) => {
//   try {
//     const { title, category, subcategory, description } = req.body;

//     // Check for missing fields
//     if (!title || !category || !subcategory) {
//       return res.status(400).json({ error: 'Title, category, and subcategory are required' });
//     }

//     // Create and save the course
//     const course = new Course({ title, category, subcategory, description });
//     await course.save();

//     res.status(201).json({ message: 'Course created successfully', course });
//   } catch (error) {
//     console.error('Error creating course:', error.message);
//     res.status(500).json({ error: 'An error occurred while creating the course' });
//   }
// };

exports.createCourse = async (req, res) => {
  try {
    const {
      name,
      category,
      subcategory,
      description,
      duration,
      mentorAssigned,
      managerAssigned,
      batchesAvailable,
      promoCodes,
      realPrice,
      discountedPrice,
    } = req.body;

    // Check for duplicate course name
    const existingCourse = await Course.findOne({ name: name.trim() });
    if (existingCourse) {
      return res.status(400).json({ message: 'A course with this name already exists' });
    }

    // Validate Category
    const validCategory = await Category.findById(category);
    if (!validCategory) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Validate Subcategory
    const validSubcategory = await Subcategory.findById(subcategory);
    if (!validSubcategory) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }

    // Validate Mentor
    const validMentor = await User.findById(mentorAssigned);
    if (!validMentor || validMentor.role !== 'Mentor') {
      return res.status(400).json({ message: 'Invalid mentor ID or user is not a mentor' });
    }

    // Validate Manager
    const validManager = await User.findById(managerAssigned);
    if (!validManager || validManager.role !== 'Manager') {
      return res.status(400).json({ message: 'Invalid manager ID or user is not a manager' });
    }

    // Validate Batches (if provided)
    if (batchesAvailable && batchesAvailable.length > 0) {
      const validBatches = await Batch.find({ _id: { $in: batchesAvailable } });
      if (validBatches.length !== batchesAvailable.length) {
        return res.status(400).json({ message: 'One or more batch IDs are invalid' });
      }
    }

    // Validate Promo Codes (if provided)
    if (promoCodes && promoCodes.length > 0) {
      const validPromoCodes = await PromoCode.find({ _id: { $in: promoCodes } });
      if (validPromoCodes.length !== promoCodes.length) {
        return res.status(400).json({ message: 'One or more promo code IDs are invalid' });
      }
    }

    // Create a new course instance
    const course = new Course({
      name: name.trim(),
      category,
      subcategory,
      description,
      duration,
      mentorAssigned,
      managerAssigned,
      batchesAvailable,
      promoCodes,
      realPrice,
      discountedPrice,
    });

    // Save the course to the database
    await course.save();

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Error creating course:', error.message);
    res.status(500).json({ error: 'Error creating course' });
  }
};






exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Delete the course
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error.message);
    res.status(500).json({ error: 'Error deleting course', details: error.message });
  }
};
exports.getCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch the course by ID
    const course = await Course.findById(courseId)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('mentorAssigned', 'name email')
      .populate('managerAssigned', 'name email')
      .populate('batchesAvailable', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate the number of lessons in the course
    const lessonCount = course.lessons.length;

    res.status(200).json({
      message: 'Course retrieved successfully',
      course: {
        ...course.toObject(), // Convert Mongoose document to plain object
        lessonCount, // Add the lesson count
      },
    });
  } catch (error) {
    console.error('Error retrieving course:', error.message);
    res.status(500).json({ error: 'Error retrieving course', details: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Please enter correct password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return success response with token
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error); // Log error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.approveBlog = async (req, res) => {
  try {
    // Example: Approve blog logic
    const { blogId } = req.body;
    if (!blogId) {
      return res.status(400).json({ message: 'Blog ID is required' });
    }
    // Approve the blog in the database (dummy response here)
    res.status(200).json('{ message: Blog with ID ${blogId} approved successfully }');
  } catch (error) {
    console.error('Error approving blog:', error.message);
    res.status(500).json({ error: 'Error approving blog' });
  }
};
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalMentors = await User.countDocuments({ role: 'Mentor' });
    const totalCreators = await User.countDocuments({ role: 'Creator' });
    const totalCourses = await Course.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalBatches = await Batch.countDocuments();

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalMentors,
      totalCreators,
      totalCourses,
      totalBlogs,
      totalBatches,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error.message);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
};
exports.createBatch = async (req, res) => {
  try {
    const { name, courseId, startDate, endDate, students, mentors, managerAssigned, promoCodes } = req.body;

    const batch = new Batch({
      name,
      courseId,
      startDate,
      endDate,
      students,
      mentors,
      managerAssigned,
      promoCodes,
    });

    await batch.save();

    res.status(201).json({
      message: 'Batch created successfully',
      batch,
    });
  } catch (error) {
    console.error('Error creating batch:', error.message);
    res.status(500).json({ error: 'Error creating batch' });
  }
};

// exports.createMentor = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Mentor already exists' });
//     }

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the mentor account
//     const newMentor = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: 'Mentor', // Assign the Mentor role
//     });

//     await newMentor.save();

//     res.status(201).json({ message: 'Mentor created successfully', mentor: newMentor });
//   } catch (error) {
//     console.error('Error creating mentor:', error.message);
//     res.status(500).json({ message: 'Server error: Unable to create mentor' });
//   }
// };
exports.assignCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Assign the course to `assignedCourses`
    if (!user.assignedCourses) {
      user.assignedCourses = [];
    }

    if (user.assignedCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Course already assigned to the user' });
    }

    user.assignedCourses.push(courseId);

    // Optionally, add to `courses` field if needed for students
    if (user.role === 'Student') {
      if (!user.courses) {
        user.courses = [];
      }
      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
      }
    }

    await user.save();

    res.status(200).json({ message: 'Course assigned successfully', user });
  } catch (error) {
    console.error('Error assigning course:', error.message);
    res.status(500).json({ message: 'Server error: Unable to assign course' });
  }
};
exports.assignMentorToBatch = async (req, res) => {
  try {
    const { batchId, mentorId } = req.body;

    // Validate batch
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Validate mentor
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'Mentor') {
      return res.status(404).json({ message: 'Mentor not found or invalid role' });
    }

    // Add mentor to the batch if not already assigned
    if (!batch.mentors.includes(mentorId)) {
      batch.mentors.push(mentorId);
    } else {
      return res.status(400).json({ message: 'Mentor already assigned to this batch' });
    }

    await batch.save();

    res.status(200).json({
      message: 'Mentor assigned successfully to the batch',
      batch,
    });
  } catch (error) {
    console.error('Error assigning mentor:', error.message);
    res.status(500).json({ message: 'Server error: Unable to assign mentor' });
  }
};
exports.assignStudents = async (req, res) => {
  try {
    const { batchId, studentIds } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    batch.students.push(...studentIds);
    await batch.save();

    res.status(200).json({ message: 'Students assigned successfully', batch });
  } catch (error) {
    res.status(500).json({ error: 'Error assigning students' });
  }
};
exports.approveBlog = async (req, res) => {
  try {
    const { blogId, status } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.status = status;
    await blog.save();

    res.status(200).json({ message: `Blog ${status.toLowerCase()} successfully`, blog });
  } catch (error) {
    res.status(500).json({ error: 'Error updating blog status' });
  }
};
exports.getPendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'Pending' }).populate('creatorId', 'name email');
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching blogs' });
  }
};
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const totalCourses = await Course.countDocuments();
    const totalBatches = await Batch.countDocuments();

    res.status(200).json({
      message: 'Platform analytics retrieved successfully',
      data: {
        totalUsers,
        totalCourses,
        totalBatches,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};
// exports.exportTransactions = async (req, res) => {
//   try {
//     const { courseId, category, subcategory } = req.query;

//     const query = {};
//     if (courseId) query.courseId = courseId;

//     const transactions = await Transaction.find(query).populate('studentId courseId');

//     const fields = ['studentId.name', 'courseId.title', 'amount', 'paymentDate'];
//     const json2csvParser = new Parser({ fields });
//     const csv = json2csvParser.parse(transactions);

//     res.header('Content-Type', 'text/csv');
//     res.attachment('transactions.csv');
//     return res.send(csv);
//   } catch (error) {
//     res.status(500).json({ error: 'Error exporting transactions' });
//   }
// };


// Create Category
// Adjust the path as needed
exports.getTransactions = async (req, res) => {
  try {
    const { role } = req.query; // Optional query to filter by user role

    const query = {};
    if (role) {
      const users = await User.find({ role }, '_id'); // Fetch users with the specified role
      const userIds = users.map((user) => user._id);
      query.userId = { $in: userIds };
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email role') // Populate user details
      .populate('courseId', 'title') // Populate course details
      .populate('batchId', 'name') // Populate batch details
      .sort({ paymentDate: -1 }); // Sort by latest payment

    res.status(200).json({ message: 'Transactions fetched successfully.', transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Error fetching transactions.' });
  }
};



exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
};
exports.createSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = new Subcategory({ name, categoryId });
    await subcategory.save();
    res.status(201).json({ message: 'Subcategory created successfully', subcategory });
  } catch (error) {
    res.status(500).json({ error: 'Error creating subcategory' });
  }
};
exports.createPromoCode = async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate, applicableTo, usageLimit, category } = req.body;

    const promoCode = new PromoCode({
      code,
      discountPercentage,
      expiryDate,
      applicableTo,
      usageLimit,
      category: applicableTo === 'Category' ? category : null,
    });

    await promoCode.save();

    res.status(201).json({ message: 'Promo Code created successfully.', promoCode });
  } catch (error) {
    console.error('Error creating promo code:', error.message);
    res.status(500).json({ error: 'Error creating promo code.' });
  }
};
exports.getPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().populate('category');
    res.status(200).json({ message: 'Promo Codes fetched successfully.', promoCodes });
  } catch (error) {
    console.error('Error fetching promo codes:', error.message);
    res.status(500).json({ error: 'Error fetching promo codes.' });
  }
};
exports.updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountPercentage, expiryDate, applicableTo, usageLimit, category } = req.body;

    const updatedPromoCode = await PromoCode.findByIdAndUpdate(
      id,
      {
        code,
        discountPercentage,
        expiryDate,
        applicableTo,
        usageLimit,
        category: applicableTo === 'Category' ? category : null,
      },
      { new: true }
    );

    if (!updatedPromoCode) {
      return res.status(404).json({ message: 'Promo Code not found.' });
    }

    res.status(200).json({ message: 'Promo Code updated successfully.', updatedPromoCode });
  } catch (error) {
    console.error('Error updating promo code:', error.message);
    res.status(500).json({ error: 'Error updating promo code.' });
  }
};
exports.deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPromoCode = await PromoCode.findByIdAndDelete(id);

    if (!deletedPromoCode) {
      return res.status(404).json({ message: 'Promo Code not found.' });
    }

    res.status(200).json({ message: 'Promo Code deleted successfully.' });
  } catch (error) {
    console.error('Error deleting promo code:', error.message);
    res.status(500).json({ error: 'Error deleting promo code.' });
  }
};
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ message: 'Categories retrieved successfully', categories });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};
exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const subcategories = await Subcategory.find({ categoryId });
    res.status(200).json({ subcategories });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subcategories' });
  }
};
// exports.getCourses = async (req, res) => {
//   try {
//     const courses = await Course.find({})
//       .populate('categoryId', 'name')
//       .populate('subcategoryId', 'name')
//       .select('title price description categoryId subcategoryId');

//     res.status(200).json({
//       message: 'Courses fetched successfully',
//       courses,
//     });
//   } catch (error) {
//     console.error('Error fetching courses:', error);
//     res.status(500).json({ message: 'Error fetching courses', error: error.message });
//   }
// };
// exports.getCourses = async (req, res) => {
//   try {
//     const courses = await Course.find({}, 'title _id'); // Fetch only title and _id
//     res.status(200).json({
//       message: 'Courses fetched successfully',
//       courses,
//     });
//   } catch (error) {
//     console.error('Error fetching courses:', error.message);
//     res.status(500).json({ message: 'Error fetching courses' });
//   }
// };
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {}; // Filter by role if provided

    const users = await User.find(query, 'name email role'); // Return only necessary fields
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
// exports.getBatches = async (req, res) => {
//   try {
//     const { courseId } = req.query;
//     if (!courseId) {
//       return res.status(400).json({ message: 'Course ID is required' });
//     }

//     const batches = await Batch.find({ courseId }).select('_id name'); // Fetch only batch name and ID
//     if (batches.length === 0) {
//       return res.status(404).json({ message: 'No batches found for this course' });
//     }

//     res.status(200).json({ batches });
//   } catch (error) {
//     console.error('Error fetching batches:', error.message);
//     res.status(500).json({ message: 'Error fetching batches' });
//   }
// };
exports.getBatches = async (req, res) => {
  try {
    const { courseId } = req.query;

    const query = {};
    if (courseId) query.courseId = courseId;

    const batches = await Batch.find(query)
      .populate('courseId', 'title')
      .populate('students', 'name email')
      .populate('mentors', 'name email')
      .populate('managerAssigned', 'name email');

    res.status(200).json({
      message: 'Batches fetched successfully',
      batches,
    });
  } catch (error) {
    console.error('Error fetching batches:', error.message);
    res.status(500).json({ error: 'Error fetching batches' });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedBatch = await Batch.findByIdAndUpdate(id, updates, { new: true })
      .populate('courseId', 'title')
      .populate('students', 'name email')
      .populate('mentors', 'name email')
      .populate('managerAssigned', 'name email');

    if (!updatedBatch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({
      message: 'Batch updated successfully',
      updatedBatch,
    });
  } catch (error) {
    console.error('Error updating batch:', error.message);
    res.status(500).json({ error: 'Error updating batch' });
  }
};
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBatch = await Batch.findByIdAndDelete(id);

    if (!deletedBatch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({
      message: 'Batch deleted successfully',
      deletedBatch,
    });
  } catch (error) {
    console.error('Error deleting batch:', error.message);
    res.status(500).json({ error: 'Error deleting batch' });
  }
};

// exports.getMentors = async (req, res) => {
//   try {
//     // Fetch all users with role Mentor
//     const mentors = await User.find({ role: 'Mentor' }).select('_id name email role');

//     if (!mentors || mentors.length === 0) {
//       return res.status(404).json({ message: 'No mentors found' });
//     }

//     res.status(200).json({ mentors });
//   } catch (error) {
//     console.error('Error fetching mentors:', error.message);
//     res.status(500).json({ message: 'Error fetching mentors' });
//   }
// };
// Create Mentor

exports.createMentor = async (req, res) => {
  try {
    const {
      name,
      username,
      dob,
      email,
      contactNumber,
      photo,
      about,
      address,
      education,
      assignedCourses,
      batchAssignments,
      timeAvailability, // Added field
      password, // For mentor password
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const mentor = new User({
      name,
      username,
      dob,
      email,
      contactNumber,
      photo,
      about,
      address,
      education,
      assignedCourses,
      batchAssignments: batchAssignments || [], // Ensure batchAssignments is always an array
      timeAvailability: timeAvailability || "Not Set", // Default if not provided
      password: hashedPassword,
      role: "Mentor", // Set the role explicitly
    });

    await mentor.save();

    res.status(201).json({
      message: "Mentor created successfully",
      mentor,
    });
  } catch (error) {
    console.error("Error creating mentor:", error.message);
    res.status(500).json({ message: "Error creating mentor", error: error.message });
  }
};
exports.getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'Mentor' }, '-password');
    res.status(200).json({ message: 'Mentors fetched successfully', mentors });
  } catch (error) {
    console.error('Error fetching mentors:', error.message);
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }
};
exports.updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, dob, contactNumber, photo, about, address, education, assignedCourses, assignedBatches } = req.body;

    const updatedMentor = await User.findByIdAndUpdate(
      id,
      { name, username, dob, contactNumber, photo, about, address, education, assignedCourses, assignedBatches },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Mentor updated successfully', updatedMentor });
  } catch (error) {
    console.error('Error updating mentor:', error.message);
    res.status(500).json({ message: 'Error updating mentor', error: error.message });
  }
};
exports.deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Mentor deleted successfully' });
  } catch (error) {
    console.error('Error deleting mentor:', error.message);
    res.status(500).json({ message: 'Error deleting mentor', error: error.message });
  }
};
exports.getStudents = async (req, res) => {
  try {
    // Fetch all users with role Student
    const students = await User.find({ role: 'Student' }).select('_id name email role');

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({ message: 'Error fetching students' });
  }
};
exports.simulateTransaction = async (req, res) => {
  try {
    const { studentId, courseId, amountPaid, paymentMethod } = req.body;

    // Validate required fields
    if (!studentId || !courseId || !amountPaid) {
      return res.status(400).json({ message: 'Student ID, Course ID, and Amount Paid are required.' });
    }

    // Generate a unique transaction ID
    const transactionId = `${Date.now()}`;

    // Create a new transaction
    const transaction = new Transaction({
      transactionId,
      userId: studentId,
      courseId,
      amountPaid,
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Success',
      paymentDate: new Date(),
    });

    // Save the transaction
    await transaction.save();

    res.status(201).json({ message: 'Transaction simulated successfully', transaction });
  } catch (error) {
    console.error('Error simulating transaction:', error.message);
    res.status(500).json({ error: 'Error simulating transaction' });
  }
};

// exports.addAnnouncement = async (req, res) => {
//   try {
//     const { title, message, targetRoles } = req.body;

//     if (!title || !message || !targetRoles) {
//       return res.status(400).json({ message: 'Title, message, and target roles are required.' });
//     }

//     const announcement = new Announcement({
//       title,
//       message,
//       targetRoles,
//       createdBy: req.user.id, // Ensure admin ID is added to the announcement
//     });

//     await announcement.save();

//     res.status(201).json({ message: 'Announcement created successfully', announcement });
//   } catch (error) {
//     console.error('Error creating announcement:', error.message);
//     res.status(500).json({ error: 'Error creating announcement' });
//   }
// };



exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, media, targetAudience, visibilityStart, visibilityEnd } = req.body;

    // Validate required fields
    if (!title || !message || !targetAudience || !visibilityStart || !visibilityEnd) {
      return res.status(400).json({ error: 'All fields are required: title, message, targetAudience, visibilityStart, and visibilityEnd.' });
    }

    // Create new announcement
    const announcement = new Announcement({
      title,
      message,
      media,
      targetAudience,
      visibilityStart,
      visibilityEnd,
      createdBy: req.user.id, // Assuming `req.user` is populated by the middleware
    });

    // Save to database
    await announcement.save();

    res.status(201).json({ message: 'Announcement created successfully.', announcement });
  } catch (error) {
    console.error('Error creating announcement:', error.message);
    res.status(500).json({ error: 'Error creating announcement.' });
  }
};


exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name email') // Populate admin details
      .sort({ createdAt: -1 });

    res.status(200).json({ message: 'Announcements fetched successfully.', announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error.message);
    res.status(500).json({ error: 'Error fetching announcements.' });
  }
};
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, media, targetAudience, visibilityStart, visibilityEnd } = req.body;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      {
        title,
        message,
        media,
        targetAudience,
        visibilityStart,
        visibilityEnd,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    res.status(200).json({ message: 'Announcement updated successfully.', updatedAnnouncement });
  } catch (error) {
    console.error('Error updating announcement:', error.message);
    res.status(500).json({ error: 'Error updating announcement.' });
  }
};
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    res.status(200).json({ message: 'Announcement deleted successfully.' });
  } catch (error) {
    console.error('Error deleting announcement:', error.message);
    res.status(500).json({ error: 'Error deleting announcement.' });
  }
};
exports.createCreator = async (req, res) => {
  try {
    const {
      name,
      dob,
      username,
      email,
      contactNumber,
      photo,
      about,
      address,
      education,
      skills,
      assignedCourses,
      assignedBatches,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const creator = new User({
      name,
      dob,
      username,
      email,
      contactNumber,
      photo,
      about,
      address,
      education,
      skills: skills || [],
      assignedCourses: assignedCourses || [],
      assignedBatches: assignedBatches || [],
      password: hashedPassword,
      role: 'Creator',
    });

    await creator.save();

    res.status(201).json({
      message: 'Creator created successfully',
      creator,
    });
  } catch (error) {
    console.error('Error creating creator:', error.message);
    res.status(500).json({ message: 'Error creating creator', error: error.message });
  }
};
exports.getCreators = async (req, res) => {
  try {
    const creators = await User.find({ role: 'Creator' }).populate('assignedCourses').populate('assignedBatches');
    res.status(200).json({ message: 'Creators fetched successfully', creators });
  } catch (error) {
    console.error('Error fetching creators:', error.message);
    res.status(500).json({ message: 'Error fetching creators', error: error.message });
  }
};
exports.updateCreator = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const updatedCreator = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('assignedCourses').populate('assignedBatches');

    if (!updatedCreator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    res.status(200).json({
      message: 'Creator updated successfully',
      updatedCreator,
    });
  } catch (error) {
    console.error('Error updating creator:', error.message);
    res.status(500).json({ message: 'Error updating creator', error: error.message });
  }
};
exports.deleteCreator = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCreator = await User.findByIdAndDelete(id);

    if (!deletedCreator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    res.status(200).json({ message: 'Creator deleted successfully' });
  } catch (error) {
    console.error('Error deleting creator:', error.message);
    res.status(500).json({ message: 'Error deleting creator', error: error.message });
  }
};
exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      email,
      contactNumber,
      photo,
      guardianName,
      address,
      education,
      coursesEnrolled,
      interests,
      languagesPreferred,
      wannaBe,
      experience,
      batch,
      roadmapEnrolled,
      password,
      resume,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const student = new User({
      name,
      dob,
      email,
      contactNumber,
      photo,
      guardianName,
      address,
      education,
      coursesEnrolled,
      interests,
      languagesPreferred,
      wannaBe,
      experience,
      batch,
      roadmapEnrolled,
      resume,
      role: 'Student',
      password: hashedPassword,
    });

    await student.save();
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error('Error creating student:', error.message);
    res.status(500).json({ error: 'Error creating student' });
  }
};
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).populate([
      'coursesEnrolled',
      'batch',
      'roadmapEnrolled',
    ]);

    res.status(200).json({ message: 'Students fetched successfully', students });
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({ error: 'Error fetching students' });
  }
};
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedStudent = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).populate(['coursesEnrolled', 'batch', 'roadmapEnrolled']);

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error.message);
    res.status(500).json({ error: 'Error updating student' });
  }
};
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await User.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    res.status(500).json({ error: 'Error deleting student' });
  }
};
exports.createEmployer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contactNumber,
      photo,
      industry,
      address,
      companySize,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const employer = new User({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      photo,
      industry,
      address,
      companySize,
      role: 'Employer',
    });

    await employer.save();

    res.status(201).json({ message: 'Employer created successfully', employer });
  } catch (error) {
    console.error('Error creating employer:', error.message);
    res.status(500).json({ message: 'Error creating employer', error: error.message });
  }
};
exports.updateEmployer = async (req, res) => {
  try {
    const employerId = req.params.id;
    const updates = req.body;

    const employer = await User.findByIdAndUpdate(employerId, updates, {
      new: true,
      runValidators: true,
    });

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.status(200).json({ message: 'Employer updated successfully', employer });
  } catch (error) {
    console.error('Error updating employer:', error.message);
    res.status(500).json({ message: 'Error updating employer', error: error.message });
  }
};
exports.getEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: 'Employer' });
    res.status(200).json({ message: 'Employers fetched successfully', employers });
  } catch (error) {
    console.error('Error fetching employers:', error.message);
    res.status(500).json({ message: 'Error fetching employers', error: error.message });
  }
};
exports.deleteEmployer = async (req, res) => {
  try {
    const employerId = req.params.id;

    const employer = await User.findByIdAndDelete(employerId);

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.status(200).json({ message: 'Employer deleted successfully' });
  } catch (error) {
    console.error('Error deleting employer:', error.message);
    res.status(500).json({ message: 'Error deleting employer', error: error.message });
  }
};


exports.updateCourse = async (req, res) => {
  try {
    const { courseId, updateData } = req.body;

    // Validate the courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid courseId format' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Validate Course Name (if being updated)
    if (updateData.name) {
      const existingCourse = await Course.findOne({
        name: updateData.name.trim(),
        _id: { $ne: courseId }, // Exclude the current course from the query
      });
      if (existingCourse) {
        return res.status(400).json({ message: 'A course with this name already exists' });
      }
    }

    // Validate Category (if being updated)
    if (updateData.category) {
      const validCategory = await Category.findById(updateData.category);
      if (!validCategory) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }

    // Validate Subcategory (if being updated)
    if (updateData.subcategory) {
      const validSubcategory = await Subcategory.findById(updateData.subcategory);
      if (!validSubcategory) {
        return res.status(400).json({ message: 'Invalid subcategory ID' });
      }
    }

    // Validate Mentor (if being updated)
    if (updateData.mentorAssigned) {
      const validMentor = await User.findById(updateData.mentorAssigned);
      if (!validMentor || validMentor.role !== 'Mentor') {
        return res.status(400).json({ message: 'Invalid mentor ID or user is not a mentor' });
      }
    }

    // Validate Manager (if being updated)
    if (updateData.managerAssigned) {
      const validManager = await User.findById(updateData.managerAssigned);
      if (!validManager || validManager.role !== 'Manager') {
        return res.status(400).json({ message: 'Invalid manager ID or user is not a manager' });
      }
    }

    // Validate Batches (if being updated)
    if (updateData.batchesAvailable && updateData.batchesAvailable.length > 0) {
      const validBatches = await Batch.find({ _id: { $in: updateData.batchesAvailable } });
      if (validBatches.length !== updateData.batchesAvailable.length) {
        return res.status(400).json({ message: 'One or more batch IDs are invalid' });
      }
    }

    // Validate Promo Codes (if being updated)
    if (updateData.promoCodes && updateData.promoCodes.length > 0) {
      const validPromoCodes = await PromoCode.find({ _id: { $in: updateData.promoCodes } });
      if (validPromoCodes.length !== updateData.promoCodes.length) {
        return res.status(400).json({ message: 'One or more promo code IDs are invalid' });
      }
    }

    // Update the course with the provided data (validate only modified fields)
    Object.keys(updateData).forEach((key) => {
      course[key] = updateData[key];
    });

    // Save the updated course with only modified fields validated
    await course.save({ validateModifiedOnly: true });

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Error updating course:', error.message);
    res.status(500).json({ error: 'Error updating course', details: error.message });
  }
};
exports.createLesson = async (req, res) => {
  try {
    const { courseId, title, description, videos, quizzes, assignments } = req.body;

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Validate quizzes
    if (quizzes) {
      quizzes.forEach((quiz) => {
        quiz.questions.forEach((question) => {
          if (!question.question || !question.correctAnswer || question.options.length < 2) {
            throw new Error('Each quiz must have a question, correct answer, and at least two options');
          }
        });
      });
    }

    // Create a new lesson
    const newLesson = {
      title,
      description,
      videos,
      quizzes: quizzes.map((quiz) => ({
        _id: new mongoose.Types.ObjectId(),
        questions: quiz.questions,
      })),
      assignments,
    };

    // Add the lesson to the course
    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
  } catch (error) {
    console.error('Error creating lesson:', error.message);
    res.status(400).json({ error: 'Error creating lesson', details: error.message });
  }
};



exports.getCourseWithLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find course and populate the lessons field
    const course = await Course.findById(courseId).populate({
      path: 'lessons', // Populate the lessons field
      model: 'Lesson', // Use the Lesson model
      select: '-__v', // Exclude the __v field
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error('Error fetching course with lessons:', error);
    res.status(500).json({ error: 'Error fetching course with lessons', details: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { courseId, lessonId, updateData } = req.body;

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

    // Update the lesson with new data
    Object.assign(lesson, updateData);

    // Save the updated course
    await course.save();

    res.status(200).json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    console.error('Error updating lesson:', error.message);
    res.status(500).json({ error: 'Error updating lesson', details: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    // Validate the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the index of the lesson to be deleted
    const lessonIndex = course.lessons.findIndex((lesson) => lesson._id.toString() === lessonId);
    if (lessonIndex === -1) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Remove the lesson from the array
    course.lessons.splice(lessonIndex, 1);

    // Save the updated course
    await course.save();

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error.message);
    res.status(500).json({ error: 'Error deleting lesson', details: error.message });
  }
};




exports.updateQuizOrAssignment = async (req, res) => {
  try {
    const { courseId, lessonId, quizId, assignmentId, updateData } = req.body;

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

    // Update Quiz
    if (quizId) {
      const quiz = lesson.quizzes.id(quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      Object.assign(quiz, updateData); // Update quiz fields
    }

    // Update Assignment
    if (assignmentId) {
      const assignment = lesson.assignments.id(assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
      Object.assign(assignment, updateData); // Update assignment fields
    }

    // Save the updated course
    await course.save();

    res.status(200).json({ message: 'Updated successfully', course });
  } catch (error) {
    console.error('Error updating quiz or assignment:', error.message);
    res.status(500).json({ error: 'Error updating quiz or assignment', details: error.message });
  }
};



exports.deleteLessonQuiz = async (req, res) => {
  try {
    const { lessonId, quizId } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(lessonId) || !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: 'Invalid lessonId or quizId format.' });
    }

    // Find the lesson by ID
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    // Remove the quiz by ID from the lesson's quizzes
    const quiz = lesson.quizzes.id(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    quiz.remove();

    // Save the updated lesson
    await lesson.save();

    res.status(200).json({
      message: 'Quiz deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting lesson quiz:', error.message);
    res.status(500).json({
      error: 'Error deleting lesson quiz.',
      details: error.message,
    });
  }
};
exports.deleteQuizOrAssignment = async (req, res) => {
  try {
    const { courseId, lessonId, quizId, assignmentId } = req.body;

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

    // Delete Quiz
    if (quizId) {
      const quizIndex = lesson.quizzes.findIndex((quiz) => quiz._id.toString() === quizId);
      if (quizIndex === -1) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      lesson.quizzes.splice(quizIndex, 1); // Remove the quiz
    }

    // Delete Assignment
    if (assignmentId) {
      const assignmentIndex = lesson.assignments.findIndex(
        (assignment) => assignment._id.toString() === assignmentId
      );
      if (assignmentIndex === -1) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
      lesson.assignments.splice(assignmentIndex, 1); // Remove the assignment
    }

    // Save the updated course
    await course.save();

    res.status(200).json({ message: 'Deleted successfully', course });
  } catch (error) {
    console.error('Error deleting quiz or assignment:', error.message);
    res.status(500).json({ error: 'Error deleting quiz or assignment', details: error.message });
  }
};
exports.getQuizAndAssignmentCount = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

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

    // Get the count of quizzes and assignments
    const quizCount = lesson.quizzes ? lesson.quizzes.length : 0;
    const assignmentCount = lesson.assignments ? lesson.assignments.length : 0;

    res.status(200).json({
      message: 'Counts retrieved successfully',
      quizCount,
      assignmentCount,
    });
  } catch (error) {
    console.error('Error fetching counts:', error.message);
    res.status(500).json({ error: 'Error fetching counts', details: error.message });
  }
};


exports.addQuizOrAssignment = async (req, res) => {
  try {
    const { courseId, lessonId, quiz, assignment } = req.body;

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

    // Add Quiz
    if (quiz) {
      if (!quiz.question || !quiz.correctAnswer || !quiz.options || quiz.options.length < 2) {
        return res.status(400).json({ message: 'Invalid quiz data. Ensure all fields are correct.' });
      }
      lesson.quizzes.push(quiz);
    }

    // Add Assignment
    if (assignment) {
      if (!assignment.title || !assignment.description) {
        return res.status(400).json({ message: 'Invalid assignment data. Ensure all fields are correct.' });
      }
      lesson.assignments.push(assignment);
    }

    // Save the updated course
    await course.save();

    res.status(201).json({ message: 'Added successfully', lesson });
  } catch (error) {
    console.error('Error adding quiz or assignment:', error.message);
    res.status(500).json({ error: 'Error adding quiz or assignment', details: error.message });
  }
};



exports.createPath = async (req, res) => {
  try {
    const { name, description, courses, roadmap } = req.body;

    // Validate courses
    if (courses && courses.length > 0) {
      const validCourses = await Course.find({ _id: { $in: courses } });
      if (validCourses.length !== courses.length) {
        return res.status(400).json({ message: 'One or more course IDs are invalid' });
      }
    }

    // Create a new path
    const path = new Path({
      name,
      description,
      courses,
      roadmap,
    });

    // Save the path to the database
    await path.save();

    res.status(201).json({ message: 'Path created successfully', path });
  } catch (error) {
    console.error('Error creating path:', error.message);
    res.status(500).json({ error: 'Error creating path', details: error.message });
  }
};
exports.getPath = async (req, res) => {
  try {
    const { pathId } = req.params;

    // Find the path and populate courses
    const path = await Path.findById(pathId).populate('courses', 'name description');
    if (!path) {
      return res.status(404).json({ message: 'Path not found' });
    }

    res.status(200).json({ message: 'Path retrieved successfully', path });
  } catch (error) {
    console.error('Error retrieving path:', error.message);
    res.status(500).json({ error: 'Error retrieving path', details: error.message });
  }
};
exports.updatePath = async (req, res) => {
  try {
    const { pathId, updateData } = req.body;

    // Find the path
    const path = await Path.findById(pathId);
    if (!path) {
      return res.status(404).json({ message: 'Path not found' });
    }

    // Update the fields
    Object.keys(updateData).forEach((key) => {
      path[key] = updateData[key];
    });

    // Save the updated path
    await path.save();

    res.status(200).json({ message: 'Path updated successfully', path });
  } catch (error) {
    console.error('Error updating path:', error.message);
    res.status(500).json({ error: 'Error updating path', details: error.message });
  }
};
exports.deletePath = async (req, res) => {
  try {
    const { pathId } = req.params;

    // Delete the path
    const path = await Path.findByIdAndDelete(pathId);
    if (!path) {
      return res.status(404).json({ message: 'Path not found' });
    }

    res.status(200).json({ message: 'Path deleted successfully' });
  } catch (error) {
    console.error('Error deleting path:', error.message);
    res.status(500).json({ error: 'Error deleting path', details: error.message });
  }
};
exports.getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find the course containing the quiz
    const course = await Course.findOne({ "lessons.quizzes._id": quizId });

    if (!course) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Locate the lesson and quiz
    const lesson = course.lessons.find(lesson =>
      lesson.quizzes.some(quiz => quiz._id.toString() === quizId)
    );

    const quiz = lesson.quizzes.find(quiz => quiz._id.toString() === quizId);

    res.status(200).json({
      quizId: quiz._id,
      questions: quiz.questions,
      lessonTitle: lesson.title,
      courseName: course.name,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error.message);
    res.status(500).json({ error: "Error fetching quiz" });
  }
};


exports.getAllCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Course.find({})
      .populate('category', 'name') // Populate category field (only name)
      .populate('subcategory', 'name') // Populate subcategory field (only name)
      .populate('mentorAssigned', 'name email') // Populate mentor details
      .populate('managerAssigned', 'name email'); // Populate manager details

    res.status(200).json({
      message: 'All courses fetched successfully',
      courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    res.status(500).json({
      error: 'Error fetching courses',
      details: error.message,
    });
  }
};
exports.pauseUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📌 Admin requested to pause user: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      console.log("⚠️ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`🔍 Current User Status: ${user.status}`);

    // ✅ Allow transition from "Disapproved" to "Active"
    if (user.status === "Disapproved") {
      user.status = "Active";
    } else if (user.status === "Active") {
      user.status = "Paused";
    } else if (user.status === "Paused") {
      user.status = "Active";
    } else {
      console.error(`❌ Invalid status detected: ${user.status}`);
      return res.status(400).json({ message: "Invalid user status" });
    }

    console.log(`✅ Updated User Status: ${user.status}`);

    await user.save();

    res.status(200).json({ message: `User ${user.status} successfully`, user });
  } catch (error) {
    console.error("❌ Error pausing user:", error);
    res.status(500).json({ message: "Error pausing user", error: error.message });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`📌 Admin requested to delete user: ${userId}`);

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      console.log("⚠️ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`🗑️ User ${userId} deleted successfully`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
