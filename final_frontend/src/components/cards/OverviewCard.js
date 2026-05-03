import React from 'react';

const OverviewCard = ({ icon, title, value, color, bgColor, trend, onClick }) => {
  const styles = {
    card: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease'
    },
    iconWrapper: {
      width: '52px',
      height: '52px',
      borderRadius: '16px',
      background: bgColor || 'var(--primary-50)',
      color: color || 'var(--primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    info: {
      flex: 1
    },
    value: {
      fontSize: '26px',
      fontWeight: '700',
      color: 'var(--text-primary)',
      marginBottom: '4px',
      lineHeight: 1.2
    },
    title: {
      color: 'var(--text-secondary)',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: trend ? '4px' : 0
    },
    trend: {
      fontSize: '12px',
      color: trend > 0 ? 'var(--success)' : 'var(--error)',
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
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        }
      }}
    >
      <div style={styles.iconWrapper}>
        {icon}
      </div>
      <div style={styles.info}>
        <div style={styles.value}>{value}</div>
        <div style={styles.title}>{title}</div>
        {trend !== undefined && (
          <div style={styles.trend}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;