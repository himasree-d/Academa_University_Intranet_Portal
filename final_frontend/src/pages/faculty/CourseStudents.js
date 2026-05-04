import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUsers, FiChevronLeft, FiMail, FiBookOpen } from 'react-icons/fi';
import Skeleton from '../../components/common/Skeleton';

const API = 'http://localhost:5001/api';

const CourseStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch(`${API}/courses/${courseId}`, { headers: h }).then(r=>r.json()),
      fetch(`${API}/courses/${courseId}/students`, { headers: h }).then(r=>r.json()),
    ]).then(([c, s]) => {
      if (c.success) setCourse(c.data);
      if (s.success) setStudents(s.data);
    }).finally(() => setLoading(false));
  }, [courseId]);

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };

  if (loading) return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <Skeleton width="100px" height="24px" style={{ marginBottom: '20px' }} />
        <Skeleton width="300px" height="32px" style={{ marginBottom: '10px' }} />
        <Skeleton width="200px" height="20px" style={{ marginBottom: '30px' }} />
        <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
          {[1,2,3,4].map(i => <Skeleton key={i} height="80px" borderRadius="16px" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <button onClick={()=>navigate('/faculty/courses')} style={{display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', color:colors.primary, cursor:'pointer', marginBottom:'20px', fontSize:'14px', fontWeight:'500'}}>
          <FiChevronLeft/> Back to Courses
        </button>
        
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiUsers style={{color:colors.primary}}/> Enrolled Students
        </h1>
        {course && (
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'28px'}}>
            <span style={{background:'#eef2ff', color:'#4f46e5', padding:'4px 12px', borderRadius:'20px', fontSize:'13px', fontWeight:'600'}}>{course.code}</span>
            <span style={{color:colors.light, fontSize:'15px'}}>{course.name}</span>
          </div>
        )}

        {students.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'24px', border:`1px solid ${colors.border}`}}>
            <FiBookOpen size={48} style={{opacity:0.3, marginBottom:'16px', color:colors.text}}/>
            <p style={{color:colors.light, fontSize:'16px'}}>No students are currently enrolled in this course.</p>
          </div>
        ) : (
          <div style={{background:colors.card, borderRadius:'24px', overflow:'hidden', border:`1px solid ${colors.border}`}}>
            <div style={{padding:'20px 24px', background:colors.lightBg, borderBottom:`1px solid ${colors.border}`, display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'16px', fontWeight:'600', color:colors.text, fontSize:'14px'}}>
              <div>Student Details</div>
              <div>Roll Number</div>
              <div>Enrollment Date</div>
            </div>
            {students.map((student, i) => (
              <div key={student.id} style={{padding:'20px 24px', borderBottom: i < students.length - 1 ? `1px solid ${colors.border}` : 'none', display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'16px', alignItems:'center', transition:'background 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.background = colors.lightBg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                
                <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                  <div style={{width:'42px', height:'42px', borderRadius:'12px', background:colors.primary, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:'600', flexShrink:0}}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontSize:'15px', fontWeight:'600', color:colors.text, marginBottom:'4px'}}>{student.name}</div>
                    <a href={`mailto:${student.email}`} style={{fontSize:'13px', color:colors.light, display:'flex', alignItems:'center', gap:'4px', textDecoration:'none'}}>
                      <FiMail size={12}/> {student.email}
                    </a>
                  </div>
                </div>

                <div style={{fontSize:'14px', color:colors.text, fontWeight:'500'}}>
                  {student.enrollment_id || '-'}
                </div>

                <div style={{fontSize:'14px', color:colors.light}}>
                  {new Date(student.enrollment_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseStudents;
