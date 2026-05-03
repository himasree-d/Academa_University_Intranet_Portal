const db = require('../config/database');

const getAllAnnouncements = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, u.name as author_name, u.designation, co.name as course_name, co.code as course_code
       FROM announcements a LEFT JOIN users u ON a.author_id=u.id LEFT JOIN courses co ON a.course_id=co.id
       ORDER BY a.is_pinned DESC, a.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const getAnnouncementById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, u.name as author_name, co.name as course_name
       FROM announcements a LEFT JOIN users u ON a.author_id=u.id LEFT JOIN courses co ON a.course_id=co.id WHERE a.id=$1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, description, course_id, is_pinned, is_important, is_global } = req.body;
    const result = await db.query(
      `INSERT INTO announcements (title,description,author_id,course_id,is_pinned,is_important,is_global)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, description, req.user.id, course_id||null, is_pinned||false, is_important||false, is_global||false]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { title, description, is_pinned, is_important } = req.body;
    const result = await db.query(
      `UPDATE announcements SET title=COALESCE($1,title), description=COALESCE($2,description),
       is_pinned=COALESCE($3,is_pinned), is_important=COALESCE($4,is_important), updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [title, description, is_pinned, is_important, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const deleteAnnouncement = async (req, res) => {
  try {
    await db.query('DELETE FROM announcements WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const getCourseAnnouncements = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, u.name as author_name FROM announcements a LEFT JOIN users u ON a.author_id=u.id
       WHERE a.course_id=$1 ORDER BY a.created_at DESC`,
      [req.params.courseId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

module.exports = { getAllAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement, getCourseAnnouncements };
