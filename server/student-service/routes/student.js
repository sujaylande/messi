const express = require('express');
const studentController = require('../controllers/student.js');

const router = express.Router();

router.get('/student-stat/:reg_no', studentController.studentStatistics)

router.get('/display-notices', studentController.displayNotice)

router.get('/display-menu', studentController.displayMenu)

router.post('/feedback-form', studentController.feedbackForm)


module.exports = router;

