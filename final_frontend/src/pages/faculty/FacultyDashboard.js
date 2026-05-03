import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiClipboard, FiCheckCircle, FiClock, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Skeleton from '../../components/common/Skeleton';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const FacultyDashboard = () => {
  const [data, setData]     = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const h     = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch(`${API}/dashboard`, { headers: h }).then(r=>r.json()),
      fetch(`${API}/courses/my-courses`, { headers: h }).then(r=>r.json()),
    ]).then(([dash, cours]) => {
      if (dash.success)  setData(dash.data);
      if (cours.success) setCourses(cours.data);
    }).finally(() => setLoading(false));
  }, []);

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };

  if (loading) return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <Skeleton width="300px" height="32px" style={{ marginBottom: '10px' }} />
        <Skeleton width="450px" height="18px" style={{ marginBottom: '28px' }} />
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px', marginBottom:'32px'}}>
          {[1,2,3,4].map(i => <Skeleton key={i} height="100px" borderRadius="20px" />)}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'24px'}}>
          <Skeleton height="300px" borderRadius="24px" />
          <Skeleton height="300px" borderRadius="24px" />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px'}}>Welcome, {user.name?.split(' ').slice(-2).join(' ')}! 👋</h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Here's your teaching overview</p>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px', marginBottom:'32px'}}
        >
          {[
            {icon:<FiBookOpen/>, val:data?.totalCourses||courses.length, lbl:'My Courses', border:'4px solid #2563eb', path:'/faculty/courses'},
            {icon:<FiUsers/>, val:data?.totalStudents||0, lbl:'Total Students', border:'4px solid #3b82f6'},
            {icon:<FiClipboard/>, val:data?.pendingGrading||0, lbl:'Pending Grading', border:'4px solid #f59e0b', path:'/faculty/grade'},
            {icon:<FiCheckCircle/>, val:(data?.recentSubmissions||[]).length, lbl:'Recent Submissions', border:'4px solid #10b981', path:'/faculty/grade'},
          ].map((s,i) => (
            <motion.div 
              key={i} 
              onClick={() => s.path && navigate(s.path)}
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
              style={{background:colors.card, padding:'20px', borderRadius:'20px', border:`1px solid ${colors.border}`, borderLeft:s.border, display:'flex', alignItems:'center', gap:'16px', boxShadow:'var(--card-shadow)', cursor: s.path ? 'pointer' : 'default'}}
            >
              <div style={{width:'52px', height:'52px', borderRadius:'16px', background:colors.lightBg, color:colors.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>{s.icon}</div>
              <div><div style={{fontSize:'26px', fontWeight:'700', color:colors.text}}>{s.val}</div><div style={{fontSize:'14px', color:colors.light}}>{s.lbl}</div></div>
            </motion.div>
          ))}
        </motion.div>

        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'24px'}}>
          {/* Courses */}
          <div style={{background:colors.card, borderRadius:'24px', padding:'24px', border:`1px solid ${colors.border}`}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{fontSize:'18px', fontWeight:'600', color:colors.text}}>My Courses</h2>
              <button style={{background:'none', border:'none', color:colors.primary, cursor:'pointer', fontSize:'14px', fontWeight:'500', display:'flex', alignItems:'center', gap:'4px'}} onClick={()=>navigate('/faculty/courses')}>
                View All <FiChevronRight size={14}/>
              </button>
            </div>
            {courses.length === 0 ? <p style={{color:colors.light}}>No courses assigned yet.</p> :
              courses.slice(0,4).map(c => (
                <div key={c.id} style={{padding:'16px', background:colors.lightBg, borderRadius:'16px', marginBottom:'10px', border:`1px solid ${colors.border}`, cursor:'pointer', transition:'all 0.2s'}}
                  onClick={()=>navigate('/faculty/courses')}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#93c5fd';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=colors.border;}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:'15px', fontWeight:'600', color:colors.text}}>{c.name}</div>
                      <div style={{fontSize:'13px', color:colors.light}}>{c.code} • {c.schedule} • {c.room}</div>
                    </div>
                    <div style={{background:'#dbeafe', color:colors.primary, padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600'}}>{c.student_count||0} students</div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Recent Submissions */}
          <div style={{background:colors.card, borderRadius:'24px', padding:'24px', border:`1px solid ${colors.border}`}}>
            <h2 style={{fontSize:'18px', fontWeight:'600', color:colors.text, marginBottom:'20px'}}>Recent Submissions</h2>
            {!data?.recentSubmissions?.length ? <p style={{color:colors.light, fontSize:'14px'}}>No submissions yet.</p> :
              data.recentSubmissions.slice(0,5).map(s => (
                <div key={s.id} style={{padding:'12px', background:colors.lightBg, borderRadius:'14px', marginBottom:'8px', border:`1px solid ${colors.border}`}}>
                  <div style={{fontSize:'14px', fontWeight:'600', color:colors.text, marginBottom:'2px'}}>{s.student_name}</div>
                  <div style={{fontSize:'12px', color:colors.light, marginBottom:'4px'}}>{s.assignment_title}</div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:'11px', color:colors.light, display:'flex', alignItems:'center', gap:'3px'}}><FiClock size={11}/> {new Date(s.submitted_at).toLocaleDateString()}</span>
                    <span style={{padding:'2px 8px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background:s.status==='graded'?'#d1fae5':'#fef3c7', color:s.status==='graded'?'#065f46':'#92400e'}}>{s.status}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default FacultyDashboard;
