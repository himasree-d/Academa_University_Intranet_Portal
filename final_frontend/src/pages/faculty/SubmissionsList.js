import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiFileText, FiDownload, FiCheckCircle, FiChevronLeft } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const SubmissionsList = () => {
  const { assignmentId } = useParams();
  const navigate         = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment]   = useState(null);
  const [loading, setLoading]         = useState(true);
  const [grading, setGrading]         = useState({});
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch(`${API}/assignments/${assignmentId}`, { headers: h }).then(r=>r.json()),
      fetch(`${API}/assignments/${assignmentId}/submissions`, { headers: h }).then(r=>r.json()),
    ]).then(([a, s]) => {
      if (a.success) setAssignment(a.data);
      if (s.success) setSubmissions(s.data);
    }).finally(() => setLoading(false));
  }, [assignmentId]);

  const grade = async (submissionId) => {
    const g = grading[submissionId];
    if (!g?.grade) return alert('Enter a grade');
    const res  = await fetch(`${API}/submissions/${submissionId}/grade`, {
      method:'PUT', headers:{...h,'Content-Type':'application/json'},
      body: JSON.stringify({ grade: parseInt(g.grade), feedback: g.feedback||'' })
    });
    const data = await res.json();
    if (data.success) {
      setSubmissions(prev => prev.map(s => s.id===submissionId ? {...s,status:'graded',grade:parseInt(g.grade)} : s));
    }
  };

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'#fff', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading...</div>;

  return (
    <div style={{backgroundColor:colors.bg,minHeight:'100vh',padding:'32px'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <button onClick={()=>navigate('/faculty/courses')} style={{display:'flex',alignItems:'center',gap:'6px',background:'none',border:'none',color:colors.primary,cursor:'pointer',marginBottom:'20px',fontSize:'14px',fontWeight:'500'}}>
          <FiChevronLeft/> Back
        </button>
        <h1 style={{fontSize:'26px',fontWeight:'600',color:colors.text,marginBottom:'4px'}}>Submissions</h1>
        {assignment && <p style={{color:colors.light,marginBottom:'24px'}}>{assignment.title} • {submissions.length} submission(s)</p>}

        {submissions.length===0 ? (
          <div style={{textAlign:'center',padding:'60px',background:colors.card,borderRadius:'20px',border:`1px solid ${colors.border}`}}>
            <FiFileText size={48} style={{opacity:0.3,marginBottom:'16px'}}/><p style={{color:colors.light}}>No submissions yet.</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {submissions.map(s => (
              <div key={s.id} style={{background:colors.card,borderRadius:'18px',padding:'20px',border:`1px solid ${colors.border}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                  <div>
                    <div style={{fontSize:'16px',fontWeight:'600',color:colors.text}}>{s.student_name}</div>
                    <div style={{fontSize:'13px',color:colors.light}}>{s.enrollment_id} • Submitted: {new Date(s.submitted_at).toLocaleString()}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    {s.file_url && (
                      <a href={`http://localhost:5001${s.file_url}`} target="_blank" rel="noreferrer"
                        style={{display:'flex',alignItems:'center',gap:'4px',padding:'7px 14px',background:colors.lightBg,border:`1px solid ${colors.border}`,borderRadius:'10px',fontSize:'13px',color:colors.primary,textDecoration:'none'}}>
                        <FiDownload size={13}/> {s.file_name||'Download'}
                      </a>
                    )}
                    <span style={{padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'600',background:s.status==='graded'?'#d1fae5':'#fef3c7',color:s.status==='graded'?'#065f46':'#92400e'}}>
                      {s.status}
                    </span>
                  </div>
                </div>
                {s.status==='graded' ? (
                  <div style={{fontSize:'14px',color:'#065f46',fontWeight:'600'}}>✅ Grade: {s.grade}/{assignment?.total_marks||100} {s.feedback && <span style={{fontWeight:'400',color:colors.light}}>— {s.feedback}</span>}</div>
                ) : (
                  <div style={{display:'flex',gap:'10px',alignItems:'center',paddingTop:'12px',borderTop:`1px solid ${colors.border}`}}>
                    <input type="number" placeholder="Grade" min={0} max={assignment?.total_marks||100}
                      value={grading[s.id]?.grade||''}
                      onChange={e=>setGrading(p=>({...p,[s.id]:{...p[s.id],grade:e.target.value}}))}
                      style={{width:'90px',padding:'8px 12px',border:`1px solid ${colors.border}`,borderRadius:'10px',fontSize:'14px',outline:'none'}}/>
                    <input type="text" placeholder="Feedback (optional)"
                      value={grading[s.id]?.feedback||''}
                      onChange={e=>setGrading(p=>({...p,[s.id]:{...p[s.id],feedback:e.target.value}}))}
                      style={{flex:1,padding:'8px 12px',border:`1px solid ${colors.border}`,borderRadius:'10px',fontSize:'14px',outline:'none'}}/>
                    <button onClick={()=>grade(s.id)}
                      style={{padding:'8px 18px',background:colors.primary,color:'white',border:'none',borderRadius:'10px',fontSize:'13px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px'}}>
                      <FiCheckCircle size={14}/> Save Grade
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SubmissionsList;
