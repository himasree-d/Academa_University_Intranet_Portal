const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getStudentDashboard, getFacultyDashboard, getAdminDashboard, getPlatformStats } = require('../controllers/dashboardController');

router.get('/student', authenticate, authorize(['student']), getStudentDashboard);
router.get('/faculty', authenticate, authorize(['faculty']), getFacultyDashboard);
router.get('/admin',   authenticate, authorize(['admin']),   getAdminDashboard);
router.get('/stats',   authenticate, authorize(['admin']),   getPlatformStats);
router.get('/', authenticate, (req, res, next) => {
  if (req.user.role === 'student') return getStudentDashboard(req, res, next);
  if (req.user.role === 'faculty') return getFacultyDashboard(req, res, next);
  return getAdminDashboard(req, res, next);
});

module.exports = router;
