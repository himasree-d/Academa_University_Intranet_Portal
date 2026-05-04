import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiClipboard, FiCalendar, FiMessageSquare, FiClock, FiUser, FiFileText, FiChevronRight, FiBell } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Skeleton, { CardSkeleton } from '../../components/common/Skeleton';

const API = 'http://localhost:5001/api';

const StudentDashboard = () => {
  const [data, setData]         = useState(null);
  const [courses, setCourses]   = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const h     = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, courseRes, assignRes, annRes] = await Promise.all([
          fetch(`${API}/dashboard`, { headers: h }),
          fetch(`${API}/courses/my-courses`, { headers: h }),
          fetch(`${API}/assignments/my-assignments`, { headers: h }),
          fetch(`${API}/announcements`, { headers: h }),
        ]);
        const [dash, cours, assign, ann] = await Promise.all([dashRes.json(), courseRes.json(), assignRes.json(), annRes.json()]);
        if (dash.success)   setData(dash.data);
        if (cours.success)  setCourses(cours.data.slice(0, 4));
        if (assign.success) setAssignments(assign.data.filter(a => !a.submission_status || a.submission_status === 'pending').slice(0, 3));
        if (ann.success)    setAnnouncements(ann.data.slice(0, 2));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const colors = { 
    primary: 'var(--accent-primary)', 
    secondary: 'var(--accent-hover)', 
    softBlue: 'var(--accent-light)', 
    background: 'var(--bg-primary)', 
    cardBg: 'var(--bg-secondary)', 
    text: 'var(--text-primary)', 
    textLight: 'var(--text-secondary)', 
    border: 'var(--border-color)', 
    lightBg: 'var(--bg-tertiary)' 
  };

  const s = {
    page:{ backgroundColor:colors.background, minHeight:'100vh' },
    container:{ padding:'32px', maxWidth:'1280px', margin:'0 auto' },
    welcome:{ marginBottom:'32px' },
    welcomeTitle:{ fontSize:'28px', color:colors.text, marginBottom:'6px', fontWeight:'600' },
    welcomeSub:{ color:colors.textLight, fontSize:'15px' },
    statsGrid:{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px', marginBottom:'32px' },
    statCard:{ background:colors.cardBg, padding:'20px', borderRadius:'20px', boxShadow:'var(--card-shadow)', display:'flex', alignItems:'center', gap:'16px', border:`1px solid ${colors.border}` },
    statIcon:{ width:'52px', height:'52px', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', background:colors.lightBg, color:colors.primary },
    statVal:{ fontSize:'26px', fontWeight:'700', color:colors.text, marginBottom:'4px' },
    statLbl:{ color:colors.textLight, fontSize:'14px', fontWeight:'500' },
    mainGrid:{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'24px' },
    section:{ background:colors.cardBg, borderRadius:'24px', padding:'24px', boxShadow:'var(--card-shadow)', marginBottom:'24px', border:`1px solid ${colors.border}` },
    sectionHeader:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' },
    sectionTitle:{ fontSize:'18px', color:colors.text, fontWeight:'600' },
    viewAllBtn:{ background:'none', border:'none', color:colors.primary, cursor:'pointer', fontSize:'14px', fontWeight:'500', display:'flex', alignItems:'center', gap:'4px' },
    coursesGrid:{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'16px' },
    courseCard:{ background:colors.lightBg, borderRadius:'20px', padding:'20px', transition:'all 0.2s', border:`1px solid ${colors.border}`, cursor:'pointer' },
    courseName:{ fontSize:'15px', fontWeight:'600', color:colors.text, marginBottom:'6px' },
    courseInstructor:{ fontSize:'13px', color:colors.textLight, marginBottom:'12px', display:'flex', alignItems:'center', gap:'4px' },
    progressBar:{ height:'6px', background:colors.border, borderRadius:'12px', overflow:'hidden', marginBottom:'4px' },
    progressFill:{ height:'100%', background:colors.primary, borderRadius:'12px' },
    sideCard:{ background:colors.cardBg, borderRadius:'24px', padding:'24px', boxShadow:'var(--card-shadow)', marginBottom:'24px', border:`1px solid ${colors.border}` },
    assignItem:{ padding:'14px', background:colors.lightBg, borderRadius:'14px', marginBottom:'10px', border:`1px solid ${colors.border}`, cursor:'pointer' },
    assignTitle:{ fontSize:'14px', fontWeight:'600', color:colors.text, marginBottom:'4px' },
    assignCourse:{ fontSize:'12px', color:colors.textLight, marginBottom:'8px' },
    dueDate:{ fontSize:'12px', color:colors.textLight, display:'flex', alignItems:'center', gap:'4px' },
    annItem:{ padding:'14px', background:colors.lightBg, borderRadius:'14px', marginBottom:'10px', border:`1px solid ${colors.border}` },
    annTitle:{ fontSize:'14px', color:colors.text, marginBottom:'6px', fontWeight:'500' },
    annMeta:{ fontSize:'12px', color:colors.textLight },
    loading:{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh', fontSize:'18px', color:colors.textLight }
  };

  if (loading) return (
    <div style={s.page}><div style={s.container}>
      <div style={s.welcome}>
        <Skeleton width="300px" height="32px" style={{ marginBottom: '10px' }} />
        <Skeleton width="450px" height="18px" />
      </div>
      <div style={s.statsGrid}>
        <Skeleton height="100px" borderRadius="20px" />
        <Skeleton height="100px" borderRadius="20px" />
        <Skeleton height="100px" borderRadius="20px" />
        <Skeleton height="100px" borderRadius="20px" />
      </div>
      <div style={s.mainGrid}>
        <div>
          <div style={s.section}>
            <Skeleton width="200px" height="24px" style={{ marginBottom: '20px' }} />
            <div style={s.coursesGrid}>
              <Skeleton height="140px" borderRadius="20px" />
              <Skeleton height="140px" borderRadius="20px" />
            </div>
          </div>
          <div style={s.section}>
            <Skeleton width="200px" height="24px" style={{ marginBottom: '20px' }} />
            <Skeleton height="60px" borderRadius="14px" style={{ marginBottom: '10px' }} />
            <Skeleton height="60px" borderRadius="14px" />
          </div>
        </div>
        <div>
          <div style={s.sideCard}>
            <Skeleton width="150px" height="20px" style={{ marginBottom: '20px' }} />
            <Skeleton height="80px" borderRadius="14px" style={{ marginBottom: '10px' }} />
            <Skeleton height="80px" borderRadius="14px" />
          </div>
        </div>
      </div>
    </div></div>
  );

  const stats = [
    { icon:<FiBookOpen />, val: data?.enrolledCourses || courses.length, lbl:'Enrolled Courses',   border:'4px solid var(--accent-primary)', path:'/student/my-courses' },
    { icon:<FiClipboard />, val: data?.pendingAssignments || assignments.length, lbl:'Pending Assignments', border:'4px solid #a8b8b0', path:'/student/assignments' },
    { icon:<FiCalendar />, val: data?.timetableCount || 0, lbl:'Class Timetable', border:'4px solid #d4a373', path:'/student/timetable' },
    { icon:<FiMessageSquare />, val: data?.unreadMessages || 0, lbl:'New Messages',       border:'4px solid #b07d62', path:'/student/chat' },
  ];

  return (
    <div style={s.page}><div style={s.container}>
      <div style={s.welcome}>
        <h1 style={s.welcomeTitle}>Welcome back, {user.name?.split(' ')[0]}! 👋</h1>
        <p style={s.welcomeSub}>Here's what's happening with your courses today</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
        style={s.statsGrid}
      >
        {stats.map((st, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5, scale: 1.02 }}
            style={{...s.statCard, borderLeft: st.border, cursor: 'pointer'}}
            onClick={() => navigate(st.path)}
          >
            <div style={s.statIcon}>{st.icon}</div>
            <div><div style={s.statVal}>{st.val}</div><div style={s.statLbl}>{st.lbl}</div></div>
          </motion.div>
        ))}
      </motion.div>

      <div style={s.mainGrid}>
        <div>
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>My Current Courses</h2>
              <button style={s.viewAllBtn} onClick={() => navigate('/student/my-courses')}>View All <FiChevronRight size={14}/></button>
            </div>
            {courses.length === 0 ? (
              <p style={{color:colors.textLight, textAlign:'center', padding:'20px'}}>No courses enrolled yet.</p>
            ) : (
              <div style={s.coursesGrid}>
                {courses.map(c => (
                  <div key={c.id} style={s.courseCard}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(37,99,235,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
                    onClick={() => navigate(`/student/course/${c.id}`)}>
                    <div style={s.courseName}>{c.name}</div>
                    <div style={s.courseInstructor}><FiUser size={12}/> {c.instructor_name}</div>
                    <div style={s.progressBar}><div style={{...s.progressFill, width:'60%'}}/></div>
                    <div style={{fontSize:'11px', color:colors.textLight, marginTop:'4px'}}>{c.schedule} • {c.room}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={s.section}>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>Announcements</h2>
              <button style={s.viewAllBtn} onClick={() => navigate('/student/announcements')}>View All <FiChevronRight size={14}/></button>
            </div>
            {announcements.length === 0 ? <p style={{color:colors.textLight}}>No announcements yet.</p> :
              announcements.map(a => (
                <div key={a.id} style={s.annItem}>
                  <div style={s.annTitle}>{a.title}</div>
                  <div style={s.annMeta}>{a.author_name} • {new Date(a.created_at).toLocaleDateString()}</div>
                </div>
              ))
            }
          </div>
        </div>

        <div>
          <div style={s.sideCard}>
            <div style={s.sectionHeader}>
              <h3 style={{fontSize:'16px', fontWeight:'600', color:colors.text}}>Upcoming Assignments</h3>
              <FiClipboard color={colors.textLight} size={18}/>
            </div>
            {assignments.length === 0 ? <p style={{color:colors.textLight, fontSize:'14px'}}>No pending assignments! 🎉</p> :
              assignments.map(a => (
                <div key={a.id} style={s.assignItem}
                  onClick={() => navigate(`/student/assignment-submission/${a.id}`)}>
                  <div style={s.assignTitle}>{a.title}</div>
                  <div style={s.assignCourse}>{a.course_name}</div>
                  <div style={s.dueDate}><FiClock size={11}/> Due: {new Date(a.due_date).toLocaleDateString()}</div>
                </div>
              ))
            }
          </div>

          <div style={s.sideCard}>
            <div style={s.sectionHeader}>
              <h3 style={{fontSize:'16px', fontWeight:'600', color:colors.text}}>Quick Actions</h3>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
              {[
                { icon:<FiFileText/>, label:'Assignments', path:'/student/assignments' },
                { icon:<FiMessageSquare/>, label:'Messages', path:'/student/chat' },
                { icon:<FiCalendar/>, label:'Timetable', path:'/student/timetable' },
                { icon:<FiCalendar/>, label:'Calendar', path:'/student/calendar' },
              ].map((q,i) => (
                <button key={i} style={{padding:'12px', border:`1px solid ${colors.border}`, borderRadius:'14px', fontSize:'13px', fontWeight:'500', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', background:colors.lightBg, color:colors.primary, transition:'all 0.2s'}}
                  onClick={() => navigate(q.path)}
                  onMouseEnter={e => { e.currentTarget.style.background=colors.primary; e.currentTarget.style.color='white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background=colors.lightBg; e.currentTarget.style.color=colors.primary; }}>
                  {q.icon} {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div></div>
  );
};
export default StudentDashboard;
