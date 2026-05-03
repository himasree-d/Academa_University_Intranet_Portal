import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUser, FiCalendar, FiClock, FiSearch } from 'react-icons/fi';
import Skeleton, { CardSkeleton } from '../../components/common/Skeleton';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API}/courses/my-courses`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setCourses(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.instructor_name||'').toLowerCase().includes(search.toLowerCase())
  );

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };

  if (loading) return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <Skeleton width="200px" height="32px" style={{ marginBottom: '10px' }} />
        <Skeleton width="400px" height="18px" style={{ marginBottom: '28px' }} />
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px'}}>
          {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px'}}>My Courses</h1>
        <p style={{color:colors.light, fontSize:'15px', marginBottom:'28px'}}>View and manage all your enrolled courses</p>

        <div style={{display:'flex', alignItems:'center', gap:'10px', background:colors.card, padding:'10px 18px', borderRadius:'14px', border:`1px solid ${colors.border}`, maxWidth:'400px', marginBottom:'28px'}}>
          <FiSearch color={colors.light}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses..." style={{border:'none', outline:'none', fontSize:'14px', width:'100%', background:'transparent'}}/>
        </div>

        {filtered.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
            <FiBookOpen size={48} style={{opacity:0.3, marginBottom:'16px'}}/>
            <p style={{color:colors.light}}>{courses.length === 0 ? 'You are not enrolled in any courses yet.' : 'No courses match your search.'}</p>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px'}}>
            {filtered.map(c => (
              <div key={c.id} style={{background:colors.card, borderRadius:'24px', padding:'24px', border:`1px solid ${colors.border}`, cursor:'pointer', transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 20px 25px rgba(0,0,0,0.08)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}
                onClick={()=>navigate(`/student/course/${c.id}`)}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                  <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                    <span style={{background:'#eef2ff', color:'#4f46e5', padding:'5px 12px', borderRadius:'30px', fontSize:'12px', fontWeight:'600'}}>{c.code}</span>
                    {c.course_type === 'elective' && (
                      <span style={{background:'#f3f4f6', color:'#6b7280', padding:'4px 10px', borderRadius:'30px', fontSize:'11px', fontWeight:'500', border:'1px solid #e5e7eb'}}>Elective</span>
                    )}
                  </div>
                  <span style={{color:colors.light, fontSize:'13px'}}>{c.credits} credits</span>
                </div>
                <h3 style={{fontSize:'17px', fontWeight:'600', color:colors.text, marginBottom:'8px'}}>{c.name}</h3>
                <div style={{display:'flex', alignItems:'center', gap:'6px', color:colors.light, fontSize:'13px', marginBottom:'16px'}}>
                  <FiUser size={13}/> {c.instructor_name}
                </div>
                <div style={{borderTop:`1px solid ${colors.border}`, paddingTop:'14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:colors.light}}>
                    <FiCalendar size={12}/> {c.schedule}
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:colors.light}}>
                    <FiClock size={12}/> {c.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyCourses;
