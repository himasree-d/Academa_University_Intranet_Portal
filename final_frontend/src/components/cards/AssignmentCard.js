import React from 'react';
import { FiClock, FiCalendar, FiClipboard, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const AssignmentCard = ({ assignment, onClick }) => {
  const colors = {
    primary: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending':
        return { background: '#fef3c7', color: '#92400e', icon: <FiClock size={12} /> };
      case 'submitted':
        return { background: '#dbeafe', color: '#1e40af', icon: <FiCheckCircle size={12} /> };
      case 'graded':
        return { background: '#d1fae5', color: '#065f46', icon: <FiCheckCircle size={12} /> };
      default:
        return { background: colors.lightBg, color: colors.textLight, icon: <FiAlertCircle size={12} /> };
    }
  };

  const styles = {
    card: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${colors.border}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '12px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    },
    title: {
      fontSize: '15px',
      fontWeight: '600',
      color: colors.text
    },
    status: {
      padding: '4px 10px',
      borderRadius: '30px',
      fontSize: '11px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    course: {
      fontSize: '13px',
      color: colors.textLight,
      marginBottom: '12px'
    },
    details: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px',
      color: colors.textLight,
      paddingTop: '12px',
      borderTop: `1px solid ${colors.border}`
    },
    dueDate: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    marks: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    grade: {
      fontWeight: '600',
      color: assignment.grade ? colors.success : colors.textLight
    }
  };

  const statusStyle = getStatusStyle(assignment.status);

  return (
    <div 
      style={styles.card}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
      }}
    >
      <div style={styles.header}>
        <span style={styles.title}>{assignment.title}</span>
        <span style={{...styles.status, ...statusStyle}}>
          {statusStyle.icon}
          {assignment.status === 'graded' ? `Graded (${assignment.grade})` : assignment.status}
        </span>
      </div>
      
      <div style={styles.course}>{assignment.course}</div>

      <div style={styles.details}>
        <span style={styles.dueDate}>
          <FiCalendar size={12} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
        </span>
        <span style={styles.marks}>
          <FiClipboard size={12} /> {assignment.totalMarks} marks
        </span>
      </div>
    </div>
  );
};

export default AssignmentCard;