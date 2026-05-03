const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate, authorize } = require('../middleware/auth');
const { importStudents, importFaculty, importCourses, importEnrollments, bulkEnroll, getStats } = require('../controllers/importController');

// Use memory storage for CSV files (no need to save to disk)
const csvUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// All import routes are admin only
router.get('/stats', authenticate, authorize(['admin']), getStats);
router.post('/students', authenticate, authorize(['admin']), csvUpload.single('file'), importStudents);
router.post('/faculty', authenticate, authorize(['admin']), csvUpload.single('file'), importFaculty);
router.post('/courses', authenticate, authorize(['admin']), csvUpload.single('file'), importCourses);
router.post('/enrollments', authenticate, authorize(['admin']), csvUpload.single('file'), importEnrollments);
router.post('/bulk-enroll', authenticate, authorize(['admin']), bulkEnroll);

module.exports = router;
