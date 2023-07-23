const express = require('express');
const router = express.Router();
const passport = require('../config/passport-local-strategy');
const usersController = require('../controller/userController');

router.get("/sign-out", usersController.signOut);
router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);
router.post('/register', usersController.register);

router.get('/download-csv', passport.checkAuthentication, usersController.downloadCsv);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/sign-in' },
), usersController.createSession);


module.exports = router;