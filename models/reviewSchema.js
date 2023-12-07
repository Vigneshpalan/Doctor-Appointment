const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctors" },
  rating: { type: Number, required: true },
  comment: { type: String },
});

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review;
