const router = require("express").Router();
const passport = require("passport");

// auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// auth logout
router.get("/logout", (req, res) => {
  // Handle with passport
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// callback route for google redirect
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile/");
  console.log("Username:- ", req.user.username);
});

module.exports = router;
