const express = require('express');
const studentController = require('../controllers/student.js');
const { authStudent } = require('../middlewares/auth.js');

const router = express.Router();

router.get('/student-stat/:reg_no/:block_no', authStudent, studentController.studentStatistics)

router.get('/display-notices', authStudent, studentController.displayNotice)

router.get('/display-menu', authStudent, studentController.displayMenu)

router.post('/feedback-form', authStudent, studentController.feedbackForm)

router.get('/profile', authStudent, studentController.getStudentProfile)

router.post('/login', studentController.studentLogin)


module.exports = router;

