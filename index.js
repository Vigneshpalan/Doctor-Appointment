const express = require("express");

const moragan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDb");

//dotenv conig
dotenv.config();
const cloudinary = require('cloudinary').v2;
//mongodb connection
connectDB();

//rest obejct
const app= express();
const cors = require('cors');
//middlewares
app.use(express.json());
app.use(moragan("dev"));
//routes
app.use(cors());
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/doctor", require("./routes/doctorRoute"));
app.use(express.static('public'));
//port
const port = process.env.PORT || 4000;

          
cloudinary.config({ 
  cloud_name: 'ds3qlgaxa', 
  api_key: '414672861223827', 
  api_secret: 'qH-ox25wdSV24o-71CSAP1A4Vc0' 
});
//listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      
  );
});