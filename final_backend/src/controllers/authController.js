const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const db      = require('../config/database');
const { generateToken } = require('../utils/authUtils');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');
const { autoEnrollStudent } = require('../utils/enrollmentUtils');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Send OTP (Step 1 of registration) ────────────────────────────────────────
const sendOTP = async (req, res) => {
  try {
    const { name, email, password, role='student', department, branch, batch, enrollment_id, designation } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success:false, message:'Name, email and password are required' });

    const exists = await db.query('SELECT id FROM users WHERE email=$1',[email]);
    if (exists.rows.length)
      return res.status(400).json({ success:false, message:'This email is already registered' });

    if (role==='student' && enrollment_id) {
      const eid = await db.query('SELECT id FROM users WHERE enrollment_id=$1',[enrollment_id]);
      if (eid.rows.length)
        return res.status(400).json({ success:false, message:'Enrollment ID already exists' });
    }

    await db.query('DELETE FROM otp_verifications WHERE email=$1',[email]);
    const otp        = generateOTP();
    const expiresAt  = new Date(Date.now() + 10*60*1000);
    const password_hash = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO otp_verifications (email,otp,data,expires_at) VALUES ($1,$2,$3,$4)',
      [email, otp, JSON.stringify({ name,email,password_hash,role,department,branch,batch,enrollment_id,designation }), expiresAt]
    );

    await sendOTPEmail(email, otp, name);
    res.json({ success:true, message:`OTP sent to ${email}. Valid for 10 minutes.` });
  } catch(err) {
    console.error('sendOTP error:', err.message);
    res.status(500).json({ success:false, message:'Failed to send OTP. Please check your email configuration.', error:err.message });
  }
};

// ── Verify OTP + create user (Step 2) ────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success:false, message:'Email and OTP are required' });

    const record = await db.query(
      'SELECT * FROM otp_verifications WHERE email=$1 ORDER BY created_at DESC LIMIT 1', [email]
    );
    if (!record.rows.length)
      return res.status(400).json({ success:false, message:'No OTP found. Please request a new one.' });

    const r = record.rows[0];
    if (new Date() > new Date(r.expires_at))
      return res.status(400).json({ success:false, message:'OTP expired. Please request a new one.' });
    if (r.otp !== otp.toString())
      return res.status(400).json({ success:false, message:'Incorrect OTP. Please try again.' });

    const d = r.data;
    const result = await db.query(
      `INSERT INTO users (name,email,password_hash,role,department,branch,batch,enrollment_id,designation,email_verified,is_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,false)
       RETURNING id,name,email,role,department,branch,batch,enrollment_id,designation`,
      [d.name,d.email,d.password_hash,d.role,d.department,d.branch||null,d.batch||null,d.enrollment_id||null,d.designation||null]
    );

    const user = result.rows[0];
    await db.query('DELETE FROM otp_verifications WHERE email=$1',[email]);
    
    // Auto-enroll if student
    if (user.role === 'student' && user.enrollment_id) {
      await autoEnrollStudent(user.id, user.enrollment_id);
    }

    sendWelcomeEmail(user).catch(()=>{});

    const token = generateToken(user);
    res.status(201).json({ success:true, message:'Account created! Admin will assign your courses soon.', data:{ user, token } });
  } catch(err) {
    console.error('verifyOTP error:', err.message);
    res.status(500).json({ success:false, message:'Registration failed', error:err.message });
  }
};

// ── Resend OTP ────────────────────────────────────────────────────────────────
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const record = await db.query(
      'SELECT * FROM otp_verifications WHERE email=$1 ORDER BY created_at DESC LIMIT 1',[email]
    );
    if (!record.rows.length)
      return res.status(400).json({ success:false, message:'No pending registration found.' });

    await db.query('DELETE FROM otp_verifications WHERE email=$1',[email]);
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10*60*1000);
    await db.query(
      'INSERT INTO otp_verifications (email,otp,data,expires_at) VALUES ($1,$2,$3,$4)',
      [email, otp, record.rows[0].data, expiresAt]
    );
    await sendOTPEmail(email, otp, record.rows[0].data.name);
    res.json({ success:true, message:`New OTP sent to ${email}` });
  } catch(err) {
    res.status(500).json({ success:false, message:'Failed to resend OTP', error:err.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query(
      'SELECT id,name,email,password_hash,role,department,branch,batch,enrollment_id,designation,avatar_url,is_active FROM users WHERE email=$1',
      [email]
    );
    if (!result.rows.length)
      return res.status(401).json({ success:false, message:'Invalid email or password' });

    const user = result.rows[0];
    if (!user.is_active)
      return res.status(401).json({ success:false, message:'Account deactivated. Contact admin.' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ success:false, message:'Invalid email or password' });

    await db.query('UPDATE users SET last_login=NOW() WHERE id=$1',[user.id]);
    delete user.password_hash;
    const token = generateToken(user);
    res.json({ success:true, message:'Login successful', data:{ user, token } });
  } catch(err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success:false, message:'Login failed', error:err.message });
  }
};

const logout        = (req,res) => res.json({ success:true, message:'Logged out' });
const verifyToken   = (req,res) => res.json({ success:true, data:req.user });
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userResult = await db.query('SELECT name FROM users WHERE email=$1', [email]);
    if (!userResult.rows.length) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await db.query('DELETE FROM otp_verifications WHERE email=$1', [email]);
    await db.query(
      'INSERT INTO otp_verifications (email, otp, data, expires_at) VALUES ($1, $2, $3, $4)',
      [email, otp, JSON.stringify({ type: 'password_reset' }), expiresAt]
    );

    await sendOTPEmail(email, otp, userResult.rows[0].name);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = await db.query(
      'SELECT * FROM otp_verifications WHERE email=$1 ORDER BY created_at DESC LIMIT 1', [email]
    );

    if (!record.rows.length)
      return res.status(400).json({ success: false, message: 'OTP not found. Please request a new one.' });

    const r = record.rows[0];
    if (new Date() > new Date(r.expires_at))
      return res.status(400).json({ success: false, message: 'OTP expired' });
    if (r.otp !== otp.toString())
      return res.status(400).json({ success: false, message: 'Invalid OTP' });

    const hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash=$1, updated_at=NOW() WHERE email=$2', [hash, email]);
    await db.query('DELETE FROM otp_verifications WHERE email=$1', [email]);

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset password', error: err.message });
  }
};

const refreshToken = (req, res) => res.json({ success: true, message: 'Token refreshed' });
const verifyEmail = (req, res) => res.json({ success: true, message: 'Email verified' });

const changePassword = async (req,res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const r = await db.query('SELECT password_hash FROM users WHERE id=$1',[req.user.id]);
    const valid = await bcrypt.compare(currentPassword, r.rows[0].password_hash);
    if (!valid) return res.status(400).json({ success:false, message:'Current password incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2',[hash,req.user.id]);
    res.json({ success:true, message:'Password changed' });
  } catch(err) { res.status(500).json({ success:false, message:'Failed' }); }
};

// Admin direct user creation (no OTP needed)
const register = async (req,res) => {
  try {
    const { name,email,password,role='student',department,branch,batch,enrollment_id,designation } = req.body;
    const exists = await db.query('SELECT id FROM users WHERE email=$1',[email]);
    if (exists.rows.length)
      return res.status(400).json({ success:false, message:'Email already registered' });
    const password_hash = await bcrypt.hash(password,10);
    const result = await db.query(
      `INSERT INTO users (name,email,password_hash,role,department,branch,batch,enrollment_id,designation,email_verified,is_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,true)
       RETURNING id,name,email,role,department,enrollment_id,designation`,
      [name,email,password_hash,role,department,branch||null,batch||null,enrollment_id||null,designation||null]
    );
    const user = result.rows[0];

    // Auto-enroll if student
    if (user.role === 'student' && user.enrollment_id) {
      await autoEnrollStudent(user.id, user.enrollment_id);
    }

    const token = generateToken(user);
    res.status(201).json({ success:true, message:'User created', data:{ user, token } });
  } catch(err) {
    res.status(500).json({ success:false, message:'Failed', error:err.message });
  }
};

module.exports = { register, login, logout, verifyToken, changePassword, forgotPassword, resetPassword, refreshToken, verifyEmail, sendOTP, verifyOTP, resendOTP };
