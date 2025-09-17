const express = require("express");
const router = express.Router();

// Middleware to ensure login
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// Quick resource list
const resourcesList = [
  { title: "Relaxation Video", link: "https://www.youtube.com/watch?v=2OEL4P1Rz04" },
  { title: "Mindfulness Guide", link: "https://www.youtube.com/watch?v=nmFUDkj1Aq0" },
  { title: "E-Book: Mental Health Tips", link: "https://www.mentalhealth.org.uk/publications/ebooks" },
];

router.get("/resources", ensureAuth, (req, res) => {
  res.render("resources", { title: "Resources", user: req.user, resources: resourcesList });
});

module.exports = router;
