import React, { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton, { TableRowSkeleton } from '../../components/common/Skeleton';

const API = 'http://localhost:5001/api';

const UserManagement = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [roleFilter, setRole] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student', department:'', enrollment_id:'', designation:'' });
  const [result, setResult]   = useState(null);
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  const load = () => {
    fetch(`${API}/users`, { headers: h }).then(r=>r.json()).then(d=>{ if(d.success) setUsers(d.data); }).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const createUser = async (e) => {
    e.preventDefault(); setResult(null);
    try {
      const res = await fetch(`${API}/users`, { method:'POST', headers:{...h,'Content-Type':'application/json'}, body:JSON.stringify(form) });
      const data = await res.json();
      setResult(data);
      if (data.success) { setForm({ name:'', email:'', password:'', role:'student', department:'', enrollment_id:'', designation:'' }); setShowForm(false); load(); }
    } catch(e) { setResult({ success:false, message:e.message }); }
  };

  const toggleActive = async (user) => {
    await fetch(`${API}/users/${user.id}`, { method:'PUT', headers:{...h,'Content-Type':'application/json'}, body:JSON.stringify({ is_active: !user.is_active }) });
    load();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    await fetch(`${API}/users/${id}`, { method:'DELETE', headers: h });
    load();
  };

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };
  const roleColor = (r) => ({ admin:{bg:'#fee2e2',color:'#991b1b'}, faculty:{bg:'#ede9fe',color:'#6d28d9'}, student:{bg:'#dbeafe',color:'#1d4ed8'} }[r] || {});
  const inp = { width:'100%', padding:'10px 14px', border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'14px', outline:'none', boxSizing:'border-box' };

  const filtered = users.filter(u => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return ms && (roleFilter === 'all' || u.role === roleFilter);
  });

  if (loading) return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'28px'}}>
          <Skeleton width="300px" height="32px" />
          <Skeleton width="120px" height="40px" borderRadius="12px" />
        </div>
        <div style={{display:'flex', gap:'12px', marginBottom:'20px'}}>
          <Skeleton width="360px" height="40px" borderRadius="12px" />
          <Skeleton width="80px" height="32px" borderRadius="30px" />
          <Skeleton width="80px" height="32px" borderRadius="30px" />
        </div>
        <div style={{background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
          {[1,2,3,4,5,6].map(i => <TableRowSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px'}}
        >
          <div>
            <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'4px', display:'flex', alignItems:'center', gap:'10px'}}><FiUsers style={{color:colors.primary}}/> User Management</h1>
            <p style={{color:colors.light}}>Manage students, faculty and admins</p>
          </div>
          <button onClick={()=>setShowForm(!showForm)} style={{padding:'11px 22px', background:colors.primary, color:'white', border:'none', borderRadius:'12px', fontSize:'14px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px'}}>
            <FiUserPlus/> Add User
          </button>
        </motion.div>

        {/* Add User Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{background:colors.card, borderRadius:'20px', padding:'24px', border:`1px solid ${colors.border}`, marginBottom:'24px', overflow:'hidden'}}
            >
            <h3 style={{fontSize:'16px', fontWeight:'600', color:colors.text, marginBottom:'16px'}}>Add New User</h3>
            {result && (
              <div style={{padding:'10px 14px', borderRadius:'10px', marginBottom:'14px', background:result.success?'#f0fdf4':'#fef2f2', border:`1px solid ${result.success?'#bbf7d0':'#fecaca'}`, fontSize:'13px', color:result.success?'#15803d':'#dc2626', display:'flex', alignItems:'center', gap:'8px'}}>
                {result.success?<FiCheckCircle/>:<FiAlertCircle/>} {result.message}
              </div>
            )}
            <form onSubmit={createUser}>
              <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'14px'}}>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required style={inp} placeholder="Full name"/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Email *</label><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required type="email" style={inp} placeholder="email@academa.edu"/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Password *</label><input value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required type="password" style={inp} placeholder="Min 6 characters"/></div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Role *</label>
                  <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={{...inp}}>
                    <option value="student">Student</option><option value="faculty">Faculty</option><option value="admin">Admin</option>
                  </select>
                </div>
                <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Department</label><input value={form.department} onChange={e=>setForm(p=>({...p,department:e.target.value}))} style={inp} placeholder="e.g. CSE"/></div>
                {form.role==='student' && <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Enrollment ID</label><input value={form.enrollment_id} onChange={e=>setForm(p=>({...p,enrollment_id:e.target.value}))} style={inp} placeholder="e.g. 2023CS001"/></div>}
                {form.role==='faculty' && <div><label style={{fontSize:'13px', fontWeight:'500', color:colors.text, marginBottom:'6px', display:'block'}}>Designation</label><input value={form.designation} onChange={e=>setForm(p=>({...p,designation:e.target.value}))} style={inp} placeholder="e.g. Professor"/></div>}
              </div>
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" style={{padding:'10px 22px', background:colors.primary, color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer'}}>Create User</button>
                <button type="button" onClick={()=>setShowForm(false)} style={{padding:'10px 22px', background:colors.lightBg, color:colors.text, border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'14px', cursor:'pointer'}}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Filters */}
        <div style={{display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap'}}>
          <div style={{display:'flex', alignItems:'center', gap:'8px', background:colors.card, padding:'10px 16px', borderRadius:'12px', border:`1px solid ${colors.border}`, flex:1, maxWidth:'360px'}}>
            <FiSearch color={colors.light}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." style={{border:'none',outline:'none',fontSize:'14px',width:'100%',background:'transparent'}}/>
          </div>
          {['all','student','faculty','admin'].map(r => (
            <button key={r} onClick={()=>setRole(r)} style={{padding:'8px 18px', borderRadius:'30px', border:`1px solid ${roleFilter===r?colors.primary:colors.border}`, background:roleFilter===r?colors.primary:colors.card, color:roleFilter===r?'white':colors.light, fontSize:'13px', cursor:'pointer'}}>
              {r.charAt(0).toUpperCase()+r.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`, overflow:'hidden'}}>
          <div style={{display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr 120px', padding:'14px 20px', background:colors.lightBg, fontSize:'13px', fontWeight:'600', color:colors.text}}>
            <span>Name</span><span>Email</span><span>Role</span><span>Department</span><span>Status</span><span>Actions</span>
          </div>
          {filtered.map(u => (
            <div key={u.id} style={{display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr 120px', padding:'14px 20px', borderBottom:`1px solid ${colors.border}`, alignItems:'center', fontSize:'14px', transition:'background 0.1s'}}
              onMouseEnter={e=>e.currentTarget.style.background=colors.lightBg}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{fontWeight:'500', color:colors.text}}>{u.name}</span>
              <span style={{color:colors.light, fontSize:'13px'}}>{u.email}</span>
              <span><span style={{padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', ...roleColor(u.role)}}>{u.role}</span></span>
              <span style={{color:colors.light}}>{u.department||'—'}</span>
              <span><span style={{padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background:u.is_active?'#d1fae5':'#fee2e2', color:u.is_active?'#065f46':'#991b1b'}}>{u.is_active?'Active':'Inactive'}</span></span>
              <div style={{display:'flex', gap:'8px'}}>
                <button onClick={()=>toggleActive(u)} title={u.is_active?'Deactivate':'Activate'}
                  style={{padding:'6px', borderRadius:'8px', border:`1px solid ${colors.border}`, background:colors.lightBg, cursor:'pointer', color:u.is_active?'#f59e0b':'#10b981'}}>
                  <FiCheckCircle size={14}/>
                </button>
                <button onClick={()=>deleteUser(u.id)} title="Delete"
                  style={{padding:'6px', borderRadius:'8px', border:'1px solid #fecaca', background:'#fee2e2', cursor:'pointer', color:'#ef4444'}}>
                  <FiTrash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{textAlign:'center', padding:'40px', color:colors.light}}>No users found.</div>}
        </div>
      </div>
    </div>
  );
};
export default UserManagement;
