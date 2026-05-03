import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiFileText, FiUpload, FiBell, FiClipboard } from 'react-icons/fi';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const FacultyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API}/courses/my-courses`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(d=>{ if(d.success) setCourses(d.data); })
      .finally(()=>setLoading(false));
  }, []);

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading courses...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px'}}>My Courses</h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Manage your assigned courses</p>

        {courses.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
            <FiBookOpen size={48} style={{opacity:0.3, marginBottom:'16px'}}/><p style={{color:colors.light}}>No courses assigned yet.</p>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'20px'}}>
            {courses.map(c => (
              <div key={c.id} style={{background:colors.card, borderRadius:'24px', padding:'24px', border:`1px solid ${colors.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                  <span style={{background:'#eef2ff', color:'#4f46e5', padding:'5px 14px', borderRadius:'30px', fontSize:'12px', fontWeight:'600'}}>{c.code}</span>
                  <span style={{background:'#dbeafe', color:colors.primary, padding:'5px 14px', borderRadius:'30px', fontSize:'12px', fontWeight:'600'}}>{c.student_count||0} students</span>
                </div>
                <h3 style={{fontSize:'18px', fontWeight:'600', color:colors.text, marginBottom:'8px'}}>{c.name}</h3>
                <div style={{fontSize:'13px', color:colors.light, marginBottom:'16px'}}>{c.schedule} • {c.room} • {c.credits} credits</div>

                {/* Quick Actions */}
                <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', paddingTop:'16px', borderTop:`1px solid ${colors.border}`}}>
                  {[
                    {icon:<FiClipboard size={14}/>, label:'Assignments', action:()=>navigate('/faculty/create-assignment')},
                    {icon:<FiUpload size={14}/>, label:'Materials', action:()=>navigate('/faculty/upload-materials')},
                    {icon:<FiBell size={14}/>, label:'Announce', action:()=>navigate('/faculty/post-announcement')},
                    {icon:<FiFileText size={14}/>, label:'Grade', action:()=>navigate(`/faculty/grade-assignments/${c.id}`)},
                    {icon:<FiUsers size={14}/>, label:'Students', action:()=>navigate(`/faculty/course/${c.id}/students`)},
                  ].map((btn,i) => (
                    <button key={i} onClick={btn.action}
                      style={{padding:'8px', border:`1px solid ${colors.border}`, borderRadius:'12px', background:colors.lightBg, color:colors.primary, fontSize:'12px', fontWeight:'500', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', transition:'all 0.2s'}}
                      onMouseEnter={e=>{e.currentTarget.style.background=colors.primary;e.currentTarget.style.color='white';}}
                      onMouseLeave={e=>{e.currentTarget.style.background=colors.lightBg;e.currentTarget.style.color=colors.primary;}}>
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FacultyCourses;
