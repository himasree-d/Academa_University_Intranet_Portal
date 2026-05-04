import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAward, FiBell, FiUser, FiLogOut, FiSettings, FiBookOpen, FiCalendar, FiMessageSquare, FiHome, FiClipboard, FiBarChart2, FiMenu, FiX } from 'react-icons/fi';
import { getInitials } from '../../utils/helpers';
import ThemeToggle from '../common/ThemeToggle';
import useOutsideClick from '../../hooks/useOutsideClick';

const Header = ({ userRole = 'student', userName = 'Arjun', toggleSidebar, isSidebarOpen }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const userMenuRef = useOutsideClick(() => setShowDropdown(false));
  const notificationsRef = useOutsideClick(() => setShowNotifications(false));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.clear();
    navigate('/login');
  };

  const colors = {
    primary: 'var(--accent-primary)',
    secondary: 'var(--accent-hover)',
    softBlue: 'var(--accent-light)',
    background: 'var(--bg-tertiary)',
    text: 'var(--text-primary)',
    textLight: 'var(--text-secondary)',
    border: 'var(--border-color)',
    lightBg: 'var(--bg-tertiary)'
  };

  const styles = {
    header: {
      background: 'var(--bg-secondary)',
      boxShadow: 'var(--card-shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '0 30px',
      borderBottom: `1px solid ${colors.border}`
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: colors.textLight,
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      padding: '8px 12px',
      borderRadius: '8px',
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    activeNavItem: {
      background: 'var(--accent-light)',
      color: 'var(--accent-primary)',
      fontWeight: '700'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    iconButton: {
      position: 'relative',
      background: colors.lightBg,
      border: `1px solid ${colors.border}`,
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: colors.textLight,
      fontSize: '18px',
      transition: 'all 0.2s'
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: colors.primary,
      color: 'white',
      fontSize: '10px',
      padding: '3px 6px',
      borderRadius: '10px',
      fontWeight: '600'
    },
    userMenu: {
      position: 'relative'
    },
    userButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: colors.lightBg,
      border: `1px solid ${colors.border}`,
      padding: '8px 15px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      background: colors.primary,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px'
    },
    userName: {
      color: colors.text,
      fontWeight: '500',
      fontSize: '14px'
    },
    dropdown: {
      position: 'absolute',
      top: '50px',
      right: 0,
      background: 'var(--bg-secondary)',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      width: '200px',
      overflow: 'hidden',
      zIndex: 1000,
      border: `1px solid ${colors.border}`
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      color: colors.text,
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'all 0.2s',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left'
    },
    dropdownDivider: {
      height: '1px',
      background: colors.border,
      margin: '5px 0'
    },
    notificationsDropdown: {
      position: 'absolute',
      top: '50px',
      right: '50px',
      background: 'var(--bg-secondary)',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      width: '300px',
      zIndex: 1000,
      border: `1px solid ${colors.border}`
    },
    notificationHeader: {
      padding: '15px',
      borderBottom: `1px solid ${colors.border}`,
      fontWeight: '600',
      color: colors.text
    },
    notificationItem: {
      padding: '12px 15px',
      borderBottom: `1px solid ${colors.border}`,
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    notificationTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: colors.text,
      marginBottom: '4px'
    },
    notificationTime: {
      fontSize: '12px',
      color: colors.textLight
    }
  };

  const getImportantLinks = () => {
    if (userRole === 'student') return [
      { path: '/student/dashboard', label: 'Dashboard', icon: <FiHome size={16} /> },
      { path: '/student/my-courses', label: 'Courses', icon: <FiBookOpen size={16} /> },
      { path: '/student/timetable', label: 'Timetable', icon: <FiCalendar size={16} /> },
      { path: '/student/chat', label: 'Messages', icon: <FiMessageSquare size={16} /> },
    ];
    if (userRole === 'faculty') return [
      { path: '/faculty/dashboard', label: 'Dashboard', icon: <FiHome size={16} /> },
      { path: '/faculty/courses', label: 'Courses', icon: <FiBookOpen size={16} /> },
      { path: '/faculty/timetable', label: 'Timetable', icon: <FiCalendar size={16} /> },
      { path: '/faculty/chat', label: 'Messages', icon: <FiMessageSquare size={16} /> },
    ];
    return [
      { path: '/admin/dashboard', label: 'Dashboard', icon: <FiHome size={16} /> },
      { path: '/admin/users', label: 'Users', icon: <FiUser size={16} /> },
      { path: '/admin/courses', label: 'Courses', icon: <FiBookOpen size={16} /> },
    ];
  };

  const currentPath = window.location.pathname;
  const importantLinks = getImportantLinks();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Left Section - Toggle + Logo + Important Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Show Hamburger in Header only if sidebar is CLOSED */}
          {!isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              style={{ ...styles.iconButton, background: 'transparent', border: 'none', color: colors.text }}
            >
              <FiMenu size={24} />
            </button>
          )}

          {/* Always show Brand on Header */}
          <Link to={`/${userRole}/dashboard`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <FiAward style={{ fontSize: '24px', color: colors.primary }} />
            <span style={{ fontSize: '20px', fontWeight: '700', color: colors.text }}>
              Acad<span style={{ color: colors.primary }}>ema</span>
            </span>
          </Link>

          <div style={{ ...styles.navLinks, marginLeft: isSidebarOpen ? '0' : '10px' }}>
            {importantLinks.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                style={{
                  ...styles.navItem,
                  ...(currentPath === item.path ? styles.activeNavItem : {})
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div style={styles.rightSection}>
          <ThemeToggle />
          
          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notificationsRef}>
            <button 
              style={styles.iconButton}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FiBell />
              <span style={styles.badge}>3</span>
            </button>

            {showNotifications && (
              <div style={styles.notificationsDropdown}>
                <div style={{ ...styles.notificationHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Notifications</span>
                  <span style={{ fontSize: '11px', color: colors.primary, cursor: 'pointer' }}>Mark all as read</span>
                </div>
                <div style={styles.notificationItem}>
                  <div style={styles.notificationTitle}>New assignment posted in SE</div>
                  <div style={styles.notificationTime}>5 min ago</div>
                </div>
                <div style={styles.notificationItem}>
                  <div style={styles.notificationTitle}>Grade available for DNN</div>
                  <div style={styles.notificationTime}>1 hour ago</div>
                </div>
                <div style={styles.notificationItem}>
                  <div style={styles.notificationTitle}>System maintenance tonight</div>
                  <div style={styles.notificationTime}>2 hours ago</div>
                </div>
                <div style={{ padding: '12px', textAlign: 'center', borderTop: `1px solid ${colors.border}` }}>
                  <Link 
                    to={`/${userRole}/notifications`}
                    onClick={() => setShowNotifications(false)}
                    style={{ background: 'none', border: 'none', color: colors.primary, fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div style={styles.userMenu} ref={userMenuRef}>
            <button 
              style={styles.userButton}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div style={styles.userAvatar}>
                {getInitials(userName)}
              </div>
              <span style={styles.userName}>{userName}</span>
            </button>

            {showDropdown && (
              <div style={styles.dropdown}>
                <Link 
                  to={`/${userRole}/profile`}
                  style={styles.dropdownItem}
                  onClick={() => setShowDropdown(false)}
                >
                  <FiUser /> Profile
                </Link>
                <Link 
                  to={`/${userRole}/settings`}
                  style={styles.dropdownItem}
                  onClick={() => setShowDropdown(false)}
                >
                  <FiSettings /> Settings
                </Link>
                <div style={styles.dropdownDivider}></div>
                <button 
                  style={{...styles.dropdownItem, color: colors.primary}}
                  onClick={handleLogout}
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;