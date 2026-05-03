const db = require('../config/database');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.is_active = true
      ORDER BY c.code
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT c.*, u.name as instructor_name 
       FROM courses c 
       LEFT JOIN users u ON c.instructor_id = u.id 
       WHERE c.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create course
const createCourse = async (req, res) => {
  try {
    const { code, name, description, credits, department, semester, schedule, room } = req.body;
    const instructor_id = req.user.id;

    const result = await db.query(
      `INSERT INTO courses (code, name, description, credits, department, semester, schedule, room, instructor_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [code, name, description, credits, department, semester, schedule, room, instructor_id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, credits, schedule, room, is_active } = req.body;

    const result = await db.query(
      `UPDATE courses 
       SET code = COALESCE($1, code),
           name = COALESCE($2, name),
           description = COALESCE($3, description),
           credits = COALESCE($4, credits),
           schedule = COALESCE($5, schedule),
           room = COALESCE($6, room),
           is_active = COALESCE($7, is_active),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [code, name, description, credits, schedule, room, is_active, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM courses WHERE id = $1', [id]);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get enrolled students
const getEnrolledStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.enrollment_id, e.enrollment_date
       FROM users u 
       JOIN enrollments e ON u.id = e.student_id 
       WHERE e.course_id = $1 AND e.status = 'active'`,
      [id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Enroll student
const enrollStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id } = req.body;

    // Check if already enrolled
    const existing = await db.query(
      'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [student_id, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Student already enrolled' });
    }

    const result = await db.query(
      `INSERT INTO enrollments (student_id, course_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [student_id, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Remove student
const removeStudent = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    await db.query(
      'DELETE FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [studentId, id]
    );
    res.json({ success: true, message: 'Student removed from course' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get course assignments
const getCourseAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT * FROM assignments 
       WHERE course_id = $1 AND is_active = true 
       ORDER BY due_date`,
      [id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get course materials
const getCourseMaterials = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT m.*, u.name as uploaded_by_name 
       FROM materials m
       JOIN users u ON m.uploaded_by = u.id
       WHERE m.course_id = $1 AND m.is_active = true 
       ORDER BY m.uploaded_at DESC`,
      [id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getEnrolledStudents,
  enrollStudent,
  removeStudent,
  getCourseAssignments,
  getCourseMaterials
};