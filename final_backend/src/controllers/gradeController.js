const db = require('../config/database');

const getMyGrades = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT g.*, co.name as course_name, co.code, co.credits FROM grades g
       JOIN courses co ON g.course_id=co.id WHERE g.student_id=$1 ORDER BY g.created_at DESC`,
      [req.user.id]
    );
    const gpa = await db.query(
      `SELECT COALESCE(SUM(g.grade_point*co.credits)/NULLIF(SUM(co.credits),0),0) as gpa
       FROM grades g JOIN courses co ON g.course_id=co.id WHERE g.student_id=$1`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows, gpa: gpa.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const getCourseGrades = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id as student_id, u.name as student_name, u.enrollment_id,
              g.total_marks, g.grade, g.grade_point
       FROM users u JOIN enrollments e ON u.id=e.student_id AND e.course_id=$1
       LEFT JOIN grades g ON u.id=g.student_id AND g.course_id=$1
       WHERE u.role='student' AND e.status='active' ORDER BY u.name`,
      [req.params.courseId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const getTranscript = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT g.semester, co.code, co.name as course_name, co.credits, g.total_marks, g.grade, g.grade_point
       FROM grades g JOIN courses co ON g.course_id=co.id WHERE g.student_id=$1 ORDER BY g.semester DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

module.exports = { getMyGrades, getCourseGrades, getTranscript };
