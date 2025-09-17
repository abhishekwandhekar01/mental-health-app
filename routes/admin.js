const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/login", (req, res) => res.render("adminLogin",{title: 'Admin Login'}));

router.post("/login", passport.authenticate("local", {
  successRedirect: "/admin/dashboard",
  failureRedirect: "/admin/login",
}));

router.get("/dashboard", ensureAdmin, (req, res) => {
  res.render("adminDashboard", { user: req.user,title: 'Admin Dash' });
});

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.redirect("/admin/login");
}

module.exports = router;
