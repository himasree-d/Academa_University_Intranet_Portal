import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  icon,
  disabled = false,
  loading = false,
  onClick,
  type = 'button'
}) => {
  const variants = {
    primary: {
      background: '#2563eb',
      color: 'white',
      border: 'none',
      hover: '#3b82f6'
    },
    secondary: {
      background: '#f1f5f9',
      color: '#1e293b',
      border: '1px solid #e2e8f0',
      hover: '#e2e8f0'
    },
    outline: {
      background: 'transparent',
      color: '#2563eb',
      border: '1px solid #2563eb',
      hover: '#dbeafe'
    },
    danger: {
      background: '#ef4444',
      color: 'white',
      border: 'none',
      hover: '#dc2626'
    },
    ghost: {
      background: 'transparent',
      color: '#1e293b',
      border: 'none',
      hover: '#f1f5f9'
    }
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '12px', gap: '4px' },
    md: { padding: '8px 16px', fontSize: '14px', gap: '6px' },
    lg: { padding: '12px 24px', fontSize: '16px', gap: '8px' }
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  const styles = {
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sizeStyle.gap,
      width: fullWidth ? '100%' : 'auto',
      ...sizeStyle,
      ...variantStyle,
      borderRadius: '10px',
      fontWeight: '500',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
      transition: 'all 0.2s',
      outline: 'none'
    }
  };

  return (
    <button
      type={type}
      style={styles.button}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = variantStyle.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = variantStyle.background;
        }
      }}
    >
      {loading && <span>Loading...</span>}
      {!loading && icon && <span>{icon}</span>}
      {!loading && children}
    </button>
  );
};

export default Button;