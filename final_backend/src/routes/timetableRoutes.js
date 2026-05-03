const express = require('express');
const router  = express.Router();
const db      = require('../config/database');
const { authenticate } = require('../middleware/auth');

// GET /api/timetable - returns timetable for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'student') {
      // Get student's branch and batch from DB
      const student = await db.query(
        'SELECT branch, batch FROM users WHERE id=$1', [req.user.id]
      );
      const { branch, batch } = student.rows[0] || {};

      if (!branch) {
        return res.json({ success:true, data:[], message:'No branch assigned yet. Contact admin.' });
      }

      result = await db.query(
        `SELECT te.*, c.name as course_name, c.code as course_code,
                u.name as instructor_name
         FROM timetable_entries te
         JOIN courses c ON te.course_id=c.id
         LEFT JOIN users u ON c.instructor_id=u.id
         WHERE te.branch=$1 AND te.is_active=true
         ORDER BY CASE te.day_of_week
           WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3
           WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6
         END, te.start_time`,
        [branch]
      );
    } else if (req.user.role === 'faculty') {
      // Faculty sees timetable of courses they teach
      result = await db.query(
        `SELECT te.*, c.name as course_name, c.code as course_code, c.branch
         FROM timetable_entries te
         JOIN courses c ON te.course_id=c.id
         WHERE c.instructor_id=$1 AND te.is_active=true
         ORDER BY CASE te.day_of_week
           WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3
           WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6
         END, te.start_time`,
        [req.user.id]
      );
    } else {
      // Admin sees all
      result = await db.query(
        `SELECT te.*, c.name as course_name, c.code as course_code, c.branch,
                u.name as instructor_name
         FROM timetable_entries te
         JOIN courses c ON te.course_id=c.id
         LEFT JOIN users u ON c.instructor_id=u.id
         WHERE te.is_active=true
         ORDER BY te.branch, CASE te.day_of_week
           WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3
           WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6
         END, te.start_time`
      );
    }
    res.json({ success:true, data:result.rows });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// POST /api/timetable - admin adds timetable entry
router.post('/', authenticate, async (req, res) => {
  try {
    const { course_id, day_of_week, start_time, end_time, room, entry_type, branch, batch, semester_number } = req.body;
    const result = await db.query(
      `INSERT INTO timetable_entries (course_id,day_of_week,start_time,end_time,room,entry_type,branch,batch,semester_number)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [course_id, day_of_week, start_time, end_time, room, entry_type||'lecture', branch, batch, semester_number]
    );
    res.json({ success:true, data:result.rows[0] });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// DELETE /api/timetable/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.query('UPDATE timetable_entries SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ success:true, message:'Entry removed' });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
