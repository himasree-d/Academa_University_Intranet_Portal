import React, { useState } from 'react';
import { FiBell, FiCheckCircle, FiInfo, FiAlertCircle, FiClock, FiTrash2, FiFilter, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'assignment', title: 'New Assignment: Deep Neural Networks', desc: 'Prof. Sharma posted a new assignment: "Backpropagation Implementation".', time: '10 mins ago', read: false, priority: 'high' },
    { id: 2, type: 'grade', title: 'Grade Released: Web Technologies', desc: 'Your grade for "React Workshop" is now available. Click to view.', time: '2 hours ago', read: false, priority: 'medium' },
    { id: 3, type: 'system', title: 'Maintenance Alert', desc: 'The student portal will be down for maintenance from 2 AM to 4 AM tonight.', time: '5 hours ago', read: true, priority: 'low' },
    { id: 4, type: 'announcement', title: 'Holiday Notice', desc: 'The university will remain closed on Friday for the regional festival.', time: 'Yesterday', read: true, priority: 'medium' },
    { id: 5, type: 'assignment', title: 'Deadline Approaching', desc: 'Assignment "Software Engineering - Project Phase 1" is due in 24 hours.', time: 'Yesterday', read: false, priority: 'high' },
    { id: 6, type: 'attendance', title: 'Attendance Update', desc: 'Your attendance for "Programming Workshop" has been updated to 92%.', time: '2 days ago', read: true, priority: 'low' },
  ]);

  const colors = {
    primary: 'var(--accent-primary)',
    bg: 'var(--bg-primary)',
    card: 'var(--bg-secondary)',
    text: 'var(--text-primary)',
    light: 'var(--text-secondary)',
    border: 'var(--border-color)',
    lightBg: 'var(--bg-tertiary)'
  };

  const getIcon = (type) => {
    switch (type) {
      case 'assignment': return <FiClock color="#3b82f6" />;
      case 'grade': return <FiCheckCircle color="#10b981" />;
      case 'system': return <FiAlertCircle color="#ef4444" />;
      default: return <FiInfo color="#6366f1" />;
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: 'calc(100vh - 140px)', padding: '40px 20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.text, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiBell style={{ color: colors.primary }} /> Notifications
            </h1>
            <p style={{ color: colors.light, marginTop: '4px' }}>Stay updated with your academic activities at Mahindra University</p>
          </div>
          <button 
            onClick={markAllRead}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', background: 'transparent', border: `1px solid ${colors.primary}`, color: colors.primary, cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = colors.primary; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.primary; }}
          >
            <FiCheck size={18} /> Mark all as read
          </button>
        </div>

        <div style={{ background: colors.card, borderRadius: '24px', boxShadow: 'var(--card-shadow)', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          {/* Tabs/Filters */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}`, background: colors.lightBg }}>
            <button 
              onClick={() => setFilter('all')}
              style={{ flex: 1, padding: '15px', border: 'none', background: filter === 'all' ? colors.card : 'transparent', color: filter === 'all' ? colors.primary : colors.light, fontWeight: '600', cursor: 'pointer', borderBottom: filter === 'all' ? `2px solid ${colors.primary}` : 'none' }}
            >
              All Notifications
            </button>
            <button 
              onClick={() => setFilter('unread')}
              style={{ flex: 1, padding: '15px', border: 'none', background: filter === 'unread' ? colors.card : 'transparent', color: filter === 'unread' ? colors.primary : colors.light, fontWeight: '600', cursor: 'pointer', borderBottom: filter === 'unread' ? `2px solid ${colors.primary}` : 'none' }}
            >
              Unread ({notifications.filter(n => !n.read).length})
            </button>
          </div>

          {/* List */}
          <div style={{ minHeight: '400px' }}>
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <div style={{ padding: '80px 20px', textAlign: 'center', color: colors.light }}>
                  <FiBell size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>You're all caught up!</p>
                  <p style={{ fontSize: '13px' }}>No new notifications to show.</p>
                </div>
              ) : (
                filteredNotifications.map((n, i) => (
                  <motion.div 
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ 
                      display: 'flex', gap: '15px', padding: '20px', 
                      borderBottom: `1px solid ${colors.border}`,
                      background: n.read ? 'transparent' : 'var(--accent-light)',
                      position: 'relative'
                    }}
                  >
                    {!n.read && <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '4px', background: colors.primary }} />}
                    
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: colors.card, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                      {getIcon(n.type)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>{n.title}</h3>
                        <span style={{ fontSize: '12px', color: colors.light }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: colors.light, lineHeight: '1.5', marginBottom: '8px' }}>{n.desc}</p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ padding: '4px 12px', borderRadius: '6px', background: 'transparent', border: `1px solid ${colors.border}`, fontSize: '12px', color: colors.light, cursor: 'pointer' }}>View Details</button>
                        <button 
                          onClick={() => deleteNotification(n.id)}
                          style={{ padding: '4px', background: 'transparent', border: 'none', color: colors.light, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
