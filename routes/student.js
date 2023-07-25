const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');

// adding student
router.get("/addPage", studentController.addStudentPage);

// POST request
router.post("/add", studentController.addStudent);
router.post("/delete/:id", studentController.deleteStudent);

module.exports = router;