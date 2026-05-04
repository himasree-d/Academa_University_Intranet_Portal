import React, { useState, useEffect } from 'react';
import { FiBell, FiPlus, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const SystemAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm] = useState({ title:'', description:'', course_id:'', is_important:false, is_pinned:false, is_global:true });
  const [result, setResult]       = useState(null);
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  const load = () => {
    Promise.all([
      fetch(`${API}/announcements`, { headers: h }).then(r=>r.json()),
      fetch(`${API}/courses`, { headers: h }).then(r=>r.json()),
    ]).then(([a,c]) => { if(a.success) setAnnouncements(a.data); if(c.success) setCourses(c.data); }).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const create = async (e) => {
    e.preventDefault(); setResult(null);
    try {
      const res = await fetch(`${API}/announcements`, { method:'POST', headers:{...h,'Content-Type':'application/json'}, body:JSON.stringify({...form, course_id:form.course_id||null}) });
      const data = await res.json();
      setResult(data);
      if(data.success) { setForm({ title:'', description:'', course_id:'', is_important:false, is_pinned:false, is_global:true }); setShowForm(false); load(); }
    } catch(e) { setResult({success:false,message:e.message}); }
  };

  const del = async (id) => {
    if(!window.confirm('Delete this announcement?')) return;
    await fetch(`${API}/announcements/${id}`, { method:'DELETE', headers: h });
    load();
  };

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };
  const inp = { width:'100%', padding:'10px 14px', border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'14px', outline:'none', boxSizing:'border-box' };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px'}}>
          <div>
            <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'4px', display:'flex', alignItems:'center', gap:'10px'}}><FiBell style={{color:colors.primary}}/> System Announcements</h1>
            <p style={{color:colors.light}}>Post and manage all announcements</p>
          </div>
          <button onClick={()=>setShowForm(!showForm)} style={{padding:'11px 22px', background:colors.primary, color:'white', border:'none', borderRadius:'12px', fontSize:'14px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px'}}>
            <FiPlus/> New Announcement
          </button>
        </div>

        {showForm && (
          <div style={{background:colors.card, borderRadius:'20px', padding:'24px', border:`1px solid ${colors.border}`, marginBottom:'24px'}}>
            {result && <div style={{padding:'10px 14px', borderRadius:'10px', marginBottom:'14px', background:result.success?'#f0fdf4':'#fef2f2', border:`1px solid ${result.success?'#bbf7d0':'#fecaca'}`, fontSize:'13px', color:result.success?'#15803d':'#dc2626', display:'flex', alignItems:'center', gap:'8px'}}>{result.success?<FiCheckCircle/>:<FiAlertCircle/>} {result.message||'Done!'}</div>}
            <form onSubmit={create}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
                <div style={{gridColumn:'1/-1'}}><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Title *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required style={inp} placeholder="Announcement title"/></div>
                <div style={{gridColumn:'1/-1'}}><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Description *</label><textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required rows={4} style={{...inp,resize:'vertical'}} placeholder="Write your announcement..."/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Course (optional)</label>
                  <select value={form.course_id} onChange={e=>setForm(p=>({...p,course_id:e.target.value}))} style={{...inp}}>
                    <option value="">All / Global</option>
                    {courses.map(c=><option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
                  </select>
                </div>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:'10px', paddingBottom:'4px'}}>
                  {[['is_important','Mark as Important'],['is_pinned','Pin to Top'],['is_global','Global (all users)']].map(([k,l])=>(
                    <label key={k} style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', cursor:'pointer'}}>
                      <input type="checkbox" checked={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.checked}))} style={{accentColor:colors.primary}}/> {l}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" style={{padding:'10px 22px', background:colors.primary, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer'}}>Post</button>
                <button type="button" onClick={()=>setShowForm(false)} style={{padding:'10px 22px', background:colors.lightBg, color:colors.text, border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'14px', cursor:'pointer'}}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
          {announcements.length === 0 ? (
            <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`, color:colors.light}}>
              <FiBell size={48} style={{opacity:0.3, marginBottom:'12px'}}/><p>No announcements yet.</p>
            </div>
          ) : announcements.map(a => (
            <div key={a.id} style={{background:colors.card, borderRadius:'18px', padding:'20px', border:`1px solid ${colors.border}`, borderLeft:`4px solid ${a.is_pinned?'#f59e0b':a.is_important?'#ef4444':'var(--border-color)'}`}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex', gap:'8px', marginBottom:'8px', flexWrap:'wrap'}}>
                    {a.is_pinned && <span style={{background:'#fef3c7', color:'#b45309', padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600'}}>📌 Pinned</span>}
                    {a.is_important && <span style={{background:'#fee2e2', color:'#b91c1c', padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600'}}>⚠ Important</span>}
                    {a.is_global && <span style={{background:'#dbeafe', color:'#1d4ed8', padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600'}}>🌐 Global</span>}
                    {a.course_name && <span style={{background:'#ede9fe', color:'#6d28d9', padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600'}}>{a.course_name}</span>}
                  </div>
                  <h3 style={{fontSize:'16px', fontWeight:'600', color:colors.text, marginBottom:'6px'}}>{a.title}</h3>
                  <p style={{fontSize:'14px', color:colors.light, lineHeight:'1.5', marginBottom:'8px'}}>{a.description}</p>
                  <div style={{fontSize:'12px', color:colors.light}}>By {a.author_name} • {new Date(a.created_at).toLocaleDateString()}</div>
                </div>
                <button onClick={()=>del(a.id)} style={{marginLeft:'16px', padding:'6px', background:'#fee2e2', border:'none', borderRadius:'8px', color:'#ef4444', cursor:'pointer'}}>
                  <FiTrash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SystemAnnouncements;
