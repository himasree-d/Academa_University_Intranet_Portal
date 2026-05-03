import React from 'react';

const Card = ({ 
  children, 
  padding = 'md',
  shadow = 'sm',
  border = true,
  hoverable = false,
  onClick
}) => {
  const paddings = {
    none: { padding: 0 },
    sm: { padding: '16px' },
    md: { padding: '20px' },
    lg: { padding: '24px' },
    xl: { padding: '32px' }
  };

  const shadows = {
    none: { boxShadow: 'none' },
    sm: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    md: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    lg: { boxShadow: '0 12px 20px -8px rgba(0,0,0,0.15)' }
  };

  const styles = {
    card: {
      background: '#ffffff',
      borderRadius: '20px',
      border: border ? '1px solid #e2e8f0' : 'none',
      ...paddings[padding] || paddings.md,
      ...shadows[shadow] || shadows.sm,
      transition: hoverable ? 'all 0.2s ease' : 'none',
      cursor: onClick ? 'pointer' : 'default'
    }
  };

  return (
    <div 
      style={styles.card}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = shadows.lg.boxShadow;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = shadows[shadow].boxShadow;
        }
      }}
    >
      {children}
    </div>
  );
};

export default Card;