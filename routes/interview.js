const express = require('express');
const router = express.Router();
const passport = require('passport');
const interviewController = require('../controller/interviewController');

// -------- Get requests ----------
router.get("/home", interviewController.home);
router.get('/allocate', passport.checkAuthentication, interviewController.allocateInterview);

// -------- Post Requests ---------

router.post('/schedule-interview', passport.checkAuthentication, interviewController.scheduleInterview);
router.post('/update-status/:id', passport.checkAuthentication, interviewController.updateStatus);

module.exports = router;

module.exports = router;