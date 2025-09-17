const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Load questions
const questions = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/phq5.json"))
);
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
// Quiz page
router.get("/",ensureAuth, (req, res) => {
  res.render("quiz", { questions ,title: 'Quizes'});
});

// Handle form submission
router.post("/submit", (req, res) => {
  const answers = req.body; // comes as { q1: "0", q2: "1", ... }
  let score = 0;

  Object.values(answers).forEach(ans => {
    score += parseInt(ans); // option index = score
  });

  let result = "";
  if (score <= 4) result = "Minimal depression";
  else if (score <= 9) result = "Mild depression";
  else if (score <= 14) result = "Moderate depression";
  else result = "Severe depression";

  res.render("quizResult", { score, result });
});

module.exports = router;
