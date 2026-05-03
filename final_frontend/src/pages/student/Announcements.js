import React, { useState, useEffect } from 'react';
import { FiBell, FiCalendar, FiUser, FiSearch, FiStar } from 'react-icons/fi';
import Skeleton from '../../components/common/Skeleton';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API}/announcements`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setAnnouncements(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };

  const filtered = announcements.filter(a => {
    const ms = a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    if (filter === 'important') return ms && a.is_important;
    if (filter === 'pinned') return ms && a.is_pinned;
    return ms;
  });

  if (loading) return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <Skeleton width="300px" height="32px" style={{ marginBottom: '10px' }} />
        <Skeleton width="400px" height="18px" style={{ marginBottom: '28px' }} />
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px'}}>
          {[1,2,3,4].map(i => <Skeleton key={i} height="80px" borderRadius="18px" />)}
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
          {[1,2,3].map(i => (
            <div key={i} style={{background:colors.card, borderRadius:'18px', padding:'20px', border:`1px solid ${colors.border}`}}>
              <Skeleton width="150px" height="14px" style={{ marginBottom: '10px' }} />
              <Skeleton width="100%" height="20px" style={{ marginBottom: '10px' }} />
              <Skeleton width="80%" height="16px" style={{ marginBottom: '10px' }} />
              <Skeleton width="200px" height="14px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiBell style={{color:colors.primary}}/> Announcements
        </h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Stay updated with the latest news</p>

        {/* Stats */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px'}}>
          {[
            {label:'Total', val:announcements.length, bg:'#eef2ff', color:'#4f46e5'},
            {label:'Important', val:announcements.filter(a=>a.is_important).length, bg:'#fee2e2', color:'#ef4444'},
            {label:'Pinned', val:announcements.filter(a=>a.is_pinned).length, bg:'#fef3c7', color:'#f59e0b'},
            {label:'Course Related', val:announcements.filter(a=>a.course_id).length, bg:'#e0f2fe', color:'#0ea5e9'},
          ].map((s,i) => (
            <div key={i} style={{background:colors.card, padding:'18px', borderRadius:'18px', border:`1px solid ${colors.border}`, display:'flex', alignItems:'center', gap:'14px'}}>
              <div style={{width:'44px', height:'44px', borderRadius:'14px', background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center'}}><FiBell/></div>
              <div><div style={{fontSize:'22px', fontWeight:'700', color:colors.text}}>{s.val}</div><div style={{fontSize:'13px', color:colors.light}}>{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{display:'flex', gap:'16px', marginBottom:'24px', flexWrap:'wrap'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', background:colors.card, padding:'10px 18px', borderRadius:'14px', border:`1px solid ${colors.border}`, flex:1, maxWidth:'400px'}}>
            <FiSearch color={colors.light}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search announcements..." style={{border:'none',outline:'none',fontSize:'14px',width:'100%',background:'transparent'}}/>
          </div>
          <div style={{display:'flex', gap:'8px'}}>
            {[{id:'all',label:'All'},{id:'important',label:'Important'},{id:'pinned',label:'Pinned'}].map(f => (
              <button key={f.id} onClick={()=>setFilter(f.id)}
                style={{padding:'8px 18px', borderRadius:'30px', border:`1px solid ${filter===f.id?colors.primary:colors.border}`, background:filter===f.id?colors.primary:colors.card, color:filter===f.id?'white':colors.light, fontSize:'13px', cursor:'pointer'}}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
            <FiBell size={48} style={{opacity:0.3, marginBottom:'16px'}}/><p style={{color:colors.light}}>No announcements found.</p>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
            {filtered.map(a => (
              <div key={a.id} style={{background:colors.card, borderRadius:'18px', padding:'20px', border:`1px solid ${colors.border}`, borderLeft:`4px solid ${a.is_pinned?'#f59e0b':a.is_important?'#ef4444':'transparent'}`, transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
                <div style={{display:'flex', gap:'8px', marginBottom:'10px', flexWrap:'wrap'}}>
                  {a.is_pinned && <span style={{background:'#fef3c7', color:'#b45309', padding:'3px 10px', borderRadius:'30px', fontSize:'11px', fontWeight:'600', display:'flex', alignItems:'center', gap:'4px'}}><FiStar size={11}/> Pinned</span>}
                  {a.is_important && <span style={{background:'#fee2e2', color:'#b91c1c', padding:'3px 10px', borderRadius:'30px', fontSize:'11px', fontWeight:'600', display:'flex', alignItems:'center', gap:'4px'}}><FiStar size={11}/> Important</span>}
                  {a.course_name && <span style={{background:'#eef2ff', color:'#4f46e5', padding:'3px 10px', borderRadius:'30px', fontSize:'11px', fontWeight:'600'}}>{a.course_name}</span>}
                </div>
                <h2 style={{fontSize:'16px', fontWeight:'600', color:colors.text, marginBottom:'8px'}}>{a.title}</h2>
                <p style={{color:colors.light, fontSize:'14px', lineHeight:'1.6', marginBottom:'12px'}}>{a.description}</p>
                <div style={{display:'flex', gap:'20px', fontSize:'13px', color:colors.light}}>
                  <span style={{display:'flex', alignItems:'center', gap:'5px'}}><FiUser size={13}/> {a.author_name} {a.designation ? `• ${a.designation}` : ''}</span>
                  <span style={{display:'flex', alignItems:'center', gap:'5px'}}><FiCalendar size={13}/> {new Date(a.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Announcements;
