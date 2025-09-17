// routes/moodRoutes.js
const express = require("express");
const router = express.Router();
const Mood = require("../models/mood");
// const { ensureAuthenticated } = require("../config/auth"); // middleware to check login
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
// GET mood tracker & dashboard data
router.get("/", ensureAuth, async (req, res) => {
  const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 }).limit(7); // last 7 days
  const moodData = moods.map(m => ({
    day: m.date.toLocaleDateString("en-US", { weekday: "short" }),
    mood: m.mood
  }));
  res.render("dashboard", {title:"Mood tracker",
    user: req.user,
    moodData: {
      previous: moodData.reverse(), // so oldest first
      current: moodData[0] ? moodData[0].mood : "Neutral",
      weeklyLevels: moods.map(m => {
        if(m.mood.toLowerCase() === "happy") return 5;
        if(m.mood.toLowerCase() === "neutral") return 3;
        return 1;
      }).reverse()
    },
    quizSummary: { lastResult: "N/A" }, // placeholder
    bookings: [{ counselor: "Dr. Sharma", date: "15 Sept 5PM" }] // placeholder
  });
});

// POST mood tracker submission
router.post("/", ensureAuth, async (req, res) => {
  const { mood, note } = req.body;
  await Mood.create({ user: req.user._id, mood, note });
  res.redirect("/dashboard");
});

module.exports = router;
