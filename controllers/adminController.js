

const User = require('../models/User');
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
    const { title, description, price, categoryId, subcategoryId } = req.body;

    // Verify Category and Subcategory existence
    const category = await Category.findById(categoryId);
    const subcategory = await Subcategory.findById(subcategoryId);

    if (!category || !subcategory) {
      return res.status(404).json({ message: 'Category or Subcategory not found' });
    }

    const course = new Course({
      title,
      description,
      price,
      categoryId,
      subcategoryId,
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ error: 'Error creating course' });
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

// Approve a blog
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

// View analytics

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
    const { courseId, name, startDate, endDate, mentor } = req.body;

    const batch = new Batch({ courseId, name, startDate, endDate, mentor });
    await batch.save();

    res.status(201).json({ message: 'Batch created successfully', batch });
  } catch (error) {
    res.status(500).json({ error: 'Error creating batch', details: error.message });
  }
};



// exports.createMentor = async (req, res) => {
//   try {
//     const { name, email, password, skills } = req.body;

//     // Ensure the role is 'Mentor'
//     const role = 'Mentor';

//     const mentor = new User({ name, email, password, role, skills });
//     await mentor.save();

//     res.status(201).json({ message: 'Mentor created successfully', mentor });
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating mentor', details: error.message });
//   }
// };


exports.createMentor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Mentor already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the mentor account
    const newMentor = new User({
      name,
      email,
      password: hashedPassword,
      role: 'Mentor', // Assign the Mentor role
    });

    await newMentor.save();

    res.status(201).json({ message: 'Mentor created successfully', mentor: newMentor });
  } catch (error) {
    console.error('Error creating mentor:', error.message);
    res.status(500).json({ message: 'Server error: Unable to create mentor' });
  }
};

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


exports.exportTransactions = async (req, res) => {
  try {
    const { courseId, category, subcategory } = req.query;

    // Build the query dynamically based on filters
    const query = {};
    if (courseId) query.courseId = courseId;
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    console.log('Query:', query); // Log the query for debugging

    // Fetch transactions and populate necessary fields
    const transactions = await Transaction.find(query)
      .populate({
        path: 'studentId',
        select: 'name email', // Only fetch necessary fields from User
      })
      .populate({
        path: 'courseId',
        select: 'title', // Only fetch course title
      });

    console.log('Transactions:', transactions); // Log transactions for debugging

    // Check if transactions exist
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the given filters.' });
    }

    // Define fields for CSV
    const fields = [
      {
        label: 'Student Name',
        value: (row) => (row.studentId ? row.studentId.name : 'N/A'), // Handle missing data
      },
      {
        label: 'Student Email',
        value: (row) => (row.studentId ? row.studentId.email : 'N/A'), // Handle missing data
      },
      {
        label: 'Course Title',
        value: (row) => (row.courseId ? row.courseId.title : 'N/A'), // Handle missing data
      },
      { label: 'Amount', value: 'amount' },
      { label: 'Payment Date', value: 'paymentDate' },
    ];

    // Create CSV file
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(transactions);

    // Set response headers and send the CSV
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Error exporting transactions:', error.message);
    res.status(500).json({ error: 'Error exporting transactions' });
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

// Create Subcategory
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
    const { code, discountPercentage, expiryDate, usageLimit, courseId } = req.body;

    let discountedPrice = null;

    // Fetch course price if courseId is provided
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      discountedPrice = course.price - (course.price * discountPercentage) / 100;
    }

    // Create the promo code
    const promo = new PromoCode({
      code,
      discountPercentage,
      expiryDate,
      usageLimit,
      courseId: courseId || null,
    });

    await promo.save();

    res.status(201).json({
      message: 'Promo code created successfully',
      promo,
      ...(courseId && { originalPrice: discountedPrice ? discountedPrice / (1 - discountPercentage / 100) : null }), // Original Price
      ...(discountedPrice && { discountedPrice }), // New Price After Discount
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating promo code' });
  }
};

exports.getPromoCodes = async (req, res) => {
  try {
    const { courseId } = req.query;

    const query = {};
    if (courseId) query.courseId = courseId;

    const promoCodes = await PromoCode.find(query).populate('courseId');
    res.status(200).json({ message: 'Promo codes retrieved successfully', promoCodes });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving promo codes' });
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

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .select('title price description categoryId subcategoryId');

    res.status(200).json({
      message: 'Courses fetched successfully',
      courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};




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
    const query = courseId ? { courseId } : {}; // Optional filter by courseId
    const batches = await Batch.find(query).select('_id name');
    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: 'No batches found' });
    }
    res.status(200).json({ batches });
  } catch (error) {
    console.error('Error fetching batches:', error.message);
    res.status(500).json({ message: 'Error fetching batches' });
  }
};

exports.getMentors = async (req, res) => {
  try {
    // Fetch all users with role Mentor
    const mentors = await User.find({ role: 'Mentor' }).select('_id name email role');

    if (!mentors || mentors.length === 0) {
      return res.status(404).json({ message: 'No mentors found' });
    }

    res.status(200).json({ mentors });
  } catch (error) {
    console.error('Error fetching mentors:', error.message);
    res.status(500).json({ message: 'Error fetching mentors' });
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
    const { studentId, courseId, amount, paymentMethod } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ message: 'Student ID and Course ID are required' });
    }

    const transaction = new Transaction({
      transactionId: `T${Date.now()}`, // Generate a unique transaction ID
      amount,
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Success',
      studentId,
      courseId,
      paymentDate: new Date(),
    });

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

exports.addAnnouncement = async (req, res) => {
  try {
    const { title, message, targetRoles } = req.body;

    if (!title || !message || !targetRoles) {
      return res.status(400).json({ message: 'Title, message, and target roles are required.' });
    }

    const announcement = new Announcement({
      title,
      message,
      targetRoles,
      createdBy: req.user.id, // Ensure admin ID is added to the announcement
    });

    await announcement.save();

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: {
        title: announcement.title,
        message: announcement.message,
        targetRoles: announcement.targetRoles,
        createdBy: announcement.createdBy,
        createdAt: announcement.createdAt, // Include createdAt in the response
      },
    });
  } catch (error) {
    console.error('Error creating announcement:', error.message);
    res.status(500).json({ error: 'Error creating announcement' });
  }
};



exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json({
      message: 'Announcements fetched successfully',
      announcements,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error.message);
    res.status(500).json({ message: 'Error fetching announcements' });
  }
};

