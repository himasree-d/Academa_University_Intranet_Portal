import React, { useState, useEffect } from 'react';
import { FiUserCheck, FiTrash2, FiCheckCircle, FiAlertCircle, FiUser, FiMail, FiBookOpen } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../../components/common/Skeleton';

const API = 'http://localhost:5001/api';

const UserVerification = () => {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [enrollForm, setEnrollForm] = useState({ userId:null, courseIds:[] });
  const [result, setResult] = useState(null);
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    const [uRes, cRes] = await Promise.all([
      fetch(`${API}/users`, { headers: h }).then(r=>r.json()),
      fetch(`${API}/courses`, { headers: h }).then(r=>r.json()),
    ]);
    if (uRes.success) setUsers(uRes.data.filter(u => !u.is_verified && u.role !== 'admin'));
    if (cRes.success) setCourses(cRes.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const verify = async (userId) => {
    const res  = await fetch(`${API}/users/${userId}`, {
      method:'PUT', headers:{...h,'Content-Type':'application/json'},
      body: JSON.stringify({ is_verified: true })
    });
    const data = await res.json();
    if (data.success) { setResult({ success:true, message:'User verified!' }); load(); }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    await fetch(`${API}/users/${userId}`, { method:'DELETE', headers: h });
    load();
  };

  const enrollUser = async () => {
    if (!enrollForm.courseIds.length) return alert('Select at least one course');
    let enrolled = 0;
    for (const cid of enrollForm.courseIds) {
      const res = await fetch(`${API}/courses/${cid}/enroll`, {
        method:'POST', headers:{...h,'Content-Type':'application/json'},
        body: JSON.stringify({ student_id: enrollForm.userId })
      });
      const data = await res.json();
      if (data.success) enrolled++;
    }
    setResult({ success:true, message:`Enrolled in ${enrolled} course(s)!` });
    setEnrollForm({ userId:null, courseIds:[] });
    load();
  };

  const toggleCourse = (id) => {
    setEnrollForm(prev => ({
      ...prev,
      courseIds: prev.courseIds.includes(id)
        ? prev.courseIds.filter(c=>c!==id)
        : [...prev.courseIds, id]
    }));
  };

  const colors = { 
    primary: 'var(--accent-primary)', 
    bg: 'var(--bg-primary)', 
    card: 'var(--bg-secondary)', 
    text: 'var(--text-primary)', 
    light: 'var(--text-secondary)', 
    border: 'var(--border-color)', 
    lightBg: 'var(--bg-tertiary)' 
  };

  if (loading) return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <Skeleton width="300px" height="32px" style={{ marginBottom: '10px' }} />
        <Skeleton width="450px" height="18px" style={{ marginBottom: '28px' }} />
        {[1,2,3].map(i => <Skeleton key={i} height="150px" borderRadius="20px" style={{ marginBottom: '16px' }} />)}
      </div>
    </div>
  );

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiUserCheck style={{color:colors.primary}}/> New User Verification
        </h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Review new registrations, verify genuine users and assign their courses</p>

        {result && (
          <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'13px 18px', borderRadius:'12px', marginBottom:'20px', background:result.success?'#f0fdf4':'#fef2f2', border:`1px solid ${result.success?'#bbf7d0':'#fecaca'}`, color:result.success?'#15803d':'#dc2626', fontSize:'14px'}}>
            {result.success?<FiCheckCircle/>:<FiAlertCircle/>} {result.message}
          </div>
        )}

        {users.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
            <FiUserCheck size={48} style={{opacity:0.3, marginBottom:'16px', color:colors.primary}}/>
            <h3 style={{color:colors.text, marginBottom:'8px'}}>All caught up!</h3>
            <p style={{color:colors.light}}>No pending user verifications.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{display:'flex', flexDirection:'column', gap:'16px'}}
          >
            {users.map((u, i) => (
              <motion.div 
                key={u.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{background:colors.card, borderRadius:'20px', padding:'22px', border:`1px solid ${colors.border}`, boxShadow:'var(--card-shadow)'}}
              >
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px'}}>
                  <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
                    <div style={{width:'52px', height:'52px', borderRadius:'16px', background:u.role==='faculty'?'#ede9fe':'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'700', color:u.role==='faculty'?'#6d28d9':colors.primary}}>
                      {u.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <h3 style={{fontSize:'17px', fontWeight:'600', color:colors.text, marginBottom:'3px'}}>{u.name}</h3>
                      <div style={{display:'flex', gap:'16px', fontSize:'13px', color:colors.light, flexWrap:'wrap'}}>
                        <span style={{display:'flex', alignItems:'center', gap:'4px'}}><FiMail size={12}/>{u.email}</span>
                        <span style={{display:'flex', alignItems:'center', gap:'4px'}}><FiUser size={12}/>{u.role} — {u.department}</span>
                        {u.enrollment_id && <span>ID: {u.enrollment_id}</span>}
                        {u.designation && <span>{u.designation}</span>}
                      </div>
                      <div style={{marginTop:'6px'}}>
                        <span style={{padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background:'#fef3c7', color:'#92400e'}}>⏳ Pending Verification</span>
                        <span style={{marginLeft:'8px', fontSize:'12px', color:colors.light}}>Registered: {new Date(u.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap'}}>
                    {u.role === 'student' && (
                      <button onClick={()=>setEnrollForm(p=>({...p, userId: p.userId===u.id?null:u.id, courseIds:[]}))}
                        style={{padding:'9px 18px', background:'#ede9fe', color:'#6d28d9', border:'1px solid #ddd6fe', borderRadius:'10px', fontSize:'13px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'}}>
                        <FiBookOpen size={14}/> Assign Courses
                      </button>
                    )}
                    <button onClick={()=>verify(u.id)}
                      style={{padding:'9px 18px', background:'#d1fae5', color:'#065f46', border:'1px solid #a7f3d0', borderRadius:'10px', fontSize:'13px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'}}>
                      <FiCheckCircle size={14}/> Verify User
                    </button>
                    <button onClick={()=>deleteUser(u.id)}
                      style={{padding:'9px 14px', background:'#fee2e2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:'10px', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'}}>
                      <FiTrash2 size={14}/> Reject
                    </button>
                  </div>
                </div>

                {/* Course Assignment Panel */}
                {enrollForm.userId === u.id && (
                  <div style={{marginTop:'18px', padding:'18px', background:colors.lightBg, borderRadius:'14px', border:`1px solid ${colors.border}`}}>
                    <h4 style={{fontSize:'14px', fontWeight:'600', color:colors.text, marginBottom:'14px'}}>Select courses for {u.name.split(' ')[0]}:</h4>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'14px'}}>
                      {courses.filter(c => !u.department || c.department === u.department || true).map(c => (
                        <div key={c.id} onClick={()=>toggleCourse(c.id)}
                          style={{padding:'10px 14px', borderRadius:'10px', border:`1px solid ${enrollForm.courseIds.includes(c.id)?colors.primary:colors.border}`, background:enrollForm.courseIds.includes(c.id)?'#dbeafe':colors.card, cursor:'pointer', transition:'all 0.15s'}}>
                          <div style={{fontSize:'13px', fontWeight:'600', color:enrollForm.courseIds.includes(c.id)?colors.primary:colors.text}}>{c.code}</div>
                          <div style={{fontSize:'12px', color:colors.light, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.name}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                      <button onClick={enrollUser} disabled={!enrollForm.courseIds.length}
                        style={{padding:'9px 20px', background:enrollForm.courseIds.length?colors.primary:'#ccc', color:'white', border:'none', borderRadius:'10px', fontSize:'13px', fontWeight:'600', cursor:enrollForm.courseIds.length?'pointer':'not-allowed'}}>
                        Enroll in {enrollForm.courseIds.length} Course(s)
                      </button>
                      <button onClick={()=>setEnrollForm({userId:null,courseIds:[]})}
                        style={{padding:'9px 16px', background:colors.card, color:colors.text, border:`1px solid ${colors.border}`, borderRadius:'10px', fontSize:'13px', cursor:'pointer'}}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default UserVerification;
