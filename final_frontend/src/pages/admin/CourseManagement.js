import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiSearch, FiPlus, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code:'', name:'', description:'', credits:3, department:'', instructor_id:'', semester:'', schedule:'', room:'' });
  const [result, setResult]   = useState(null);
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  const load = () => {
    Promise.all([
      fetch(`${API}/courses`, { headers: h }).then(r=>r.json()),
      fetch(`${API}/users/faculty`, { headers: h }).then(r=>r.json()),
    ]).then(([c,f]) => { if(c.success) setCourses(c.data); if(f.success) setFaculty(f.data); }).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const createCourse = async (e) => {
    e.preventDefault(); setResult(null);
    try {
      const res = await fetch(`${API}/courses`, { method:'POST', headers:{...h,'Content-Type':'application/json'}, body:JSON.stringify(form) });
      const data = await res.json();
      setResult(data);
      if (data.success) { setForm({ code:'', name:'', description:'', credits:3, department:'', instructor_id:'', semester:'', schedule:'', room:'' }); setShowForm(false); load(); }
    } catch(e) { setResult({ success:false, message:e.message }); }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await fetch(`${API}/courses/${id}`, { method:'DELETE', headers: h });
    load();
  };

  const filtered = courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));
  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };
  const inp = { width:'100%', padding:'10px 14px', border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'14px', outline:'none', boxSizing:'border-box' };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px'}}>
          <div>
            <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'4px', display:'flex', alignItems:'center', gap:'10px'}}><FiBookOpen style={{color:colors.primary}}/> Course Management</h1>
            <p style={{color:colors.light}}>Create and manage all courses</p>
          </div>
          <button onClick={()=>setShowForm(!showForm)} style={{padding:'11px 22px', background:colors.primary, color:'white', border:'none', borderRadius:'12px', fontSize:'14px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px'}}>
            <FiPlus/> Add Course
          </button>
        </div>

        {showForm && (
          <div style={{background:colors.card, borderRadius:'20px', padding:'24px', border:`1px solid ${colors.border}`, marginBottom:'24px'}}>
            <h3 style={{fontSize:'16px', fontWeight:'600', color:colors.text, marginBottom:'16px'}}>Create New Course</h3>
            {result && (
              <div style={{padding:'10px 14px', borderRadius:'10px', marginBottom:'14px', background:result.success?'#f0fdf4':'#fef2f2', border:`1px solid ${result.success?'#bbf7d0':'#fecaca'}`, fontSize:'13px', color:result.success?'#15803d':'#dc2626', display:'flex', alignItems:'center', gap:'8px'}}>
                {result.success?<FiCheckCircle/>:<FiAlertCircle/>} {result.message||'Course created!'}
              </div>
            )}
            <form onSubmit={createCourse}>
              <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'14px'}}>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Code *</label><input value={form.code} onChange={e=>setForm(p=>({...p,code:e.target.value}))} required style={inp} placeholder="CS201"/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required style={inp} placeholder="Course name"/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Credits *</label><input type="number" value={form.credits} onChange={e=>setForm(p=>({...p,credits:e.target.value}))} required min={1} max={6} style={inp}/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Department</label><input value={form.department} onChange={e=>setForm(p=>({...p,department:e.target.value}))} style={inp} placeholder="CSE"/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Semester</label><input value={form.semester} onChange={e=>setForm(p=>({...p,semester:e.target.value}))} style={inp} placeholder="Spring 2024"/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Assign Faculty</label>
                  <select value={form.instructor_id} onChange={e=>setForm(p=>({...p,instructor_id:e.target.value}))} style={{...inp}}>
                    <option value="">No faculty yet</option>
                    {faculty.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Schedule</label><input value={form.schedule} onChange={e=>setForm(p=>({...p,schedule:e.target.value}))} style={inp} placeholder="Mon/Wed 09:00"/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Room</label><input value={form.room} onChange={e=>setForm(p=>({...p,room:e.target.value}))} style={inp} placeholder="ELT-2"/></div>
              </div>
              <div style={{marginBottom:'16px'}}><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Description</label><textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={2} style={{...inp, resize:'vertical'}} placeholder="Course description"/></div>
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" style={{padding:'10px 22px', background:colors.primary, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer'}}>Create Course</button>
                <button type="button" onClick={()=>setShowForm(false)} style={{padding:'10px 22px', background:colors.lightBg, color:colors.text, border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'14px', cursor:'pointer'}}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={{display:'flex', alignItems:'center', gap:'8px', background:colors.card, padding:'10px 16px', borderRadius:'12px', border:`1px solid ${colors.border}`, maxWidth:'360px', marginBottom:'20px'}}>
          <FiSearch color={colors.light}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses..." style={{border:'none',outline:'none',fontSize:'14px',width:'100%',background:'transparent'}}/>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px'}}>
          {filtered.map(c => (
            <div key={c.id} style={{background:colors.card, borderRadius:'20px', padding:'22px', border:`1px solid ${colors.border}`, transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.07)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <span style={{background:'#eef2ff', color:'#4f46e5', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600'}}>{c.code}</span>
                <div style={{display:'flex', gap:'6px'}}>
                  <span style={{background:'#dbeafe', color:colors.primary, padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600'}}>{c.student_count||0} students</span>
                  <button onClick={()=>deleteCourse(c.id)} style={{padding:'4px 8px', background:'#fee2e2', border:'none', borderRadius:'8px', color:'#ef4444', cursor:'pointer'}}><FiTrash2 size={12}/></button>
                </div>
              </div>
              <h3 style={{fontSize:'16px', fontWeight:'600', color:colors.text, marginBottom:'6px'}}>{c.name}</h3>
              <div style={{fontSize:'13px', color:colors.light, marginBottom:'4px'}}>👤 {c.instructor_name || 'No faculty assigned'}</div>
              <div style={{fontSize:'13px', color:colors.light}}>{c.schedule} • {c.room} • {c.credits} credits</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{gridColumn:'1/-1', textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`, color:colors.light}}>
              <FiBookOpen size={48} style={{opacity:0.3, marginBottom:'12px'}}/><p>No courses found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CourseManagement;
