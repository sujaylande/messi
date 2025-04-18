const express = require('express');
const upload = require("../utils/multer.js");
const managerController = require('../controllers/manager.js');
const { authManager } = require("../middlewares/auth.js");

const router = express.Router();


router.post('/login', managerController.managerLogin);

router.get('/logout', managerController.managerLogout)

router.post('/register',authManager, managerController.register)

router.get('/scan', authManager, managerController.scan)

router.post('/scan-manually', authManager, managerController.scanManually)

router.get('/mess-stat', authManager, managerController.messStatistics)

router.get('/student-stat/:reg_no', authManager, managerController.studentStatistics)

router.get('/active-student', authManager, managerController.activeStudents)

router.get('/todays-attendance', authManager, managerController.todaysAttendance)

router.get('/attendance-probability', authManager, managerController.attendanceProbability)

router.post('/student-status', authManager, managerController.updateStudentStatus)

router.get('/students-status-list', authManager, managerController.studentStatusList)

router.delete('/remove-student/:reg_no', authManager, managerController.removeStudent)

router.post('/add-notice', authManager, managerController.addNotice)

router.get('/display-notices', authManager, managerController.displayNotice)

router.delete('/remove-notice/:id', authManager, managerController.removeNotice)

router.post('/add-menu', authManager, upload.single('image'), managerController.addMenu)

router.get('/display-menu', authManager, managerController.displayMenu)

// router.post('/feedback-form', authManager, managerController.feedbackForm)

router.get('/negative-feedback', authManager, managerController.displayNegativeFeedbacks)

router.get('/feedback-stats', authManager, managerController.feedbackStatistics)

router.get('/profile', authManager, managerController.getManagerProfile)




module.exports = router;

