const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  User.findById(_id, (err, user) => {
    if (err) {
      done(null, false, { error: err });
    } else {
      done(null, user);
    }
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for google strat
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.ClientID,
      clientSecret: keys.google.ClientSECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      console.log(profile);
      User.findOne({ googleId: profile.id }).then((currUser) => {
        if (currUser) {
          // Already have user
          console.log("user is" + currUser);
          done(null, currUser);
        } else {
          // if not, create user
          const newUser = User.create({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture,
          }).then((newUser) => {
            console.log("New user created" + newUser);
          });
        }
      });
    }
  )
);
