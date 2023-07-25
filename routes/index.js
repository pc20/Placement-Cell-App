const express = require('express');
const router = express.Router();
const passport = require('../config/passport-local-strategy');
const Student = require('../models/students');

// if user is authenticated redirect to home page else logIn page
router.get("/", passport.checkAuthentication, async function (req, res) {
    const students = await Student.find({});
    return res.render('home', { students });
});

router.use('/users', require('./users'));
router.use('/students', require('./student'));
router.use('/interview', require('./interview'));

module.exports = router;