const express = require('express');
const router = express.Router();
const passport = require('passport');
const interviewController = require('../controller/interviewController');

// -------- Get requests ----------

// interview home page i.e. listing all interviews
router.get("/home", interviewController.home);

// rendering allocate interview page
router.get('/allocate', passport.checkAuthentication, interviewController.allocateInterview);

// -------- Post Requests ---------

// allocating the intervirew
router.post('/schedule-interview', passport.checkAuthentication, interviewController.scheduleInterview);

// update status of students
router.post('/update-status/:id', passport.checkAuthentication, interviewController.updateStatus);

module.exports = router;

module.exports = router;