const db = require('../config/database');
const path = require('path');

const getAllMaterials = async (req, res) => {
  try {
    const { course_id } = req.query;
    let q = `SELECT m.*, u.name as instructor_name, co.name as course_name, co.code FROM materials m LEFT JOIN users u ON m.instructor_id=u.id LEFT JOIN courses co ON m.course_id=co.id WHERE 1=1`;
    const p = [];
    if (course_id) { p.push(course_id); q += ` AND m.course_id=$${p.length}`; }
    q += ' ORDER BY m.created_at DESC';
    const result = await db.query(q, p);
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const uploadMaterial = async (req, res) => {
  try {
    const { course_id, title, description } = req.body;
    const check = await db.query('SELECT id FROM courses WHERE id=$1 AND instructor_id=$2',[course_id, req.user.id]);
    if (!check.rows.length && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Permission denied' });

    let file_url=null, file_name=null, file_size=null, file_type=null;
    if (req.file) {
      file_url  = `/uploads/${req.file.filename}`;
      file_name = req.file.originalname;
      file_size = `${(req.file.size/(1024*1024)).toFixed(1)} MB`;
      file_type = path.extname(req.file.originalname).slice(1).toLowerCase();
    }
    const result = await db.query(
      `INSERT INTO materials (course_id,title,description,instructor_id,file_url,file_name,file_size,file_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [course_id, title, description, req.user.id, file_url, file_name, file_size, file_type]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const deleteMaterial = async (req, res) => {
  try {
    await db.query('DELETE FROM materials WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const downloadMaterial = async (req, res) => {
  try {
    await db.query('UPDATE materials SET download_count=download_count+1 WHERE id=$1',[req.params.id]);
    const r = await db.query('SELECT * FROM materials WHERE id=$1',[req.params.id]);
    res.json({ success: true, data: r.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

module.exports = { getAllMaterials, uploadMaterial, deleteMaterial, downloadMaterial };
