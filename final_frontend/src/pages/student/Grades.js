import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiAward, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import Skeleton, { TableRowSkeleton } from '../../components/common/Skeleton';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const Grades = () => {
  const [grades, setGrades]   = useState([]);
  const [gpa, setGpa]         = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API}/grades/my-grades`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { 
        if (d.success) { 
          setGrades(d.data); 
          setGpa(d.gpa); 
        } 
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Group grades by semester
  const groupedGrades = grades.reduce((acc, g) => {
    const sem = g.semester || 'Current Semester';
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(g);
    return acc;
  }, {});

  // Calculate SGPA for a semester
  const calculateSGPA = (semGrades) => {
    const totalPoints = semGrades.reduce((s, g) => s + (parseFloat(g.grade_point || 0) * (g.credits || 0)), 0);
    const totalCredits = semGrades.reduce((s, g) => s + (g.credits || 0), 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const colors = { 
    primary:'var(--accent-primary)', 
    bg:'var(--bg-primary)', 
    card:'var(--bg-secondary)', 
    text:'var(--text-primary)', 
    light:'var(--text-secondary)', 
    border:'var(--border-color)', 
    lightBg:'var(--bg-tertiary)' 
  };
  
  const gradeColor = (g) => {
    if (!g) return colors.light;
    if (g === 'A+' || g === 'A') return '#6a8c7d'; // Sage Dark
    if (g.startsWith('B')) return '#7ea191'; // Sage
    if (g.startsWith('C')) return '#d4a373'; // Muted Sand
    if (g === 'D') return '#b07d62'; // Muted Terracotta
    return '#8a9f94'; // Slate Gray (F)
  };

  if (loading) return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <Skeleton width="300px" height="32px" style={{ marginBottom: '10px' }} />
        <Skeleton width="400px" height="18px" style={{ marginBottom: '28px' }} />
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'32px'}}>
          <Skeleton height="100px" borderRadius="20px" />
          <Skeleton height="100px" borderRadius="20px" />
          <Skeleton height="100px" borderRadius="20px" />
        </div>
        <div style={{background:colors.card, borderRadius:'24px', padding:'24px', border:`1px solid ${colors.border}`}}>
          <Skeleton width="200px" height="24px" style={{ marginBottom: '20px' }} />
          {[1,2,3,4,5].map(i => <TableRowSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiBarChart2 style={{color:colors.primary}}/> Grades & Performance
        </h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Track your academic performance across semesters</p>

        {/* Summary Cards */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'32px'}}>
          {[
            {icon:<FiAward/>, val: parseFloat(gpa?.gpa||0).toFixed(2), lbl:'Overall CGPA', bg:'var(--accent-light)', color:colors.primary},
            {icon:<FiTrendingUp/>, val: grades.length, lbl:'Courses Graded', bg:'#ecfdf5', color:'#10b981'},
            {icon:<FiBookOpen/>, val: grades.reduce((s,g)=>s+(g.credits||0),0), lbl:'Total Credits', bg:'#fffbeb', color:'#f59e0b'},
          ].map((s,i) => (
            <div key={i} style={{background:colors.card, padding:'24px', borderRadius:'20px', border:`1px solid ${colors.border}`, display:'flex', alignItems:'center', gap:'16px', boxShadow:'var(--card-shadow)'}}>
              <div style={{width:'52px', height:'52px', borderRadius:'16px', background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>{s.icon}</div>
              <div><div style={{fontSize:'28px', fontWeight:'700', color:colors.text}}>{s.val}</div><div style={{fontSize:'14px', color:colors.light}}>{s.lbl}</div></div>
            </div>
          ))}
        </div>

        {/* Semester-wise Sections */}
        <div style={{display:'flex', flexDirection:'column', gap:'32px'}}>
          {Object.keys(groupedGrades).sort((a,b) => b.localeCompare(a)).map(semester => {
            const semGrades = groupedGrades[semester];
            const sgpa = calculateSGPA(semGrades);

            return (
              <div key={semester} style={{background:colors.card, borderRadius:'24px', padding:'24px', border:`1px solid ${colors.border}`, boxShadow:'var(--card-shadow)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', borderBottom:`1px solid ${colors.border}`, paddingBottom:'15px'}}>
                  <div>
                    <h2 style={{fontSize:'20px', fontWeight:'700', color:colors.text}}>{semester}</h2>
                    <span style={{fontSize:'12px', color:colors.light}}>{semGrades[0].academic_year || 'Academic Year'}</span>
                  </div>
                  <div style={{padding:'10px 20px', background:colors.lightBg, borderRadius:'15px', color:colors.primary, fontWeight:'800', fontSize:'16px', border:`1px solid ${colors.border}`}}>
                    SGPA: {sgpa}
                  </div>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 3fr 1fr 1fr', padding:'12px 16px', background:colors.lightBg, borderRadius:'12px', fontSize:'13px', fontWeight:'600', color:colors.text, marginBottom:'8px'}}>
                  <span>CODE</span><span>COURSE NAME</span><span>CREDITS</span><span style={{textAlign:'right'}}>GRADE</span>
                </div>
                
                {semGrades.map(g => (
                  <div key={g.id} style={{display:'grid', gridTemplateColumns:'1fr 3fr 1fr 1fr', padding:'16px', borderBottom:`1px solid ${colors.border}`, alignItems:'center', fontSize:'14px', transition:'all 0.2s'}}
                    onMouseEnter={e=>e.currentTarget.style.background=colors.lightBg}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <span style={{fontWeight:'600', color:colors.primary}}>{g.code}</span>
                    <span style={{color:colors.text}}>{g.course_name}</span>
                    <span style={{color:colors.light}}>{g.credits}</span>
                    <div style={{textAlign:'right'}}>
                      {g.grade ? (
                        <span style={{padding:'6px 14px', borderRadius:'30px', fontSize:'13px', fontWeight:'800', background:`${gradeColor(g.grade)}20`, color:gradeColor(g.grade), border:`1px solid ${gradeColor(g.grade)}40`}}>
                          {g.grade} ({parseFloat(g.grade_point).toFixed(0)})
                        </span>
                      ) : <span style={{color:colors.light}}>Pending</span>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {grades.length === 0 && (
            <div style={{background:colors.card, borderRadius:'24px', padding:'60px', border:`1px solid ${colors.border}`, textAlign:'center', color:colors.light}}>
              <FiBarChart2 size={48} style={{opacity:0.2, marginBottom:'16px'}}/>
              <p style={{fontSize:'18px'}}>No grades found in your record.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grades;
