const mongoose = require('mongoose');
const zxcvbn = require('zxcvbn');
const icon = './df.jpg';
const fs = require('fs');

const userMongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    minlength: [2, 'Your name must be at least 2 characters'],
    maxlength: [50, 'Your name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  imagePublicId:{
    type: String,
    
  },
 
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    validate: [
      {
        validator: function (value) {
          const passwordStrength = zxcvbn(value).score;
          return passwordStrength >= 3; // Require a minimum strength of 3 out of 4
        },
        message: 'Password is too weak',
      },
      {
        validator: function (value) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value);
        },
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    ],
  },
  
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  notification: {
    type: Array,
    default: [],
  },
  seennotification: {
    type: Array,
    default: [],
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

// Create a Mongoose model
const User = mongoose.model('users', userMongooseSchema);

// Export the model
module.exports = User;
