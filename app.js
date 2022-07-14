const express = require("express");
const app = express();
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");

// Set up view engine
app.set("view engine", "ejs");

// connect to mongoose
mongoose.connect(keys.mongodb.dbURI, () => {
  console.log("connected to mongodb");
});

// express-session
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "deeprakholiyadeeprakholiya",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// cookie parser middleware
app.use(cookieParser());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
