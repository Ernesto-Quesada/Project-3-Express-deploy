const passport = require('passport');
const bcrypt = require('bcrypt');
// const FbStrategy = require('passport-facebook').Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
// The same as:
// const passportLocal = require('passport-local');
// const LocalStrategy = passportLocal.Strategy;


const User = require('../models/userModel.js');


// Determines WHAT TO SAVE in the session (what to put in the box)
// (called when you log in)
passport.serializeUser((user, cb) => {
  // "cb" is short for "callback"
  cb(null, user._id);
});


// Where to get the rest of the user's information (given what's in the box)
// (called on EVERY request AFTER you log in)
passport.deserializeUser((userId, cb) => {
  // "cb" is short for "callback"

  // query the database with the ID from the box
  User.findById(userId, (err, theUser) => {
    if (err) {
      cb(err);
      return;
    }

    // sending the user's info to passport
    cb(null, theUser);
  });
});

passport.use( new LocalStrategy(
  // 1st arg -> options to customize LocalStrategy
  {
      // <input name="loginEmailInput">
    usernameField: 'loginEmailInput',    
      // <input name="loginPassword">
    passwordField: 'loginPassword'
  },

  // 2nd arg -> callback for the logic that validates the login
  (loginEmailInput, passwordField, next) => {

    User.findOne(
      { email: loginEmailInput },

      (err, theUser) => {
        // Tell Passport if there was an error (nothing we can do)
        if (err) {
          next(err);
          return;
        }

        // Tell Passport if there is no user with given username
        if (!theUser) {
            //       false in 2nd arg means "Log in failed!"
            //         |
          next(null, false, { message: 'Wrong username' });
          return;  //   |
        }          //   v
                   // message -> req.flash('error')

        // Tell Passport if the passwords don't match
        if (!bcrypt.compareSync(passwordField, theUser.encryptedPassword)) {
            //       false in 2nd arg means "Log in failed!"
            //         |
          next(null, false, { message: 'Wrong password' });
          return;  //   |
        }          //   v
                   // message -> req.flash('error')

        // Give Passport the user's details (SUCCESS!)
        next(null, theUser, {
          // message -> req.flash('success')
          message: `Login for ${theUser.username} successful.`
        });
          // -> this user goes to passport.serializeUser()
      }
    );
  }
) );