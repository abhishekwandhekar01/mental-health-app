const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const dashboardRoutes = require("./routes/dashboard");
const moodRoutes = require("./routes/moodRoutes");
const resourcesRoute = require("./routes/resources");
// const worldChatRoutes = require("./routes/worldChat");
const crisisRoutes = require("./routes/crisis");

// const { Server } = require("socket.io");


dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(expressLayouts);

// Static & Body Parsers
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/Testapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));

// Sessions
app.use(session({
  secret: "hackathonSecret",
  resave: false,
  saveUninitialized: false
}));

// Passport Config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware: make currentRoute available in all views
app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  res.locals.user = req.user || null; // so user info available in EJS
  next();
});



const bookingRoutes = require("./routes/booking");


const chatRoutes = require("./routes/chatRoutes");
const quizRoutes = require("./routes/quiz");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

app.use("/chat", chatRoutes);
app.use("/quiz", quizRoutes);
app.use("/", authRoutes);        // /login, /register
app.use("/admin", adminRoutes);  // /admin/login, /admin/dashboard
app.use("/", dashboardRoutes);
app.use("/mood-tracker", moodRoutes);
app.use("/", resourcesRoute);  // can also use /resources
app.use("/", crisisRoutes);
// app.use("/world-chat", worldChatRoutes);

// const bookingRoutes = require("./routes/booking");
app.use("/booking", bookingRoutes);


// Default route
app.get("/", (req, res) => {
  res.render("login",{title: 'Quizes'}); // default landing = login
});

// Start Server
app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
