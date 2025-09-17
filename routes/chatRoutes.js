// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const sensitiveWords = ["suicide", "kill", "die", "harm", "self-harm"];
const crisisNumbers = [
  { country: "India", number: "+91-9152987821" },
  { country: "US", number: "1-800-273-8255" },
];
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat page
router.get("/", ensureAuth,(req, res) => {
  res.render("chat", { title: "Mental Health Chatbot" });
});

// Chat API
router.post("/", async (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  // Crisis word filter
  const foundWord = sensitiveWords.find(word => userMessage.includes(word));
  if (foundWord) {
    const crisisInfo = crisisNumbers
      .map(c => `${c.country}: <a href="tel:${c.number}">${c.number}</a>`)
      .join("<br>");
    return res.json({
      reply: `⚠️ Warning: It seems you may be in crisis.<br>${crisisInfo}`,
      alert: true,
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userMessage);
    const botReply = result.response.text();

    res.json({ reply: botReply, alert: false });
  } catch (error) {
    console.error("Gemini error:", error);
    res.json({ reply: "Error: could not get response", alert: false });
  }
});

module.exports = router;
