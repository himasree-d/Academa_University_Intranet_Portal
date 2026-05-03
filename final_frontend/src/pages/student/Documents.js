import React, { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiSearch, FiFolder, FiBookOpen } from 'react-icons/fi';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const Documents = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [courseFilter, setCourse] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API}/materials`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setMaterials(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };
  const courses = ['all', ...new Set(materials.map(m => m.code).filter(Boolean))];

  const filtered = materials.filter(m => {
    const ms = m.title.toLowerCase().includes(search.toLowerCase()) || (m.course_name||'').toLowerCase().includes(search.toLowerCase());
    return ms && (courseFilter === 'all' || m.code === courseFilter);
  });

  const fileIcon = (type) => type === 'zip' ? <FiFolder/> : type === 'sql' ? <FiBookOpen/> : <FiFileText/>;

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading materials...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiFileText style={{color:colors.primary}}/> Documents & Materials
        </h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Access all your course materials and resources</p>

        {/* Stats */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px'}}>
          {[
            {label:'Total', val:materials.length, bg:'#dbeafe', color:colors.primary},
            {label:'PDFs', val:materials.filter(m=>m.file_type==='pdf').length, bg:'#fee2e2', color:'#ef4444'},
            {label:'ZIP Files', val:materials.filter(m=>m.file_type==='zip').length, bg:'#fef3c7', color:'#f59e0b'},
            {label:'Others', val:materials.filter(m=>m.file_type!=='pdf'&&m.file_type!=='zip').length, bg:'#d1fae5', color:'#10b981'},
          ].map((s,i) => (
            <div key={i} style={{background:colors.card, padding:'18px', borderRadius:'18px', border:`1px solid ${colors.border}`, display:'flex', alignItems:'center', gap:'14px'}}>
              <div style={{width:'44px', height:'44px', borderRadius:'14px', background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center'}}><FiFileText/></div>
              <div><div style={{fontSize:'22px', fontWeight:'700', color:colors.text}}>{s.val}</div><div style={{fontSize:'13px', color:colors.light}}>{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', background:colors.card, padding:'10px 18px', borderRadius:'14px', border:`1px solid ${colors.border}`, flex:1, maxWidth:'400px'}}>
            <FiSearch color={colors.light}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search documents..." style={{border:'none',outline:'none',fontSize:'14px',width:'100%',background:'transparent'}}/>
          </div>
          <select value={courseFilter} onChange={e=>setCourse(e.target.value)}
            style={{padding:'10px 16px', border:`1px solid ${colors.border}`, borderRadius:'12px', fontSize:'14px', color:colors.text, background:colors.card, outline:'none'}}>
            {courses.map(c => <option key={c} value={c}>{c === 'all' ? 'All Courses' : c}</option>)}
          </select>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
            <FiFileText size={48} style={{opacity:0.3, marginBottom:'16px'}}/><p style={{color:colors.light}}>No documents found.</p>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px'}}>
            {filtered.map(m => (
              <div key={m.id} style={{background:colors.card, borderRadius:'18px', padding:'20px', border:`1px solid ${colors.border}`, transition:'all 0.2s', cursor:'pointer'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 20px rgba(37,99,235,0.1)';e.currentTarget.style.borderColor='#93c5fd';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor=colors.border;}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'14px'}}>
                  <div style={{width:'46px', height:'46px', borderRadius:'14px', background:colors.lightBg, display:'flex', alignItems:'center', justifyContent:'center', color:colors.primary, fontSize:'22px'}}>
                    {fileIcon(m.file_type)}
                  </div>
                  <span style={{background:colors.lightBg, color:colors.light, padding:'4px 10px', borderRadius:'20px', fontSize:'11px'}}>{m.code || '—'}</span>
                </div>
                <h3 style={{fontSize:'15px', fontWeight:'600', color:colors.text, marginBottom:'8px', lineHeight:1.4}}>{m.title}</h3>
                <div style={{fontSize:'12px', color:colors.light, marginBottom:'14px'}}>
                  {m.file_type?.toUpperCase()} • {m.file_size} • {m.download_count} downloads
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'12px', borderTop:`1px solid ${colors.border}`}}>
                  <span style={{fontSize:'12px', color:colors.light}}>{m.instructor_name}</span>
                  {m.file_url && (
                    <a href={`https://academa-mxe9.onrender.com${m.file_url}`} target="_blank" rel="noreferrer"
                      style={{display:'flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:colors.lightBg, border:`1px solid ${colors.border}`, borderRadius:'8px', fontSize:'12px', color:colors.primary, textDecoration:'none'}}
                      onClick={e=>e.stopPropagation()}>
                      <FiDownload size={12}/> Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Documents;
