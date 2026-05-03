const express = require('express');
const router  = express.Router();
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getPeople, getConversations, getMessages, sendMessage, getUnreadCount, createGroup, deleteMessage } = require('../controllers/chatController');

router.get('/people',           authenticate, getPeople);
router.get('/conversations',    authenticate, getConversations);
router.get('/unread',           authenticate, getUnreadCount);
router.get('/messages/:id',     authenticate, getMessages);
router.post('/send',            authenticate, upload.single('file'), sendMessage);
router.post('/groups',          authenticate, createGroup);
router.delete('/messages/:id',  authenticate, deleteMessage);

module.exports = router;
