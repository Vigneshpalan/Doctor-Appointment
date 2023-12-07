const bcrypt = require("bcryptjs");
const userModel = require('../models/userModel');
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send('User Not Found');
    }
    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('Invalid Password');
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:"1d"},);
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    console.log(process.env.JWT_SECRET);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

//Register Callback
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash and salt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      user.password = undefined; // move this line here
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// Appply Doctor Controller
const applyDoctorController = async (req, res) => {
  try {
    // Remove the doctorId from the request body, as it's generated automatically
    const { doctorId, ...doctorData } = req.body;

    const newDoctor = await doctorModel({ ...doctorData, status: "pending" });
    await newDoctor.save();
    
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Doctor",
    });
  }
};


// Notification controller
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All Notifications Marked As Read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error In Notification",
      success: false,
      error,
    });
  }
};

// delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable To Delete All Notifications",
      error,
    });
  }
};

//GET ALL DOC
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor",
    });
  }
};

const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const startTime = moment(req.body.time, "HH:mm").toISOString();
    const doctorId = req.body.doctorId;
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }
    const start = moment(doctor.starttime, "HH:mm").toISOString();
    const end = moment(doctor.endtime, "HH:mm").toISOString();
    if (!moment(startTime).isBetween(start, end, undefined, "[]")) {
      return res.status(200).send({
        message: "Appointment Not Available",
        success: false,
      });
    }
    const appointments = await appointmentModel.find({
      doctor: doctorId,
      date,
      time: startTime,
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment Not Available",
        success: false,
      });
    }
    return res.status(200).send({
      success: true,
      message: "Appointment Available",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error Checking Appointment Availability",
    });
  }
};
const mongoose = require('mongoose');


const bookAppointmentController = async (req, res) => {
  try {
    // Extract necessary data from the request
    const { doctorId, userId, date, time, doctorInfo, userInfo } = req.body;

    // Create the appointment in your database
    const newAppointment = new  appointmentModel({
      doctorId,
      userId,
      date,
      time,
      doctorInfo,
      userInfo,
    });

    // Save the appointment
    await newAppointment.save();

    // Send a success response
    res.status(201).json({ success: true, message: 'Appointment booked successfully.' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to book the appointment.' });
  }
};


const userAppointmentsController = async (req, res) => {
  try {
  
    const userId = req.body.userId;

    // Fetch user-specific appointments by filtering based on userId
    const appointments = await appointmentModel.find({ userId });

    res.status(200).send({
      success: true,
      message: "User Appointments Fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error Fetching User Appointments",
    });
  }
};

const Review = require('../models/reviewSchema');

// Create a new review
const addReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const { doctorId } = req.body.userId; // Assuming you have a middleware to get the user from the request
    const review = new Review({ name, doctorId, rating, comment });
    await review.save();
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'An error occurred while adding the review.' });
  }
};



// Get all reviews
const getReviews = async (req, res) => {
  try {
    const { userId } = req.body.userId; // Assuming you have a middleware to get the user from the request
    const reviews = await Review.find({ userId });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching reviews.' });
  }
};
const getUserByIdController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    if (!user) {
      console.log("User not found for userId: " + req.body.userId);
      return res.status(404).send({
        success: false,
        message: "User not found for the provided user ID",
      });
    }

    let imageData = null;

    if (user.image) {
      // Convert buffer to base64
      imageData = user.image.toString('base64');
    }

    res.status(200).send({
      success: true,
      message: "User Info Fetched",
      data: {
        ...user.toObject(),
        image: imageData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in User Info Fetching",
    });
  }
};


// Multer configuration
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');

// Create the 'uploads' directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and JPG files are allowed'), false);
    }
  },
});


const updateUserProfileController = async (req, res) => {
  try {
    // Access the user ID from the middleware
    const userId = req.body.userId || req.user._id;

    // Find the user by _id
    const user = await userModel.findByIdAndUpdate(
      userId,
      { name: req.body.name, email: req.body.email },
      { new: true }
    );

    // If the user is not found, return an error response
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    // If a profile image is provided, update the user's image
    if (req.file) {
      user.image = req.file.buffer;
    }

    // Save the updated user
    await user.save();

    // Fetch the user again to get the updated information
    const updatedUser = await userModel.findById(user._id);

    res.status(201).send({
      success: true,
      message: 'User Profile Updated',
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'User Profile Update Issue',
      error,
    });
  }
};
const cloudinary = require('cloudinary').v2;

const retrive=async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve user record from the database
    const user = await userModel.findOne({ userId });

    if (!user || !user.imagePublicId) {
      return res.status(404).json({ success: false, message: 'User not found or no image available' });
    }

    // Construct the Cloudinary URL using the public ID
    const imageUrl = cloudinary.url(user.imagePublicId);

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const image =async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if file is present in the request
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.buffer);

    // Update or create user record in the database with the Cloudinary public ID
    await userModel.findOneAndUpdate(
      { userId },
      { imagePublicId: result.public_id },
      { upsert: true, new: true }
    );

    res.json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


module.exports = {addReview,upload, image,retrive ,updateUserProfileController,getUserByIdController, getReviews , loginController, registerController, authController , applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDocotrsController, bookAppointmentController, bookingAvailabilityController, userAppointmentsController};