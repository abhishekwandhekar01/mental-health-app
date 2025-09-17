const express = require("express");
const router = express.Router();

router.get("/crisis", (req, res) => {
  res.render("crisis",{title: 'Crisis Support'});
});

module.exports = router;