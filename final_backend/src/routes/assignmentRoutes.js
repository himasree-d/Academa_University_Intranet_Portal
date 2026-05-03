const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/assignments/my-assignments
router.get('/my-assignments', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'student') {
      result = await db.query(
        `SELECT a.*, co.name as course_name, co.code as course_code, u.name as instructor_name,
                s.status as submission_status, s.grade, s.submitted_at
         FROM assignments a
         JOIN courses co ON a.course_id=co.id
         JOIN users u ON a.created_by=u.id
         JOIN enrollments e ON co.id=e.course_id AND e.student_id=$1
         LEFT JOIN submissions s ON a.id=s.assignment_id AND s.student_id=$1
         WHERE e.status='active' AND a.is_active=true ORDER BY a.due_date`,
        [req.user.id]
      );
    } else {
      result = await db.query(
        `SELECT a.*, co.name as course_name, co.code as course_code,
                (SELECT COUNT(*) FROM submissions WHERE assignment_id=a.id) as submission_count
         FROM assignments a JOIN courses co ON a.course_id=co.id
         WHERE a.created_by=$1 AND a.is_active=true ORDER BY a.due_date`,
        [req.user.id]
      );
    }
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET /api/assignments
router.get('/', authenticate, async (req, res) => {
  try {
    const { course_id } = req.query;
    let query = `SELECT a.*, co.name as course_name, co.code as course_code, u.name as instructor_name
                 FROM assignments a JOIN courses co ON a.course_id=co.id JOIN users u ON a.created_by=u.id WHERE a.is_active=true`;
    const params = [];
    if (course_id) { params.push(course_id); query += ` AND a.course_id=$${params.length}`; }
    query += ' ORDER BY a.due_date';
    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET /api/assignments/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, co.name as course_name, co.code, u.name as instructor_name
       FROM assignments a JOIN courses co ON a.course_id=co.id JOIN users u ON a.created_by=u.id WHERE a.id=$1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// POST /api/assignments
router.post('/', authenticate, authorize(['faculty','admin']), async (req, res) => {
  try {
    const { course_id, title, description, instructions, due_date, due_time, total_marks } = req.body;
    const result = await db.query(
      `INSERT INTO assignments (course_id,title,description,instructions,due_date,due_time,total_marks,created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [course_id, title, description, instructions, due_date, due_time||'23:59', total_marks, req.user.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// PUT /api/assignments/:id
router.put('/:id', authenticate, authorize(['faculty','admin']), async (req, res) => {
  try {
    const { title, description, instructions, due_date, due_time, total_marks, is_active } = req.body;
    const result = await db.query(
      `UPDATE assignments SET title=COALESCE($1,title), description=COALESCE($2,description),
       instructions=COALESCE($3,instructions), due_date=COALESCE($4,due_date),
       due_time=COALESCE($5,due_time), total_marks=COALESCE($6,total_marks),
       is_active=COALESCE($7,is_active), updated_at=NOW() WHERE id=$8 RETURNING *`,
      [title, description, instructions, due_date, due_time, total_marks, is_active, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// DELETE /api/assignments/:id
router.delete('/:id', authenticate, authorize(['faculty','admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM assignments WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET /api/assignments/:id/submissions
router.get('/:id/submissions', authenticate, authorize(['faculty','admin']), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.name as student_name, u.email, u.enrollment_id
       FROM submissions s JOIN users u ON s.student_id=u.id WHERE s.assignment_id=$1 ORDER BY s.submitted_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
