import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiClock, FiCalendar, FiBookOpen, FiSearch, FiCheckCircle, FiChevronRight } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API}/assignments/my-assignments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setAssignments(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)', success:'#10b981', warning:'#f59e0b' };

  const statusStyle = (s) => ({
    pending:  { bg:'#fef3c7', color:'#92400e' },
    submitted:{ bg:'#dbeafe', color:'#1e40af' },
    graded:   { bg:'#d1fae5', color:'#065f46' },
    late:     { bg:'#fee2e2', color:'#991b1b' },
  }[s] || { bg:colors.lightBg, color:colors.light });

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || (a.course_name||'').toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchSearch;
    if (filter === 'pending') return matchSearch && !a.submission_status;
    if (filter === 'submitted') return matchSearch && a.submission_status === 'submitted';
    if (filter === 'graded') return matchSearch && a.submission_status === 'graded';
    return matchSearch;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => !a.submission_status).length,
    submitted: assignments.filter(a => a.submission_status === 'submitted').length,
    graded: assignments.filter(a => a.submission_status === 'graded').length,
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading assignments...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiFileText style={{color:colors.primary}}/> Assignments
        </h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Track and manage all your course assignments</p>

        {/* Stats */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px'}}>
          {[
            {label:'Total', val:stats.total, bg:'#dbeafe', color:colors.primary},
            {label:'Pending', val:stats.pending, bg:'#fef3c7', color:'#92400e'},
            {label:'Submitted', val:stats.submitted, bg:'#dbeafe', color:'#1e40af'},
            {label:'Graded', val:stats.graded, bg:'#d1fae5', color:'#065f46'},
          ].map((s,i) => (
            <div key={i} style={{background:colors.card, padding:'18px', borderRadius:'18px', border:`1px solid ${colors.border}`, display:'flex', alignItems:'center', gap:'14px'}}>
              <div style={{width:'44px', height:'44px', borderRadius:'14px', background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>
                <FiFileText/>
              </div>
              <div>
                <div style={{fontSize:'22px', fontWeight:'700', color:colors.text}}>{s.val}</div>
                <div style={{fontSize:'13px', color:colors.light}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{display:'flex', gap:'16px', marginBottom:'24px', flexWrap:'wrap'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', background:colors.card, padding:'10px 18px', borderRadius:'14px', border:`1px solid ${colors.border}`, flex:1, maxWidth:'400px'}}>
            <FiSearch color={colors.light}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search assignments..." style={{border:'none',outline:'none',fontSize:'14px',width:'100%',background:'transparent'}}/>
          </div>
          <div style={{display:'flex', gap:'8px'}}>
            {['all','pending','submitted','graded'].map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                style={{padding:'8px 18px', borderRadius:'30px', border:`1px solid ${filter===f?colors.primary:colors.border}`, background:filter===f?colors.primary:colors.card, color:filter===f?'white':colors.light, fontSize:'13px', fontWeight:'500', cursor:'pointer'}}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        {filtered.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
            <FiFileText size={48} style={{opacity:0.3, marginBottom:'16px'}}/>
            <p style={{color:colors.light}}>No assignments found.</p>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
            {filtered.map(a => {
              const status = a.submission_status || 'pending';
              const ss = statusStyle(status);
              const isOverdue = !a.submission_status && new Date(a.due_date) < new Date();
              return (
                <div key={a.id} style={{background:colors.card, borderRadius:'20px', padding:'24px', border:`1px solid ${colors.border}`, transition:'all 0.2s', cursor:'pointer'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 20px rgba(37,99,235,0.1)';}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}
                  onClick={()=>navigate(`/student/assignment-submission/${a.id}`)}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                    <div style={{flex:1}}>
                      <h2 style={{fontSize:'17px', fontWeight:'600', color:colors.text, marginBottom:'4px'}}>{a.title}</h2>
                      <div style={{fontSize:'13px', color:colors.light}}>{a.course_name} ({a.course_code}) • {a.instructor_name}</div>
                    </div>
                    <span style={{padding:'5px 14px', borderRadius:'30px', fontSize:'12px', fontWeight:'600', background:ss.bg, color:ss.color, whiteSpace:'nowrap', marginLeft:'16px'}}>
                      {isOverdue ? '⚠ Overdue' : status.charAt(0).toUpperCase()+status.slice(1)}
                    </span>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', padding:'12px 0', borderTop:`1px solid ${colors.border}`, borderBottom:`1px solid ${colors.border}`, marginBottom:'16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:colors.light}}><FiCalendar size={13}/> Due: {new Date(a.due_date).toLocaleDateString()}</div>
                    <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:colors.light}}><FiBookOpen size={13}/> {a.total_marks} marks</div>
                    {a.grade && <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:colors.primary, fontWeight:'600'}}><FiCheckCircle size={13}/> Grade: {a.grade}/{a.total_marks}</div>}
                  </div>
                  <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <button style={{padding:'8px 20px', borderRadius:'30px', border:'none', background:status==='pending'?colors.primary:colors.lightBg, color:status==='pending'?'white':colors.primary, fontSize:'13px', fontWeight:'500', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'}}>
                      {status === 'pending' ? 'Submit Assignment' : 'View Submission'} <FiChevronRight size={14}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default Assignments;
