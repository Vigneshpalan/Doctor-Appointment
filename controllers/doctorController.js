const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    console.log(doctor)
    
    
    res.status(200).send({
      success: true,
      message: "Doctor Data Fetch Success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

// update doc profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update Issue",
      error,
    });
  }
};

//get single docotor
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Single Doctor Info",
    });
  }
};
const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({userId: req.body.userId});

    if (!doctor) {
      console.log("Doctor not found for userId: " + req.body.userId);
      return res.status(404).send({
        success: false,
        message: "Doctor not found for the provided user ID",
      });
    }

    const appointments = await appointmentModel.find({ doctorId: doctor._id });

  

    res.status(200).send({
      success: true,
      message: "Doctor Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Doctor Appointments",
    });
  }
};



const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    let notification = user.notification || []; 
    notification.push({
      type: "status-updated",
      message: `Your Appointment Has Been Updated ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await userModel.updateOne(
      { _id: user._id },
      { $set: { notification: notification } }
    );
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};
const Review = require('../models/reviewSchema');

const getdocreviews = async (req, res) => {
  try {
    const doctorId = req.query.doctorId;
    const reviews = await Review.find({ doctorId: doctorId });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ success: false, message: 'No reviews found for this doctorId.' });
    }

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching reviews.' });
  }
};




const delr= async (req, res) => {
 
  try {
    const reviewId = req.params.reviewId;
    const { ObjectId } = require('mongoose');
    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid reviewId', success: false });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      // If the review with the given ID does not exist, return a "404 Not Found" response.
      return res.status(404).json({ message: 'Review not found', success: false });
    }

    // Review deleted successfully.
    res.status(200).json({ message: 'Review deleted successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete review', success: false });
  }
};

const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;  // For working with the file system
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');  // Specify the directory to store files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Unique filename based on timestamp
  },
});

const upload = multer({ storage: storage }).single('file');



const shareHealthRecords = async (req, res) => {
  const { toEmail, filePath } = req.body;
  
  try {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // use 'gmail' service
        auth: {
          user: 'mediplus347@gmail.com', // replace with your gmail address
          pass: 'twsl scta tici rzlh' // replace with your gmail password
        }
      });
  
      const mailOptions = {
        from: 'Your Health Records <your-health-records@example.com>',
        to: toEmail,
        subject: 'Your Health Records',
        text: 'Please find attached your health records.',
        attachments: [
          {
            filename: 'HealthRecords.pdf',
            path: filePath
          }
        ]
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send email.' });
  }
 }

module.exports = { shareHealthRecords,getdocreviews, delr,getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController };