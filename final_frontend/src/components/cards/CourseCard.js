import React from 'react';
import { FiUsers, FiClipboard, FiClock } from 'react-icons/fi';

const CourseCard = ({ course, onClick }) => {
  const colors = {
    primary: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc'
  };

  const styles = {
    card: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${colors.border}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '12px'
    },
    code: {
      background: colors.primary + '15',
      color: colors.primary,
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },
    credits: {
      color: colors.textLight,
      fontSize: '12px'
    },
    name: {
      fontSize: '16px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '6px',
      lineHeight: 1.4
    },
    instructor: {
      fontSize: '13px',
      color: colors.textLight,
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    progress: {
      marginBottom: '16px'
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: colors.textLight,
      marginBottom: '6px'
    },
    progressBar: {
      height: '6px',
      background: colors.border,
      borderRadius: '12px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: colors.primary,
      borderRadius: '12px',
      transition: 'width 0.3s'
    },
    meta: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: colors.textLight,
      paddingTop: '12px',
      borderTop: `1px solid ${colors.border}`
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  };

  return (
    <div 
      style={styles.card}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(37,99,235,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
      }}
    >
      <div style={styles.header}>
        <span style={styles.code}>{course.code}</span>
        <span style={styles.credits}>{course.credits} credits</span>
      </div>
      
      <h3 style={styles.name}>{course.name}</h3>
      
      <div style={styles.instructor}>
        <FiUser size={12} /> {course.instructor}
      </div>

      <div style={styles.progress}>
        <div style={styles.progressHeader}>
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${course.progress}%`}} />
        </div>
      </div>

      <div style={styles.meta}>
        <span style={styles.metaItem}>
          <FiClipboard size={12} /> {course.assignments} Assignments
        </span>
        <span style={styles.metaItem}>
          <FiClock size={12} /> Next: {course.nextClass}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;