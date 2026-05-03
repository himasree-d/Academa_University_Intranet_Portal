const db = require('../config/database');

const safe = async (fn, fallback) => { try { return await fn(); } catch(e) { return fallback; } };

const getStudentDashboard = async (req, res) => {
  try {
    const sid = req.user.id;
    const courses  = await safe(() => db.query('SELECT COUNT(*) as c FROM enrollments WHERE student_id=$1 AND status=$2',[sid,'active']), {rows:[{c:0}]});
    const pending  = await safe(() => db.query(`SELECT COUNT(*) as c FROM assignments a JOIN courses co ON a.course_id=co.id JOIN enrollments e ON co.id=e.course_id LEFT JOIN submissions s ON a.id=s.assignment_id AND s.student_id=$1 WHERE e.student_id=$1 AND e.status='active' AND a.due_date>=NOW() AND s.id IS NULL`,[sid]), {rows:[{c:0}]});
    const upcoming = await safe(() => db.query(`SELECT a.id, a.title, a.due_date, co.name as course_name, co.code FROM assignments a JOIN courses co ON a.course_id=co.id JOIN enrollments e ON co.id=e.course_id WHERE e.student_id=$1 AND e.status='active' AND a.due_date BETWEEN NOW() AND NOW()+INTERVAL '7 days' ORDER BY a.due_date LIMIT 5`,[sid]), {rows:[]});
    const msgs     = await safe(() => db.query('SELECT COUNT(*) as c FROM chat_messages WHERE receiver_id=$1 AND is_read=false',[sid]), {rows:[{c:0}]});
    res.json({ success:true, data:{ enrolledCourses:parseInt(courses.rows[0].c), pendingAssignments:parseInt(pending.rows[0].c), upcomingEvents:upcoming.rows, unreadMessages:parseInt(msgs.rows[0].c) }});
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const getFacultyDashboard = async (req, res) => {
  try {
    const fid = req.user.id;
    const courses  = await safe(() => db.query('SELECT COUNT(*) as c FROM courses WHERE instructor_id=$1 AND is_active=true',[fid]), {rows:[{c:0}]});
    const students = await safe(() => db.query(`SELECT COUNT(DISTINCT e.student_id) as c FROM enrollments e JOIN courses co ON e.course_id=co.id WHERE co.instructor_id=$1 AND e.status='active'`,[fid]), {rows:[{c:0}]});
    const pending  = await safe(() => db.query(`SELECT COUNT(*) as c FROM submissions s JOIN assignments a ON s.assignment_id=a.id JOIN courses co ON a.course_id=co.id WHERE co.instructor_id=$1 AND s.status='submitted'`,[fid]), {rows:[{c:0}]});
    const subs     = await safe(() => db.query(`SELECT s.*, u.name as student_name, u.enrollment_id, a.title as assignment_title, co.name as course_name FROM submissions s JOIN users u ON s.student_id=u.id JOIN assignments a ON s.assignment_id=a.id JOIN courses co ON a.course_id=co.id WHERE co.instructor_id=$1 ORDER BY s.submitted_at DESC LIMIT 10`,[fid]), {rows:[]});
    res.json({ success:true, data:{ totalCourses:parseInt(courses.rows[0].c), totalStudents:parseInt(students.rows[0].c), pendingGrading:parseInt(pending.rows[0].c), recentSubmissions:subs.rows }});
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const getAdminDashboard = async (req, res) => {
  try {
    const users   = await safe(() => db.query(`SELECT COUNT(*) as total, COUNT(CASE WHEN role='student' THEN 1 END) as students, COUNT(CASE WHEN role='faculty' THEN 1 END) as faculty, COUNT(CASE WHEN is_active=true THEN 1 END) as active FROM users`), {rows:[{total:0,students:0,faculty:0,active:0}]});
    const courses = await safe(() => db.query(`SELECT COUNT(*) as total, COUNT(CASE WHEN is_active=true THEN 1 END) as active FROM courses`), {rows:[{total:0,active:0}]});
    const stats   = await safe(() => db.query(`SELECT (SELECT COUNT(*) FROM submissions WHERE status='submitted') as pending_submissions, (SELECT COUNT(*) FROM submissions WHERE status='graded') as graded_submissions`), {rows:[{pending_submissions:0,graded_submissions:0}]});
    res.json({ success:true, data:{ users:users.rows[0], courses:courses.rows[0], stats:stats.rows[0] }});
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const getPlatformStats = async (req, res) => {
  try {
    const userGrowth = await safe(() => db.query(`SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`), {rows:[]});
    const deptDist   = await safe(() => db.query(`SELECT department, COUNT(*) as count FROM courses GROUP BY department`), {rows:[]});
    res.json({ success:true, data:{ userGrowth:userGrowth.rows, courseDistribution:deptDist.rows }});
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

module.exports = { getStudentDashboard, getFacultyDashboard, getAdminDashboard, getPlatformStats };
