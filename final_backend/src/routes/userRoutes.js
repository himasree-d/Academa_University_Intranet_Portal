const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getAllUsers, getUserById, updateUser, deleteUser, createUser, getStudents, getFaculty } = require('../controllers/userController');

router.get('/students', authenticate, getStudents);
router.get('/faculty', authenticate, getFaculty);
router.get('/', authenticate, authorize(['admin']), getAllUsers);
router.post('/', authenticate, authorize(['admin']), createUser);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router;
