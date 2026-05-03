import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiBookOpen, FiClipboard, FiBarChart2, 
  FiMessageSquare, FiBell, FiCalendar, FiUser, FiSettings, FiMenu
} from 'react-icons/fi';

const Sidebar = ({ userRole, isOpen, setIsOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavItems = () => {
    switch(userRole) {
      case 'student':
        return [
          { path: '/student/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
          { path: '/student/my-courses', label: 'My Courses', icon: <FiBookOpen size={20} /> },
          { path: '/student/assignments', label: 'Assignments', icon: <FiClipboard size={20} /> },
          { path: '/student/grades', label: 'Grades', icon: <FiBarChart2 size={20} /> },
          { path: '/student/timetable', label: 'Timetable', icon: <FiCalendar size={20} /> },
          { path: '/student/calendar', label: 'Calendar', icon: <FiCalendar size={20} /> },
          { path: '/student/chat', label: 'Messages', icon: <FiMessageSquare size={20} /> },
          { path: '/student/announcements', label: 'Announcements', icon: <FiBell size={20} /> }
        ];
      case 'faculty':
        return [
          { path: '/faculty/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
          { path: '/faculty/courses', label: 'My Courses', icon: <FiBookOpen size={20} /> },
          { path: '/faculty/create-assignment', label: 'Create', icon: <FiClipboard size={20} /> },
          { path: '/faculty/grade', label: 'Global Grading', icon: <FiBarChart2 size={20} /> },
          { path: '/faculty/timetable', label: 'Timetable', icon: <FiCalendar size={20} /> },
          { path: '/faculty/chat', label: 'Messages', icon: <FiMessageSquare size={20} /> },
          { path: '/faculty/post-announcement', label: 'Announcements', icon: <FiBell size={20} /> }
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
          { path: '/admin/verify-users', label: 'Verify Users', icon: <FiUser size={20} /> },
          { path: '/admin/users', label: 'All Users', icon: <FiUser size={20} /> },
          { path: '/admin/courses', label: 'Courses', icon: <FiBookOpen size={20} /> },
          { path: '/admin/announcements', label: 'System Alerts', icon: <FiBell size={20} /> },
          { path: '/admin/stats', label: 'Platform Stats', icon: <FiBarChart2 size={20} /> },
          { path: '/admin/import', label: 'Data Import', icon: <FiSettings size={20} /> }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const styles = {
    sidebar: {
      width: isOpen ? '260px' : '0',
      minWidth: isOpen ? '260px' : '0',
      background: 'var(--bg-secondary)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      borderRight: isOpen ? '1px solid var(--border-color)' : 'none',
      padding: isOpen ? '24px 16px' : '24px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 1001,
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      marginBottom: '4px',
      opacity: isOpen ? 1 : 0
    },
    activeNavItem: {
      background: 'var(--accent-light)',
      color: 'var(--accent-primary)',
      fontWeight: '700',
      boxShadow: '0 4px 15px -2px rgba(var(--accent-primary-rgb), 0.2)'
    }
  };

  return (
    <aside style={styles.sidebar}>
      <div style={{ marginBottom: '32px', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Toggle Button inside Sidebar */}
        <button 
          onClick={() => setIsOpen(false)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center',
            padding: '4px'
          }}
        >
          <FiMenu size={24} />
        </button>

        <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Acad<span style={{ color: 'var(--accent-primary)' }}>ema</span>
        </span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {navItems.map((item, idx) => {
          const isActive = currentPath === item.path;
          return (
            <Link 
              key={idx} 
              to={item.path} 
              onClick={() => setIsOpen(false)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.activeNavItem : {})
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)', opacity: isOpen ? 1 : 0 }}>
        <Link to={`/${userRole}/settings`} onClick={() => setIsOpen(false)} style={styles.navItem}>
          <FiSettings size={20} /> Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
