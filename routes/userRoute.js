const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,addReview, getReviews, getUserByIdController, image,retrive , updateUserProfileController
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routes
// POST || LOGIN USER
router.post("/login", loginController);

//POST || REGISTER USER
router.post("/register", registerController);

//Auth || POST
router.post("/getUserData", authMiddleware, authController);

//Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//Notifiaction  Doctor || POST
router.post("/get-all-notification", authMiddleware, getAllNotificationController);

//Notifiaction  Doctor || POST
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);

//GET ALL DOC
router.get("/getAllDoctors", authMiddleware, getAllDocotrsController);

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppointmentController);

//Booking Avliability
router.post("/booking-availbility", authMiddleware, bookingAvailabilityController);

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);
router.post('/addr/:doctorId', authMiddleware,addReview);
router.get('/getr', authMiddleware,getReviews);
router.get('/getUserProfile', authMiddleware,getUserByIdController);
router.post('/updateProfile', authMiddleware, upload.single('image'), updateUserProfileController);
router.post('/upload', upload.single('image'),authMiddleware,image)
router.get('/retrieve',authMiddleware,retrive)
module.exports = router;
