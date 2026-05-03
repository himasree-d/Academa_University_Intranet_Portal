const db     = require('../config/database');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id,name,email,role,department,branch,batch,enrollment_id,designation,is_active,is_verified,last_login,created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success:true, data:result.rows });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const getUserById = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id,name,email,role,department,branch,batch,enrollment_id,designation,is_active,is_verified,created_at FROM users WHERE id=$1',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ success:false, message:'Not found' });
    res.json({ success:true, data:result.rows[0] });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, department, branch, batch, designation, is_active, is_verified } = req.body;
    const result = await db.query(
      `UPDATE users SET
         name=COALESCE($1,name), email=COALESCE($2,email),
         department=COALESCE($3,department), branch=COALESCE($4,branch),
         batch=COALESCE($5,batch), designation=COALESCE($6,designation),
         is_active=COALESCE($7,is_active), is_verified=COALESCE($8,is_verified),
         updated_at=NOW()
       WHERE id=$9
       RETURNING id,name,email,role,department,branch,batch,designation,is_active,is_verified`,
      [name,email,department,branch,batch,designation,is_active,is_verified, req.params.id]
    );
    res.json({ success:true, data:result.rows[0] });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id=$1',[req.params.id]);
    res.json({ success:true, message:'User deleted' });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const createUser = async (req, res) => {
  try {
    const { name,email,password,role,department,branch,batch,enrollment_id,designation } = req.body;
    const hash = await bcrypt.hash(password||'Password@123', 10);
    const result = await db.query(
      `INSERT INTO users (name,email,password_hash,role,department,branch,batch,enrollment_id,designation,email_verified,is_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,true)
       RETURNING id,name,email,role,department,enrollment_id`,
      [name,email,hash,role,department,branch||null,batch||null,enrollment_id||null,designation||null]
    );
    res.status(201).json({ success:true, data:result.rows[0] });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const getStudents = async (req, res) => {
  try {
    const result = await db.query("SELECT id,name,email,department,branch,batch,enrollment_id,is_active,is_verified FROM users WHERE role='student' ORDER BY name");
    res.json({ success:true, data:result.rows });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const getFaculty = async (req, res) => {
  try {
    const result = await db.query("SELECT id,name,email,department,designation,is_active FROM users WHERE role='faculty' ORDER BY name");
    res.json({ success:true, data:result.rows });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, createUser, getStudents, getFaculty };
