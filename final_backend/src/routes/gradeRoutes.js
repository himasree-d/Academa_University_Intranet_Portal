const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getMyGrades, getCourseGrades, getTranscript } = require('../controllers/gradeController');

router.get('/my-grades', authenticate, authorize(['student']), getMyGrades);
router.get('/transcript', authenticate, authorize(['student']), getTranscript);
router.get('/course/:courseId', authenticate, authorize(['faculty','admin']), getCourseGrades);

module.exports = router;
