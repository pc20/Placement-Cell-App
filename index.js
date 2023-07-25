// express server 
const express = require('express');
const app = express();
const session = require("express-session");

// for securing credentials
require("dotenv").config();

// db connection
const db = require("./config/mongoose");
db();

// passport for authentication
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

//  for flash messages
const flash = require("connect-flash");
const customMiddleware = require('./config/flashMiddleware');

app.use(express.urlencoded());

// set up the view engine
app.use(express.static("./assets"));
app.set('view engine', 'ejs');
app.set('views', './views');

// create sessions
app.use(
    session({
        name: "authenticateSystem",
        secret: "blasomething",
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 100,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMiddleware.setMsg);

// use express router
app.use('/', require('./routes'));

const PORT = process.env.PORT;
app.listen(PORT, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${PORT}`);
});