import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiBookOpen, FiClipboard, FiUpload, FiUserPlus, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Skeleton from '../../components/common/Skeleton';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const AdminDashboard = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    Promise.all([
      fetch(`${API}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()),
      fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()),
    ]).then(([dash, users]) => {
      if(dash.success) setData(dash.data);
      if(users.success) {
        const pending = users.data.filter(u => !u.is_verified && u.role !== 'admin').length;
        setData(prev => ({...prev, pendingVerification: pending}));
      }
    }).finally(()=>setLoading(false));
  }, []);

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };

  if (loading) return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <Skeleton width="300px" height="32px" style={{ marginBottom: '10px' }} />
        <Skeleton width="450px" height="18px" style={{ marginBottom: '28px' }} />
        <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'20px', marginBottom:'32px'}}>
          {[1,2,3,4,5].map(i => <Skeleton key={i} height="100px" borderRadius="20px" />)}
        </div>
        <Skeleton height="300px" borderRadius="24px" />
      </div>
    </div>
  );

  const users    = data?.users || {};
  const courses  = data?.courses || {};
  const stats    = data?.stats || {};

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px'}}>Admin Dashboard</h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Welcome back, {user.name}! Here's your platform overview.</p>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'20px', marginBottom:'32px'}}
        >
          {[
            {icon:<FiUsers/>, val:users.students||0, lbl:'Total Students', border:'4px solid #2563eb', bg:'#dbeafe', color:'#2563eb', path:'/admin/users'},
            {icon:<FiUsers/>, val:users.faculty||0, lbl:'Total Faculty', border:'4px solid #7c3aed', bg:'#ede9fe', color:'#7c3aed', path:'/admin/users'},
            {icon:<FiBookOpen/>, val:courses.active||0, lbl:'Active Courses', border:'4px solid #059669', bg:'#d1fae5', color:'#059669', path:'/admin/courses'},
            {icon:<FiClipboard/>, val:stats.pending_submissions||0, lbl:'Pending Grading', border:'4px solid #f59e0b', bg:'#fef3c7', color:'#f59e0b'},
            {icon:<FiUsers/>, val:data?.pendingVerification||0, lbl:'Pending Verification', border:'4px solid #ef4444', bg:'#fee2e2', color:'#ef4444', path:'/admin/verify'},
          ].map((s,i) => (
            <motion.div 
              key={i} 
              onClick={() => s.path && navigate(s.path)}
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
              style={{background:colors.card, padding:'20px', borderRadius:'20px', border:`1px solid ${colors.border}`, borderLeft:s.border, display:'flex', alignItems:'center', gap:'16px', boxShadow:'var(--card-shadow)', cursor: s.path ? 'pointer' : 'default'}}
            >
              <div style={{width:'52px', height:'52px', borderRadius:'16px', background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>{s.icon}</div>
              <div><div style={{fontSize:'26px', fontWeight:'700', color:colors.text}}>{s.val}</div><div style={{fontSize:'14px', color:colors.light}}>{s.lbl}</div></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <div style={{background:colors.card, borderRadius:'24px', padding:'28px', border:`1px solid ${colors.border}`, marginBottom:'24px'}}>
          <h2 style={{fontSize:'18px', fontWeight:'600', color:colors.text, marginBottom:'20px'}}>Quick Actions</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px'}}>
            {[
              {icon:<FiUpload size={20}/>, label:'Import Students / Faculty', sub:'Upload CSV files', action:'/admin/import', color:'#2563eb', bg:'#dbeafe'},
              {icon:<FiUserPlus size={20}/>, label:'Manage Users', sub:'Add, edit or deactivate users', action:'/admin/users', color:'#7c3aed', bg:'#ede9fe'},
              {icon:<FiBookOpen size={20}/>, label:'Manage Courses', sub:'Create and assign courses', action:'/admin/courses', color:'#059669', bg:'#d1fae5'},
              {icon:<FiClipboard size={20}/>, label:'Announcements', sub:'Post system-wide notices', action:'/admin/announcements', color:'#f59e0b', bg:'#fef3c7'},
              {icon:<FiBarChart2 size={20}/>, label:'Platform Statistics', sub:'View usage and analytics', action:'/admin/stats', color:'#0ea5e9', bg:'#e0f2fe'},
            ].map((a,i) => (
              <div key={i} onClick={()=>navigate(a.action)}
                style={{padding:'20px', borderRadius:'18px', border:`1px solid ${colors.border}`, cursor:'pointer', transition:'all 0.2s', background:colors.lightBg, display:'flex', alignItems:'center', gap:'16px'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
                <div style={{width:'48px', height:'48px', borderRadius:'14px', background:a.bg, color:a.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>{a.icon}</div>
                <div>
                  <div style={{fontSize:'15px', fontWeight:'600', color:colors.text}}>{a.label}</div>
                  <div style={{fontSize:'13px', color:colors.light}}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
