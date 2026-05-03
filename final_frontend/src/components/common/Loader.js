import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 20,
    md: 30,
    lg: 40,
    xl: 50
  };

  const colors = {
    primary: '#2563eb',
    lightBg: '#f8fafc'
  };

  const styles = {
    container: fullScreen ? {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.8)',
      zIndex: 9999
    } : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    loader: {
      width: sizes[size],
      height: sizes[size],
      border: `3px solid ${colors.lightBg}`,
      borderTop: `3px solid ${colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  // Add keyframes to document if not already present
  if (!document.querySelector('#loader-keyframes')) {
    const style = document.createElement('style');
    style.id = 'loader-keyframes';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  return (
    <div style={styles.container}>
      <div style={styles.loader} />
    </div>
  );
};

export default Loader;