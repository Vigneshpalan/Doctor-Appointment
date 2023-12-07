const express = require("express");
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory as binary data
const upload = multer({ storage: storage }).single('file');
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,delr,
  updateStatusController,getdocreviews, shareHealthRecords
} = require("../controllers/doctorController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST  GET SINGLE DOC INFO
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

//GET Appointments
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);
router.get("/dr", authMiddleware, getdocreviews);
router.post("/del/:reviewId", authMiddleware, delr);
router.post('/share',shareHealthRecords);
module.exports = router;