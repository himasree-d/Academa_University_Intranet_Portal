import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiFileText, FiDownload } from 'react-icons/fi';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const GradeAssignments = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [grading, setGrading] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API}/assignments?course_id=${courseId}`, { headers: h })
      .then(r=>r.json()).then(d=>{ if(d.success) setAssignments(d.data); })
      .finally(()=>setLoading(false));
  }, [courseId]);

  const loadSubmissions = async (assignmentId) => {
    setSelected(assignmentId);
    const res = await fetch(`${API}/assignments/${assignmentId}/submissions`, { headers: h });
    const data = await res.json();
    if (data.success) setSubmissions(data.data);
  };

  const submitGrade = async (submissionId) => {
    const g = grading[submissionId];
    if (!g?.grade) return alert('Please enter a grade');
    const res = await fetch(`${API}/submissions/${submissionId}/grade`, {
      method:'PUT', headers:{...h,'Content-Type':'application/json'},
      body: JSON.stringify({ grade: parseInt(g.grade), feedback: g.feedback||'' })
    });
    const data = await res.json();
    if (data.success) {
      setSubmissions(prev => prev.map(s => s.id === submissionId ? {...s, status:'graded', grade:g.grade} : s));
      alert('Grade saved!');
    }
  };

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1200px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px'}}>Grade Assignments</h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Review and grade student submissions</p>

        <div style={{display:'grid', gridTemplateColumns:'300px 1fr', gap:'24px'}}>
          {/* Assignment list */}
          <div style={{background:colors.card, borderRadius:'20px', padding:'20px', border:`1px solid ${colors.border}`, height:'fit-content'}}>
            <h3 style={{fontSize:'16px', fontWeight:'600', color:colors.text, marginBottom:'16px'}}>Assignments</h3>
            {assignments.length === 0 ? <p style={{color:colors.light, fontSize:'14px'}}>No assignments yet.</p> :
              assignments.map(a => (
                <div key={a.id} onClick={()=>loadSubmissions(a.id)}
                  style={{padding:'12px', borderRadius:'12px', marginBottom:'8px', cursor:'pointer', background:selectedAssignment===a.id?'#dbeafe':colors.lightBg, border:`1px solid ${selectedAssignment===a.id?colors.primary:colors.border}`, transition:'all 0.2s'}}>
                  <div style={{fontSize:'14px', fontWeight:'600', color:colors.text}}>{a.title}</div>
                  <div style={{fontSize:'12px', color:colors.light}}>Due: {new Date(a.due_date).toLocaleDateString()} • {a.total_marks} marks</div>
                </div>
              ))
            }
          </div>

          {/* Submissions */}
          <div style={{background:colors.card, borderRadius:'20px', padding:'24px', border:`1px solid ${colors.border}`}}>
            {!selectedAssignment ? (
              <div style={{textAlign:'center', padding:'60px', color:colors.light}}>
                <FiFileText size={48} style={{opacity:0.3, marginBottom:'12px'}}/><p>Select an assignment to view submissions</p>
              </div>
            ) : submissions.length === 0 ? (
              <div style={{textAlign:'center', padding:'60px', color:colors.light}}>
                <FiFileText size={48} style={{opacity:0.3, marginBottom:'12px'}}/><p>No submissions yet for this assignment.</p>
              </div>
            ) : (
              <>
                <h3 style={{fontSize:'16px', fontWeight:'600', color:colors.text, marginBottom:'20px'}}>{submissions.length} Submission(s)</h3>
                <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
                  {submissions.map(s => (
                    <div key={s.id} style={{padding:'18px', background:colors.lightBg, borderRadius:'16px', border:`1px solid ${colors.border}`}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                        <div>
                          <div style={{fontSize:'15px', fontWeight:'600', color:colors.text}}>{s.student_name}</div>
                          <div style={{fontSize:'12px', color:colors.light}}>{s.enrollment_id} • Submitted: {new Date(s.submitted_at).toLocaleDateString()}</div>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          {s.file_url && (
                            <a href={`https://academa-mxe9.onrender.com${s.file_url}`} target="_blank" rel="noreferrer"
                              style={{display:'flex', alignItems:'center', gap:'4px', padding:'6px 14px', background:colors.card, border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'13px', color:colors.primary, textDecoration:'none'}}>
                              <FiDownload size={13}/> Download
                            </a>
                          )}
                          <span style={{padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background:s.status==='graded'?'#d1fae5':'#fef3c7', color:s.status==='graded'?'#065f46':'#92400e'}}>{s.status}</span>
                        </div>
                      </div>
                      {s.status !== 'graded' && (
                        <div style={{display:'flex', gap:'10px', alignItems:'center', marginTop:'10px', paddingTop:'10px', borderTop:`1px solid ${colors.border}`}}>
                          <input type="number" placeholder="Grade" min={0} max={s.total_marks||100}
                            value={grading[s.id]?.grade||''}
                            onChange={e=>setGrading(p=>({...p,[s.id]:{...p[s.id],grade:e.target.value}}))}
                            style={{width:'90px', padding:'8px 12px', border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'14px', outline:'none'}}/>
                          <input type="text" placeholder="Feedback (optional)"
                            value={grading[s.id]?.feedback||''}
                            onChange={e=>setGrading(p=>({...p,[s.id]:{...p[s.id],feedback:e.target.value}}))}
                            style={{flex:1, padding:'8px 12px', border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'14px', outline:'none'}}/>
                          <button onClick={()=>submitGrade(s.id)}
                            style={{padding:'8px 18px', background:colors.primary, color:'white', border:'none', borderRadius:'10px', fontSize:'13px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}>
                            <FiCheckCircle size={14}/> Save
                          </button>
                        </div>
                      )}
                      {s.status === 'graded' && (
                        <div style={{marginTop:'8px', fontSize:'14px', color:'#065f46', fontWeight:'600'}}>✅ Grade: {s.grade} / {s.total_marks||100}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GradeAssignments;
