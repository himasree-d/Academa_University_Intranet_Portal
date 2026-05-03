const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/courses/my-courses
router.get('/my-courses', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'faculty') {
      result = await db.query(
        `SELECT c.*, u.name as instructor_name,
                (SELECT COUNT(*) FROM enrollments WHERE course_id=c.id AND status='active') as student_count
         FROM courses c LEFT JOIN users u ON c.instructor_id=u.id
         WHERE c.instructor_id=$1 AND c.is_active=true ORDER BY c.code`,
        [req.user.id]
      );
    } else {
      result = await db.query(
        `SELECT c.*, u.name as instructor_name
         FROM courses c LEFT JOIN users u ON c.instructor_id=u.id
         JOIN enrollments e ON c.id=e.course_id
         WHERE e.student_id=$1 AND e.status='active' AND c.is_active=true ORDER BY c.code`,
        [req.user.id]
      );
    }
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET /api/courses
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, u.name as instructor_name,
              (SELECT COUNT(*) FROM enrollments WHERE course_id=c.id AND status='active') as student_count
       FROM courses c LEFT JOIN users u ON c.instructor_id=u.id
       WHERE c.is_active=true ORDER BY c.code`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET /api/courses/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, u.name as instructor_name FROM courses c
       LEFT JOIN users u ON c.instructor_id=u.id WHERE c.id=$1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// POST /api/courses
router.post('/', authenticate, authorize(['faculty','admin']), async (req, res) => {
  try {
    const { code, name, description, credits, department, semester, schedule, room } = req.body;
    const result = await db.query(
      `INSERT INTO courses (code,name,description,credits,department,instructor_id,semester,schedule,room)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [code, name, description, credits, department, req.user.id, semester, schedule, room]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// PUT /api/courses/:id
router.put('/:id', authenticate, authorize(['faculty','admin']), async (req, res) => {
  try {
    const { code, name, description, credits, schedule, room, is_active } = req.body;
    const result = await db.query(
      `UPDATE courses SET code=COALESCE($1,code), name=COALESCE($2,name),
       description=COALESCE($3,description), credits=COALESCE($4,credits),
       schedule=COALESCE($5,schedule), room=COALESCE($6,room),
       is_active=COALESCE($7,is_active), updated_at=NOW() WHERE id=$8 RETURNING *`,
      [code, name, description, credits, schedule, room, is_active, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// DELETE /api/courses/:id
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM courses WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET /api/courses/:id/students
router.get('/:id/students', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id,u.name,u.email,u.enrollment_id,e.enrolled_at FROM users u
       JOIN enrollments e ON u.id=e.student_id WHERE e.course_id=$1 AND e.status='active'`,
      [req.params.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// POST /api/courses/:id/enroll
router.post('/:id/enroll', authenticate, authorize(['faculty','admin']), async (req, res) => {
  try {
    const ex = await db.query('SELECT id FROM enrollments WHERE student_id=$1 AND course_id=$2',[req.body.student_id, req.params.id]);
    if (ex.rows.length) return res.status(400).json({ success: false, message: 'Already enrolled' });
    const r = await db.query('INSERT INTO enrollments (student_id,course_id) VALUES ($1,$2) RETURNING *',[req.body.student_id, req.params.id]);
    res.json({ success: true, data: r.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
