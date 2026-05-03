const db = require('../config/database');

// Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const { course_id, status } = req.query;
    let query = `
      SELECT a.*, c.name as course_name, c.code as course_code,
             u.name as instructor_name
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      JOIN users u ON a.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (course_id) {
      params.push(course_id);
      query += ` AND a.course_id = $${params.length}`;
    }

    if (status === 'active') {
      query += ` AND a.due_date >= CURRENT_DATE`;
    } else if (status === 'past') {
      query += ` AND a.due_date < CURRENT_DATE`;
    }

    query += ` ORDER BY a.due_date`;

    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT a.*, c.name as course_name, c.code as course_code,
              u.name as instructor_name
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
       JOIN users u ON a.created_by = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create assignment
const createAssignment = async (req, res) => {
  try {
    const { course_id, title, description, instructions, due_date, due_time, total_marks } = req.body;

    // Verify course exists and user teaches it
    const courseCheck = await db.query(
      'SELECT id FROM courses WHERE id = $1 AND instructor_id = $2',
      [course_id, req.user.id]
    );

    if (courseCheck.rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to create assignments for this course' 
      });
    }

    const result = await db.query(
      `INSERT INTO assignments 
       (course_id, title, description, instructions, due_date, due_time, total_marks, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [course_id, title, description, instructions, due_date, due_time, total_marks, req.user.id]
    );

    // Create notifications for enrolled students
    const students = await db.query(
      'SELECT student_id FROM enrollments WHERE course_id = $1 AND status = $2',
      [course_id, 'active']
    );

    for (const student of students.rows) {
      await db.query(
        `INSERT INTO notifications (user_id, type, title, content, related_entity_type, related_entity_id) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [student.student_id, 'assignment', `New Assignment: ${title}`, 
         `New assignment posted in your course`, 'assignment', result.rows[0].id]
      );
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, instructions, due_date, due_time, total_marks, is_active } = req.body;

    // Verify ownership
    const assignment = await db.query(
      'SELECT created_by FROM assignments WHERE id = $1',
      [id]
    );

    if (assignment.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    if (assignment.rows[0].created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    const result = await db.query(
      `UPDATE assignments 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           instructions = COALESCE($3, instructions),
           due_date = COALESCE($4, due_date),
           due_time = COALESCE($5, due_time),
           total_marks = COALESCE($6, total_marks),
           is_active = COALESCE($7, is_active),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [title, description, instructions, due_date, due_time, total_marks, is_active, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const assignment = await db.query(
      'SELECT created_by FROM assignments WHERE id = $1',
      [id]
    );

    if (assignment.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    if (assignment.rows[0].created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    await db.query('DELETE FROM assignments WHERE id = $1', [id]);
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get submissions for assignment
const getAssignmentSubmissions = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const assignment = await db.query(
      'SELECT course_id FROM assignments WHERE id = $1',
      [id]
    );

    if (assignment.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const result = await db.query(
      `SELECT s.*, u.name as student_name, u.email, u.enrollment_id
       FROM submissions s
       JOIN users u ON s.student_id = u.id
       WHERE s.assignment_id = $1
       ORDER BY s.submitted_at DESC`,
      [id]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions
};