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
const crisisRoutes = require("./routes/crisis");



dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(expressLayouts);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/Testapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));

app.use(session({
  secret: "hackathonSecret",
  resave: false,
  saveUninitialized: false
}));

require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  res.locals.user = req.user || null; 
  next();
});



const bookingRoutes = require("./routes/booking");


const chatRoutes = require("./routes/chatRoutes");
const quizRoutes = require("./routes/quiz");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

app.use("/chat", chatRoutes);
app.use("/quiz", quizRoutes);
app.use("/", authRoutes);        
app.use("/admin", adminRoutes);  
app.use("/", dashboardRoutes);
app.use("/mood-tracker", moodRoutes);
app.use("/", resourcesRoute); 
app.use("/", crisisRoutes);

app.use("/booking", bookingRoutes);


app.get("/", (req, res) => {
  res.render("login",{title: 'Quizes'}); 
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
