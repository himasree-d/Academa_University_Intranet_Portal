import React from 'react';
import { FiFileText, FiDownload, FiCalendar, FiUser } from 'react-icons/fi';
import { formatFileSize, getFileIcon } from '../../utils/helpers';

const DocumentCard = ({ document, onDownload, viewMode = 'grid' }) => {
  const colors = {
    primary: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc'
  };

  const getIconColor = (type) => {
    const colors = {
      pdf: '#ef4444',
      word: '#2563eb',
      excel: '#10b981',
      powerpoint: '#f59e0b',
      image: '#8b5cf6',
      archive: '#6b7280',
      code: '#3b82f6',
      database: '#6366f1'
    };
    return colors[type] || colors.code;
  };

  const styles = {
    gridCard: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${colors.border}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    listCard: {
      display: 'grid',
      gridTemplateColumns: '3fr 1.5fr 1.5fr 1fr 1fr',
      padding: '12px 16px',
      borderBottom: `1px solid ${colors.border}`,
      alignItems: 'center',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '12px'
    },
    iconWrapper: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: colors.lightBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: getIconColor(document.type)
    },
    title: {
      fontSize: '15px',
      fontWeight: '500',
      color: colors.text,
      marginBottom: '8px',
      lineHeight: 1.4
    },
    meta: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      fontSize: '12px',
      color: colors.textLight,
      marginBottom: '12px'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '12px',
      borderTop: `1px solid ${colors.border}`
    },
    uploader: {
      fontSize: '12px',
      color: colors.textLight
    },
    downloadBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      background: colors.lightBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      fontSize: '12px',
      color: colors.primary,
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    listTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    listIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: colors.lightBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: getIconColor(document.type)
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        style={styles.listCard}
        onMouseEnter={(e) => e.currentTarget.style.background = colors.lightBg}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        onClick={() => onDownload && onDownload(document)}
      >
        <div style={styles.listTitle}>
          <div style={styles.listIcon}>
            <FiFileText />
          </div>
          <span>{document.title}</span>
        </div>
        <div>{document.courseCode}</div>
        <div>{document.size}</div>
        <div>{new Date(document.date).toLocaleDateString()}</div>
        <div>
          <button style={styles.downloadBtn}>
            <FiDownload size={12} /> Download
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={styles.gridCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
      }}
      onClick={() => onDownload && onDownload(document)}
    >
      <div style={styles.header}>
        <div style={styles.iconWrapper}>
          <FiFileText />
        </div>
        <span style={{ fontSize: '11px', color: colors.textLight }}>{document.type.toUpperCase()}</span>
      </div>

      <h3 style={styles.title}>{document.title}</h3>

      <div style={styles.meta}>
        <span style={styles.metaItem}>
          <FiFileText size={12} /> {document.size}
        </span>
        <span style={styles.metaItem}>
          <FiCalendar size={12} /> {new Date(document.date).toLocaleDateString()}
        </span>
      </div>

      <div style={styles.footer}>
        <span style={styles.uploader}>{document.uploadedBy}</span>
        <button 
          style={styles.downloadBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDownload && onDownload(document);
          }}
        >
          <FiDownload size={12} /> Download
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;