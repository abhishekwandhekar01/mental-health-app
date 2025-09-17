const express = require("express");
const router = express.Router();

// Middleware to ensure login
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}


// GET booking page
router.get("/", ensureAuth, (req, res) => {
  res.render("booking", { title: "Book a Session", user: req.user });
});

// POST booking form
router.post("/", ensureAuth, (req, res) => {
  // In a real app, save booking to DB
  const { counselor, date, time } = req.body;
  // For now, just show a confirmation page
  res.render("booking", {
    title: "Book a Session",
    user: req.user,
    confirmation: `Session booked with ${counselor} on ${date} at ${time}.`
  });
});

module.exports = router;
