const express = require('express');
const router = express.Router();
const passport = require('../config/passport-local-strategy');
const usersController = require('../controller/userController');

// GET REQUEST
router.get("/sign-out", usersController.signOut);
router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);
router.get('/download-csv', passport.checkAuthentication, usersController.downloadCsv);

// POST REQUEST

// add user
router.post('/register', usersController.register);
// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/sign-in?error=true' },
), usersController.createSession);


module.exports = router;