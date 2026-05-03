import React, { useState } from 'react';
import { FiUser, FiMail, FiMapPin, FiCalendar, FiBook, FiAward, FiEdit2, FiCamera } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isEditing, setIsEditing] = useState(false);

  const colors = {
    primary: 'var(--accent-primary)',
    bg: 'var(--bg-primary)',
    card: 'var(--bg-secondary)',
    text: 'var(--text-primary)',
    light: 'var(--text-secondary)',
    border: 'var(--border-color)',
    lightBg: 'var(--bg-tertiary)'
  };

  const getInitials = name => name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '??';

  const InfoItem = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '12px', background: colors.lightBg, border: `1px solid ${colors.border}` }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, fontSize: '18px' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '12px', color: colors.light, fontWeight: '500' }}>{label}</div>
        <div style={{ fontSize: '15px', color: colors.text, fontWeight: '600' }}>{value || 'Not provided'}</div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: 'calc(100vh - 140px)', padding: '40px 20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '900px', margin: '0 auto' }}
      >
        <div style={{ background: colors.card, borderRadius: '30px', overflow: 'hidden', boxShadow: 'var(--card-shadow)', border: `1px solid ${colors.border}` }}>
          {/* Cover Header */}
          <div style={{ height: '160px', background: `linear-gradient(135deg, ${colors.primary}, #1e3a8a)`, position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: '-50px', left: '40px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '25px', background: 'var(--bg-secondary)', border: `4px solid var(--bg-secondary)`, boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '700', color: colors.primary }}>
                  {getInitials(user.name)}
                </div>
                <button style={{ position: 'absolute', bottom: '5px', right: '5px', width: '36px', height: '36px', borderRadius: '50%', background: colors.primary, border: '2px solid var(--bg-secondary)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  title="Change Profile Photo"
                >
                  <FiCamera size={18} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ padding: '60px 40px 40px 40px' }}>
            {/* User Name & Role positioned nicely below cover */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '30px', paddingBottom: '20px', borderBottom: `1px solid ${colors.border}` }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: colors.text, marginBottom: '6px' }}>{user.name}</h1>
              <span style={{ background: colors.lightBg, color: colors.primary, padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px' }}>
                {user.role.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.text }}>Profile Information</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <InfoItem icon={<FiUser />} label="Full Name" value={user.name} />
              <InfoItem icon={<FiMail />} label="Email Address" value={user.email} />
              <InfoItem icon={<FiAward />} label="Department" value={user.department} />
              {user.role === 'student' ? (
                <>
                  <InfoItem icon={<FiBook />} label="Enrollment ID" value={user.enrollment_id} />
                  <InfoItem icon={<FiCalendar />} label="Batch / Year" value={user.batch} />
                </>
              ) : (
                <InfoItem icon={<FiBook />} label="Designation" value={user.designation} />
              )}
              <InfoItem icon={<FiMapPin />} label="Campus" value="Main Campus, Mahindra University" />
            </div>

            <div style={{ marginTop: '40px', padding: '20px', borderRadius: '16px', background: 'var(--accent-light)', border: `1px solid ${colors.primary}`, display: 'flex', gap: '15px', alignItems: 'center' }}>
              <FiAward size={24} color={colors.primary} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>Verified Member</div>
                <div style={{ fontSize: '12px', color: colors.light }}>Your account has been verified by the Mahindra University administration.</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
