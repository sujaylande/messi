const express = require('express');
const upload = require("../utils/multer.js");
const managerController = require('../controllers/manager.js');

const router = express.Router();


router.post('/register', managerController.register)

router.get('/scan', managerController.scan)

router.get('/mess-stat', managerController.messStatistics)

router.get('/student-stat/:reg_no', managerController.studentStatistics)

router.get('/active-student', managerController.activeStudents)

router.get('/todays-attendance', managerController.todaysAttendance)

router.get('/attendance-probability', managerController.attendanceProbability)

router.post('/student-status', managerController.updateStudentStatus)

router.get('/students-status-list', managerController.studentStatusList)

router.delete('/remove-student/:reg_no', managerController.removeStudent)

router.post('/add-notice', managerController.addNotice)

router.get('/display-notices', managerController.displayNotice)

router.delete('/remove-notice/:id', managerController.removeNotice)

router.post('/add-menu', upload.single('image'), managerController.addMenu)

router.get('/display-menu', managerController.displayMenu)

router.post('/feedback-form', managerController.feedbackForm)

router.get('/negative-feedback', managerController.displayNegativeFeedbacks)

router.get('/feedback-stats', managerController.feedbackStatistics)



module.exports = router;

