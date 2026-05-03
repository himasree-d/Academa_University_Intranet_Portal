const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getAllAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement, getCourseAnnouncements } = require('../controllers/announcementController');

router.get('/', authenticate, getAllAnnouncements);
router.get('/course/:courseId', authenticate, getCourseAnnouncements);
router.get('/:id', authenticate, getAnnouncementById);
router.post('/', authenticate, authorize(['faculty','admin']), createAnnouncement);
router.put('/:id', authenticate, authorize(['faculty','admin']), updateAnnouncement);
router.delete('/:id', authenticate, authorize(['faculty','admin']), deleteAnnouncement);

module.exports = router;
