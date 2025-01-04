const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'Student,Employer',
            isOAuthUser: true,
          });
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize user into the session (store only the user ID)
passport.serializeUser((user, done) => {
  done(null, user.id); // Save the user ID in the session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Retrieve user details using the ID
    done(null, user); // Attach the user object to req.user
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;