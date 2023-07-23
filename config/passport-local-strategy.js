const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

// authentication using passport
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
        },
        function (usermail, password, done) {
            // find a user and establish the identity
            User.findOne({ email: usermail }).then((user) => {
                let res = User.validPassword(password, user.password);
                if (res == false) {
                    console.log("Invalid Password");
                    return done(null, false, { message: "Invalid Password" });
                }
                return done(null, user);
            }).catch((err) => {
                console.log("Invalid Username");
                return done(null, false, { message: "Invalid Username" });
            });
        }
    )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => {
        return done(null, user);
    }).catch((err) => {
        console.log("Error in finding user --> Passport");
        return done(err);
    });
});

//check if user is authenticated

passport.checkAuthentication = function (req, res, next) {
    //if the user is sign in  then pass the request to next function that is (controllers -action);
    if (req.isAuthenticated()) {
        console.log('user authenticated');
        if (!(res.locals.flash.success.length === 0)) {
            req.flash("success", res.locals.flash.success);
        }
        return next();
    } else {
        console.log('user authentication failed');
    }
    //if the user is not sign in then pass the request to

    return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        //req.user contain the current singed in user from session cookie
        res.locals.user = req.user;
    }

    next();
};

module.exports = passport;