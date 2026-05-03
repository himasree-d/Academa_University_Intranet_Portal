const express = require('express');
const router  = express.Router();

const authRoutes         = require('./authRoutes');
const userRoutes         = require('./userRoutes');
const courseRoutes       = require('./courseRoutes');
const assignmentRoutes   = require('./assignmentRoutes');
const submissionRoutes   = require('./submissionRoutes');
const gradeRoutes        = require('./gradeRoutes');
const announcementRoutes = require('./announcementRoutes');
const materialRoutes     = require('./materialRoutes');
const chatRoutes         = require('./chatRoutes');
const dashboardRoutes    = require('./dashboardRoutes');
const importRoutes       = require('./importRoutes');
const timetableRoutes    = require('./timetableRoutes');

const API = '/api';

router.use(`${API}/auth`,          authRoutes);
router.use(`${API}/users`,         userRoutes);
router.use(`${API}/courses`,       courseRoutes);
router.use(`${API}/assignments`,   assignmentRoutes);
router.use(`${API}/submissions`,   submissionRoutes);
router.use(`${API}/grades`,        gradeRoutes);
router.use(`${API}/announcements`, announcementRoutes);
router.use(`${API}/materials`,     materialRoutes);
router.use(`${API}/chat`,          chatRoutes);
router.use(`${API}/dashboard`,     dashboardRoutes);
router.use(`${API}/import`,        importRoutes);
router.use(`${API}/timetable`,     timetableRoutes);

module.exports = router;
