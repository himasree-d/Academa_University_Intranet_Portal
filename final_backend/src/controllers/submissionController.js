const db = require('../config/database');

const submitAssignment = async (req, res) => {
  try {
    const { assignment_id } = req.body;
    const student_id = req.user.id;

    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const existing = await db.query('SELECT id FROM submissions WHERE assignment_id=$1 AND student_id=$2',[assignment_id,student_id]);
    if (existing.rows.length) return res.status(400).json({ success: false, message: 'Already submitted' });

    const assignment = await db.query('SELECT due_date, course_id FROM assignments WHERE id=$1 AND is_active=true',[assignment_id]);
    if (!assignment.rows.length) return res.status(404).json({ success: false, message: 'Assignment not found' });

    const enrolled = await db.query("SELECT id FROM enrollments WHERE student_id=$1 AND course_id=$2 AND status='active'",[student_id, assignment.rows[0].course_id]);
    if (!enrolled.rows.length) return res.status(403).json({ success: false, message: 'Not enrolled in this course' });

    const isLate = new Date() > new Date(assignment.rows[0].due_date);
    const file_url = `/uploads/${req.file.filename}`;

    const result = await db.query(
      `INSERT INTO submissions (assignment_id,student_id,file_name,file_url,status)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [assignment_id, student_id, req.file.originalname, file_url, isLate ? 'late' : 'submitted']
    );
    res.json({ success: true, message: isLate ? 'Submitted (late)' : 'Submitted successfully', data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const getSubmissionById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.name as student_name, u.enrollment_id, a.title as assignment_title, a.total_marks
       FROM submissions s JOIN users u ON s.student_id=u.id JOIN assignments a ON s.assignment_id=a.id WHERE s.id=$1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const sub = await db.query(
      `SELECT s.*, a.course_id, a.total_marks FROM submissions s JOIN assignments a ON s.assignment_id=a.id WHERE s.id=$1`,
      [id]
    );
    if (!sub.rows.length) return res.status(404).json({ success: false, message: 'Submission not found' });

    if (req.user.role !== 'admin') {
      const check = await db.query('SELECT id FROM courses WHERE id=$1 AND instructor_id=$2',[sub.rows[0].course_id, req.user.id]);
      if (!check.rows.length) return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    const result = await db.query(
      `UPDATE submissions SET grade=$1,feedback=$2,status='graded',graded_by=$3,graded_at=NOW() WHERE id=$4 RETURNING *`,
      [grade, feedback, req.user.id, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const getMySubmissions = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, a.title as assignment_title, a.total_marks, co.name as course_name
       FROM submissions s JOIN assignments a ON s.assignment_id=a.id JOIN courses co ON a.course_id=co.id
       WHERE s.student_id=$1 ORDER BY s.submitted_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const getCourseSubmissions = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.name as student_name, u.enrollment_id, a.title as assignment_title, a.total_marks
       FROM submissions s JOIN users u ON s.student_id=u.id JOIN assignments a ON s.assignment_id=a.id
       JOIN courses co ON a.course_id=co.id WHERE co.id=$1 ORDER BY s.submitted_at DESC`,
      [req.params.courseId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const getFacultyPendingSubmissions = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.name as student_name, u.enrollment_id, a.title as assignment_title, a.total_marks, co.name as course_name
       FROM submissions s 
       JOIN users u ON s.student_id=u.id 
       JOIN assignments a ON s.assignment_id=a.id
       JOIN courses co ON a.course_id=co.id 
       WHERE co.instructor_id=$1 AND s.status != 'graded'
       ORDER BY s.submitted_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const getMySubmissionForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const result = await db.query(
      `SELECT s.*, u.name as graded_by_name
       FROM submissions s
       LEFT JOIN users u ON s.graded_by=u.id
       WHERE s.assignment_id=$1 AND s.student_id=$2`,
      [assignmentId, req.user.id]
    );
    
    if (!result.rows.length) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

module.exports = { submitAssignment, getSubmissionById, gradeSubmission, getMySubmissions, getCourseSubmissions, getFacultyPendingSubmissions, getMySubmissionForAssignment };
