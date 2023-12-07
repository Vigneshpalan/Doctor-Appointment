const mongoose = require('mongoose');
const uuid = require('uuid');
const fs = require('fs');
const imageBuffer = fs.readFileSync('C:/Users/Vignesh/Desktop/internship/g/AppointDoc/image/th.jpg');
const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    default: uuid.v4(),
    required: true,
    unique: true,
  },
  userId: {
    type: String,
  },
  image:{
    type: Buffer,
    default:imageBuffer,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [2, 'Your first name must be at least 2 characters'],
    maxlength: [50, 'Your first name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [2, 'Your last name must be at least 2 characters'],
    maxlength: [50, 'Your last name cannot exceed 50 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  website: {
    type: String,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
  },
  feesPerConsultation: {
    type: Number,
    required: [true, 'Fee is required'],
  },
  status: {
    type: String,
    default: 'pending',
  },
  starttime: {
    type: String,
    required: [true],
  },
  endtime: {
    type: String,
    required: [true],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'appointments', // Reference the Appointment model
    },
  ],
});

const doctorModel = mongoose.model('doctors', doctorSchema);
module.exports = doctorModel;
