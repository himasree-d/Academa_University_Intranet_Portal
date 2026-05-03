const bcrypt = require('bcrypt');
const { parse } = require('csv-parse/sync');
const db = require('../config/database');
const { autoEnrollStudent } = require('../utils/enrollmentUtils');

// ── helpers ──────────────────────────────────────────────────────────────────
const parseCSV = (buffer) => parse(buffer, { columns: true, skip_empty_lines: true, trim: true });

const defaultPassword = async (fallback) => bcrypt.hash(fallback || 'Password@123', 10);

// ── Import Students ───────────────────────────────────────────────────────────
const importStudents = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
  try {
    const rows = parseCSV(req.file.buffer);
    const results = { created: 0, skipped: 0, errors: [] };

    for (const row of rows) {
      try {
        const { name, email, enrollment_id, department, batch } = row;
        if (!name || !email || !enrollment_id) {
          results.errors.push(`Row skipped — missing name/email/enrollment_id: ${JSON.stringify(row)}`);
          results.skipped++;
          continue;
        }
        // Check duplicate
        const exists = await db.query('SELECT id FROM users WHERE email=$1 OR enrollment_id=$2', [email, enrollment_id]);
        if (exists.rows.length) { results.skipped++; continue; }

        // Password = enrollment_id by default (student changes on first login)
        const password_hash = await bcrypt.hash(row.password || enrollment_id, 10);
        const insertRes = await db.query(
          `INSERT INTO users (name,email,password_hash,role,department,enrollment_id,batch)
           VALUES ($1,$2,$3,'student',$4,$5,$6)
           RETURNING id`,
          [name, email, password_hash, department || '', enrollment_id, batch || '']
        );
        const studentId = insertRes.rows[0].id;
        
        // Auto-enroll
        await autoEnrollStudent(studentId, enrollment_id);

        results.created++;
      } catch (e) {
        results.errors.push(`${row.email}: ${e.message}`);
      }
    }
    res.json({ success: true, message: `Import complete`, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to parse CSV', error: err.message });
  }
};

// ── Import Faculty ────────────────────────────────────────────────────────────
const importFaculty = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
  try {
    const rows = parseCSV(req.file.buffer);
    const results = { created: 0, skipped: 0, errors: [] };

    for (const row of rows) {
      try {
        const { name, email, department, designation } = row;
        if (!name || !email) {
          results.errors.push(`Row skipped — missing name/email`);
          results.skipped++;
          continue;
        }
        const exists = await db.query('SELECT id FROM users WHERE email=$1', [email]);
        if (exists.rows.length) { results.skipped++; continue; }

        const password_hash = await bcrypt.hash(row.password || 'Faculty@123', 10);
        await db.query(
          `INSERT INTO users (name,email,password_hash,role,department,designation)
           VALUES ($1,$2,$3,'faculty',$4,$5)`,
          [name, email, password_hash, department || '', designation || '']
        );
        results.created++;
      } catch (e) {
        results.errors.push(`${row.email}: ${e.message}`);
      }
    }
    res.json({ success: true, message: 'Import complete', data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to parse CSV', error: err.message });
  }
};

// ── Import Courses ────────────────────────────────────────────────────────────
const importCourses = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
  try {
    const rows = parseCSV(req.file.buffer);
    const results = { created: 0, skipped: 0, errors: [] };

    for (const row of rows) {
      try {
        const { code, name, description, credits, department, semester, schedule, room, faculty_email } = row;
        if (!code || !name) {
          results.errors.push(`Row skipped — missing code/name`);
          results.skipped++;
          continue;
        }
        const exists = await db.query('SELECT id FROM courses WHERE code=$1', [code]);
        if (exists.rows.length) { results.skipped++; continue; }

        // Find faculty by email
        let instructor_id = null;
        if (faculty_email) {
          const fac = await db.query("SELECT id FROM users WHERE email=$1 AND role='faculty'", [faculty_email]);
          if (fac.rows.length) instructor_id = fac.rows[0].id;
        }

        await db.query(
          `INSERT INTO courses (code,name,description,credits,department,instructor_id,semester,schedule,room)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [code, name, description || '', parseInt(credits) || 3, department || '', instructor_id, semester || '', schedule || '', room || '']
        );
        results.created++;
      } catch (e) {
        results.errors.push(`${row.code}: ${e.message}`);
      }
    }
    res.json({ success: true, message: 'Import complete', data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to parse CSV', error: err.message });
  }
};

// ── Import Enrollments ────────────────────────────────────────────────────────
const importEnrollments = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
  try {
    const rows = parseCSV(req.file.buffer);
    const results = { created: 0, skipped: 0, errors: [] };

    for (const row of rows) {
      try {
        const { enrollment_id, course_code } = row;
        if (!enrollment_id || !course_code) {
          results.errors.push(`Row skipped — missing enrollment_id/course_code`);
          results.skipped++;
          continue;
        }
        const student = await db.query("SELECT id FROM users WHERE enrollment_id=$1 AND role='student'", [enrollment_id]);
        if (!student.rows.length) {
          results.errors.push(`Student not found: ${enrollment_id}`);
          results.skipped++;
          continue;
        }
        const course = await db.query('SELECT id FROM courses WHERE code=$1', [course_code]);
        if (!course.rows.length) {
          results.errors.push(`Course not found: ${course_code}`);
          results.skipped++;
          continue;
        }
        const exists = await db.query('SELECT id FROM enrollments WHERE student_id=$1 AND course_id=$2', [student.rows[0].id, course.rows[0].id]);
        if (exists.rows.length) { results.skipped++; continue; }

        await db.query('INSERT INTO enrollments (student_id,course_id) VALUES ($1,$2)', [student.rows[0].id, course.rows[0].id]);
        results.created++;
      } catch (e) {
        results.errors.push(`${row.enrollment_id}: ${e.message}`);
      }
    }
    res.json({ success: true, message: 'Import complete', data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to parse CSV', error: err.message });
  }
};

// ── Bulk Enroll by Batch + Branch ─────────────────────────────────────────────
const bulkEnroll = async (req, res) => {
  try {
    const { batch, department, course_ids } = req.body;
    if (!batch || !department || !course_ids?.length)
      return res.status(400).json({ success: false, message: 'batch, department and course_ids required' });

    const students = await db.query(
      "SELECT id FROM users WHERE role='student' AND batch=$1 AND department=$2 AND is_active=true",
      [batch, department]
    );

    if (!students.rows.length)
      return res.status(404).json({ success: false, message: `No students found for batch ${batch}, ${department}` });

    let enrolled = 0, skipped = 0;
    for (const student of students.rows) {
      for (const course_id of course_ids) {
        const exists = await db.query('SELECT id FROM enrollments WHERE student_id=$1 AND course_id=$2', [student.id, course_id]);
        if (exists.rows.length) { skipped++; continue; }
        await db.query('INSERT INTO enrollments (student_id,course_id) VALUES ($1,$2)', [student.id, course_id]);
        enrolled++;
      }
    }
    res.json({ success: true, message: 'Bulk enrollment complete', data: { enrolled, skipped, students: students.rows.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Bulk enrollment failed', error: err.message });
  }
};

// ── Get import stats ──────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const users    = await db.query("SELECT role, COUNT(*) as count FROM users GROUP BY role");
    const courses  = await db.query("SELECT COUNT(*) as count FROM courses WHERE is_active=true");
    const enrolled = await db.query("SELECT COUNT(*) as count FROM enrollments WHERE status='active'");
    const batches  = await db.query("SELECT DISTINCT batch, department FROM users WHERE role='student' AND batch IS NOT NULL ORDER BY batch DESC");

    res.json({
      success: true,
      data: {
        users: users.rows,
        totalCourses: parseInt(courses.rows[0].count),
        totalEnrollments: parseInt(enrolled.rows[0].count),
        batches: batches.rows
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { importStudents, importFaculty, importCourses, importEnrollments, bulkEnroll, getStats };
