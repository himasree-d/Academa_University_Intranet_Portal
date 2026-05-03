import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiFileText, FiDownload, FiChevronLeft } from 'react-icons/fi';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const GlobalGrading = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({});
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API}/submissions/faculty/pending`, { headers: h })
      .then(r => r.json())
      .then(d => { if(d.success) setSubmissions(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const grade = async (submissionId) => {
    const g = grading[submissionId];
    if (!g?.grade) return alert('Enter a grade');
    const res = await fetch(`${API}/submissions/${submissionId}/grade`, {
      method:'PUT', headers:{...h,'Content-Type':'application/json'},
      body: JSON.stringify({ grade: parseInt(g.grade), feedback: g.feedback||'' })
    });
    const data = await res.json();
    if (data.success) {
      setSubmissions(prev => prev.filter(s => s.id !== submissionId)); // Remove graded from pending list
      alert('Grade saved successfully!');
    } else {
      alert(data.message || 'Failed to save grade');
    }
  };

  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'

  const getSubmissionsByCourse = () => {
    const grouped = {};
    submissions.forEach(s => {
      const courseName = s.course_name || 'Other';
      if (!grouped[courseName]) grouped[courseName] = [];
      grouped[courseName].push(s);
    });

    // Sort within each group
    Object.keys(grouped).forEach(course => {
      grouped[course].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.submitted_at) - new Date(a.submitted_at);
        if (sortBy === 'oldest') return new Date(a.submitted_at) - new Date(b.submitted_at);
        return 0;
      });
    });

    return grouped;
  };

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };
  const submissionsByCourse = getSubmissionsByCourse();

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading pending submissions...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <button onClick={()=>navigate('/faculty/dashboard')} style={{display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', color:colors.primary, cursor:'pointer', marginBottom:'20px', fontSize:'14px', fontWeight:'500'}}>
          <FiChevronLeft/> Back to Dashboard
        </button>
        
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'28px'}}>
          <div>
            <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px'}}>Pending Grading</h1>
            <p style={{color:colors.light}}>Review and grade student submissions across all your courses</p>
          </div>
          <div style={{display:'flex', gap:'8px', marginBottom:'4px'}}>
            <button onClick={() => setSortBy('newest')} style={{fontSize:'12px', padding:'6px 12px', borderRadius:'8px', border:`1px solid ${sortBy==='newest'?colors.primary:colors.border}`, background:sortBy==='newest'?colors.primary:'transparent', color:sortBy==='newest'?'white':colors.light, cursor:'pointer', fontWeight:'500'}}>Newest First</button>
            <button onClick={() => setSortBy('oldest')} style={{fontSize:'12px', padding:'6px 12px', borderRadius:'8px', border:`1px solid ${sortBy==='oldest'?colors.primary:colors.border}`, background:sortBy==='oldest'?colors.primary:'transparent', color:sortBy==='oldest'?'white':colors.light, cursor:'pointer', fontWeight:'500'}}>Oldest First</button>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
            <FiCheckCircle size={48} style={{opacity:0.3, marginBottom:'16px', color:'#10b981'}}/>
            <p style={{color:colors.light, fontSize:'16px'}}>All caught up! No pending submissions to grade.</p>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'32px'}}>
            {Object.keys(submissionsByCourse).map(course => (
              <div key={course}>
                <div style={{fontSize:'14px', fontWeight:'700', color:colors.primary, marginBottom:'16px', textTransform:'uppercase', letterSpacing:'1px', display:'flex', alignItems:'center', gap:'10px'}}>
                  <div style={{height:'1px', flex:1, background:colors.border}}/>
                  {course}
                  <div style={{height:'1px', flex:1, background:colors.border}}/>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                  {submissionsByCourse[course].map(s => (
                    <div key={s.id} style={{background:colors.card, borderRadius:'20px', padding:'24px', border:`1px solid ${colors.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.02)'}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px'}}>
                        <div>
                          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
                            <span style={{color:colors.text, fontSize:'16px', fontWeight:'600'}}>{s.assignment_title}</span>
                          </div>
                          <div style={{fontSize:'15px', fontWeight:'600', color:colors.text, marginBottom:'4px'}}>{s.student_name} <span style={{fontSize:'13px', fontWeight:'500', color:colors.light}}>({s.enrollment_id})</span></div>
                          <div style={{fontSize:'13px', color:colors.light, display:'flex', alignItems:'center', gap:'4px'}}>
                            <FiFileText size={12}/> Submitted: {new Date(s.submitted_at).toLocaleString([], { dateStyle:'medium', timeStyle:'short' })}
                          </div>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          {s.file_url && (
                            <a href={`https://academa-mxe9.onrender.com${s.file_url}`} target="_blank" rel="noreferrer"
                              style={{display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', background:colors.lightBg, border:`1px solid ${colors.border}`, borderRadius:'12px', fontSize:'13px', color:colors.primary, textDecoration:'none', fontWeight:'500', transition:'all 0.2s'}}
                              onMouseEnter={e=>{e.currentTarget.style.background=colors.primary; e.currentTarget.style.color='white';}}
                              onMouseLeave={e=>{e.currentTarget.style.background=colors.lightBg; e.currentTarget.style.color=colors.primary;}}
                            >
                              <FiDownload size={14}/> View Submission
                            </a>
                          )}
                          <span style={{padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background:'#fef3c7', color:'#92400e'}}>
                            {s.status}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{display:'flex', gap:'12px', alignItems:'center', paddingTop:'16px', borderTop:`1px solid ${colors.border}`}}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <input type="number" placeholder="Grade" min={0} max={s.total_marks||100}
                            value={grading[s.id]?.grade||''}
                            onChange={e=>setGrading(p=>({...p,[s.id]:{...p[s.id],grade:e.target.value}}))}
                            style={{width:'90px', padding:'10px 14px', border:`1px solid ${colors.border}`, borderRadius:'12px', fontSize:'14px', outline:'none', background:colors.lightBg, textAlign:'center', fontWeight:'600'}}/>
                          <span style={{color:colors.light, fontSize:'14px', fontWeight:'500'}}>/ {s.total_marks||100}</span>
                        </div>
                        <input type="text" placeholder="Add feedback for the student..."
                          value={grading[s.id]?.feedback||''}
                          onChange={e=>setGrading(p=>({...p,[s.id]:{...p[s.id],feedback:e.target.value}}))}
                          style={{flex:1, padding:'10px 16px', border:`1px solid ${colors.border}`, borderRadius:'12px', fontSize:'14px', outline:'none', background:colors.lightBg}}/>
                        <button onClick={()=>grade(s.id)}
                          style={{padding:'10px 24px', background:colors.primary, color:'white', border:'none', borderRadius:'12px', fontSize:'14px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', transition:'all 0.2s'}}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--accent-hover)'}>
                          <FiCheckCircle size={16}/> Save Grade
                        </button>
                      </div>
                    </div>
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

export default GlobalGrading;
