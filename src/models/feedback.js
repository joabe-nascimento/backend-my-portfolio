const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: String,
  feedback: String,
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

feedbackSchema.index({ createdAt: -1 }); // Adicione um índice

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
