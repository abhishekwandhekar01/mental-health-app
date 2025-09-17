const express = require("express");
const router = express.Router();

// Show tickets page
router.get("/", (req, res) => {
  res.render("worldChatTickets", { title: "World Chat" });
});

// Individual ticket page
router.get("/ticket/:id", (req, res) => {
  res.render("worldChatRoom", { title:"World Chat",ticketId: req.params.id });
});

module.exports = router;
// 