const express = require('express');
const router = express.Router();
const passport = require('../config/passport-local-strategy');
const Student = require('../models/students');

router.get("/", passport.checkAuthentication, async function (req, res) {
    const students = await Student.find({});
    return res.render('home', { students });
});

router.use('/users', require('./users'));
router.use('/students', require('./student'));
router.use('/interview', require('./interview'));

module.exports = router;