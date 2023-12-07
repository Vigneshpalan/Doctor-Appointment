const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MD);
        console.log("Database is connected");
    } catch (error) {
        console.log(`Database error: ${error}`);
    }
};

module.exports = connectDB;
