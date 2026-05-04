import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClipboard, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const CreateAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ course_id:'', title:'', description:'', instructions:'', due_date:'', due_time:'23:59', total_marks:100 });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API}/courses/my-courses`, { headers: h }).then(r=>r.json()).then(d=>{ if(d.success) setCourses(d.data); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API}/assignments`, { method:'POST', headers:{...h,'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      setResult(data);
      if (data.success) { setForm({ course_id:'', title:'', description:'', instructions:'', due_date:'', due_time:'23:59', total_marks:100 }); }
    } catch(e) { setResult({ success:false, message:e.message }); }
    finally { setLoading(false); }
  };

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };
  const inp = { width:'100%', padding:'12px 16px', border:`1px solid ${colors.border}`, borderRadius:'12px', fontSize:'14px', outline:'none', boxSizing:'border-box', background:colors.card };
  const lbl = { display:'block', fontSize:'14px', fontWeight:'500', color:colors.text, marginBottom:'8px' };

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'760px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiClipboard style={{color:colors.primary}}/> Create Assignment
        </h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Post a new assignment for your students</p>

        <div style={{background:colors.card, borderRadius:'24px', padding:'32px', border:`1px solid ${colors.border}`}}>
          {result && (
            <div style={{padding:'14px 18px', borderRadius:'12px', marginBottom:'20px', background:result.success?'#f0fdf4':'#fef2f2', border:`1px solid ${result.success?'#bbf7d0':'#fecaca'}`, display:'flex', alignItems:'center', gap:'10px', color:result.success?'#15803d':'#dc2626'}}>
              {result.success ? <FiCheckCircle/> : <FiAlertCircle/>} {result.success ? 'Assignment created successfully!' : result.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'20px'}}>
              <label style={lbl}>Course *</label>
              <select value={form.course_id} onChange={e=>setForm(p=>({...p,course_id:e.target.value}))} required style={{...inp}}>
                <option value="">Select a course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
              </select>
            </div>
            <div style={{marginBottom:'20px'}}>
              <label style={lbl}>Title *</label>
              <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required placeholder="e.g. Binary Tree Implementation" style={inp}/>
            </div>
            <div style={{marginBottom:'20px'}}>
              <label style={lbl}>Description</label>
              <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} placeholder="Brief description of the assignment..." style={{...inp, resize:'vertical'}}/>
            </div>
            <div style={{marginBottom:'20px'}}>
              <label style={lbl}>Instructions</label>
              <textarea value={form.instructions} onChange={e=>setForm(p=>({...p,instructions:e.target.value}))} rows={4} placeholder="Detailed instructions for students..." style={{...inp, resize:'vertical'}}/>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginBottom:'28px'}}>
              <div>
                <label style={lbl}>Due Date *</label>
                <input type="date" value={form.due_date} onChange={e=>setForm(p=>({...p,due_date:e.target.value}))} required style={inp}/>
              </div>
              <div>
                <label style={lbl}>Due Time</label>
                <input type="time" value={form.due_time} onChange={e=>setForm(p=>({...p,due_time:e.target.value}))} style={inp}/>
              </div>
              <div>
                <label style={lbl}>Total Marks *</label>
                <input type="number" value={form.total_marks} onChange={e=>setForm(p=>({...p,total_marks:e.target.value}))} required min={1} style={inp}/>
              </div>
            </div>
            <div style={{display:'flex', gap:'12px'}}>
              <button type="submit" disabled={loading} style={{padding:'13px 28px', background:loading?'#ccc':colors.primary, color:'white', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'600', cursor:loading?'not-allowed':'pointer'}}>
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
              <button type="button" onClick={()=>navigate('/faculty/dashboard')} style={{padding:'13px 28px', background:colors.lightBg, color:colors.text, border:`1px solid ${colors.border}`, borderRadius:'12px', fontSize:'15px', cursor:'pointer'}}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateAssignment;
