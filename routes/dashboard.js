const express = require("express");
const router = express.Router();
const Mood = require("../models/mood");

// Middleware: Ensure user is logged in
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get("/dashboard", ensureAuth, async (req, res) => {
  const userId = req.user._id;

  // Fetch last 7 moods
  const moods = await Mood.find({ user: userId }).sort({ createdAt: -1 }).limit(7);

  const moodData = {
    current: moods.length ? moods[0].mood : "No data",
    previous: moods.filter(m => m.createdAt).map(m => ({
      day: m.createdAt.toLocaleDateString("en-US", { weekday: "short" }),
      mood: m.mood
    })),
    weeklyLevels: moods.filter(m => m.mood).map(m => {
      if(m.mood.toLowerCase() === "happy") return 5;
      if(m.mood.toLowerCase() === "neutral") return 3;
      if(m.mood.toLowerCase() === "sad") return 1;
      return 0;
    }).reverse()
  };

  // Crisis alert if current mood is sad
  const crisis = moodData.current.toLowerCase() === "sad";

  res.render("dashboard", { title: "Dashboard", user: req.user, moodData, crisis });
});

module.exports = router;
