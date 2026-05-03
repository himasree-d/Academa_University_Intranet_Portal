import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiLock, FiBell, FiShield, FiMoon, FiUser, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');

  const colors = {
    primary: 'var(--accent-primary)',
    bg: 'var(--bg-primary)',
    card: 'var(--bg-secondary)',
    text: 'var(--text-primary)',
    light: 'var(--text-secondary)',
    border: 'var(--border-color)',
    lightBg: 'var(--bg-tertiary)'
  };

  const SettingRow = ({ icon, title, desc, action }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: colors.lightBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, fontSize: '18px' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>{title}</div>
          <div style={{ fontSize: '12px', color: colors.light }}>{desc}</div>
        </div>
      </div>
      <div>{action}</div>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: 'calc(100vh - 140px)', padding: '40px 20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}
      >
        {/* Sidebar */}
        <div style={{ background: colors.card, borderRadius: '20px', padding: '20px', boxShadow: 'var(--card-shadow)', border: `1px solid ${colors.border}`, height: 'fit-content' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', padding: '0 10px', color: colors.text }}>Settings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              { id: 'account', label: 'Account', icon: <FiSettings /> },
              { id: 'security', label: 'Security', icon: <FiShield /> },
              { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
              { id: 'appearance', label: 'Appearance', icon: <FiMoon /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '12px', border: 'none',
                  background: activeTab === tab.id ? colors.primary : 'transparent',
                  color: activeTab === tab.id ? 'white' : colors.light,
                  cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', textAlign: 'left'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ background: colors.card, borderRadius: '20px', boxShadow: 'var(--card-shadow)', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '25px', borderBottom: `1px solid ${colors.border}` }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.text }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h3>
            <p style={{ fontSize: '13px', color: colors.light }}>Manage your {activeTab} preferences and account details.</p>
          </div>

          <div style={{ padding: '10px 0' }}>
            {activeTab === 'account' && (
              <>
                <SettingRow icon={<FiMail />} title="Email Address" desc="Your registered university email." action={<span style={{ fontSize: '13px', color: colors.light, fontWeight: '500' }}>{JSON.parse(localStorage.getItem('user') || '{}').email}</span>} />
                <SettingRow icon={<FiUser />} title="University" desc="Your affiliated institution." action={<span style={{ fontSize: '13px', color: colors.text, fontWeight: '600' }}>Mahindra University</span>} />
              </>
            )}

            {activeTab === 'security' && (
              <>
                <SettingRow icon={<FiLock />} title="Change Password" desc="Update your password regularly for better security." action={<button onClick={() => navigate('/forgot-password')} style={{ padding: '8px 16px', borderRadius: '8px', background: colors.primary, color: 'white', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Update Password</button>} />
              </>
            )}

            {activeTab === 'appearance' && (
              <>
                <SettingRow icon={<FiMoon />} title="Dark Mode" desc="Switch between light and dark themes." action={<button onClick={toggleTheme} style={{ padding: '8px 16px', borderRadius: '8px', background: isDarkMode ? colors.primary : colors.lightBg, color: isDarkMode ? 'white' : colors.text, border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{isDarkMode ? 'Disable' : 'Enable'}</button>} />
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <SettingRow icon={<FiBell />} title="Email Notifications" desc="Receive updates about assignments and grades via email." action={<input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />} />
              </>
            )}
          </div>

          <div style={{ padding: '25px', background: colors.lightBg, textAlign: 'right' }}>
            <button style={{ padding: '10px 24px', borderRadius: '12px', background: colors.primary, color: 'white', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: 'var(--card-shadow)' }}>Save Changes</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
