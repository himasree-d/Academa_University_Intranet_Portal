const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const {
  register, login, logout, verifyToken, changePassword,
  forgotPassword, resetPassword, refreshToken, verifyEmail,
  sendOTP, verifyOTP, resendOTP
} = require('../controllers/authController');

// OTP Registration
router.post('/send-otp',   [body('email').isEmail().normalizeEmail(), body('name').notEmpty(), body('password').isLength({min:6})], handleValidation, sendOTP);
router.post('/verify-otp', [body('email').isEmail().normalizeEmail(), body('otp').isLength({min:6,max:6})], handleValidation, verifyOTP);
router.post('/resend-otp', [body('email').isEmail().normalizeEmail()], handleValidation, resendOTP);

// Auth
router.post('/login',           [body('email').isEmail().normalizeEmail(), body('password').notEmpty()], handleValidation, login);
router.post('/register',        register);
router.post('/logout',          authenticate, logout);
router.get('/verify',           authenticate, verifyToken);
router.post('/change-password', authenticate, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);
router.post('/refresh-token',   refreshToken);
router.get('/verify-email/:token', verifyEmail);

router.get('/me', authenticate, async (req, res) => {
  try {
    const db = require('../config/database');
    const r  = await db.query(
      'SELECT id,name,email,role,department,branch,batch,enrollment_id,designation,avatar_url,is_verified,created_at FROM users WHERE id=$1',
      [req.user.id]
    );
    res.json({ success:true, data:r.rows[0] });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
