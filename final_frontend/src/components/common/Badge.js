import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  rounded = true,
  icon,
  onClick 
}) => {
  const variants = {
    default: { background: '#f1f5f9', color: '#1e293b' },
    primary: { background: '#dbeafe', color: '#2563eb' },
    success: { background: '#d1fae5', color: '#065f46' },
    warning: { background: '#fef3c7', color: '#92400e' },
    error: { background: '#fee2e2', color: '#991b1b' },
    info: { background: '#e0f2fe', color: '#0369a1' }
  };

  const sizes = {
    sm: { padding: '2px 8px', fontSize: '10px' },
    md: { padding: '4px 12px', fontSize: '12px' },
    lg: { padding: '6px 16px', fontSize: '14px' }
  };

  const styles = {
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      ...variants[variant] || variants.default,
      ...sizes[size] || sizes.md,
      borderRadius: rounded ? '30px' : '6px',
      fontWeight: '600',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'opacity 0.2s',
      whiteSpace: 'nowrap'
    }
  };

  return (
    <span 
      style={styles.badge}
      onClick={onClick}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.opacity = '1')}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;