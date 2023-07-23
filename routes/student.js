const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');

router.get("/addPage", studentController.addStudentPage);
router.post("/add", studentController.addStudent);
router.post("/delete/:id", studentController.deleteStudent);

module.exports = router;