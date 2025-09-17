const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

router.get("/register", (req, res) => res.render("register",{title: 'Register'}));
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  await User.create({ email, password });
  res.redirect("/login");
});

router.get("/login", (req, res) => res.render("login",{title: 'Login'}));
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
}));

router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

module.exports = router;
