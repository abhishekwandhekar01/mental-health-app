const mongoose = require("mongoose");

const MoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: String, enum: ["Happy", "Neutral", "Sad"], required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }   // ✅ default ensures no undefined
});

module.exports = mongoose.model("Mood", MoodSchema);