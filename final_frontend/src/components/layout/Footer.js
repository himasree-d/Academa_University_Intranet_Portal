import React from 'react';
import { FiMail, FiAward } from 'react-icons/fi';

const Footer = () => {
  const colors = {
    primary: 'var(--accent-primary)',
    text: 'var(--text-primary)',
    textLight: 'var(--text-secondary)',
    border: 'var(--border-color)',
    bg: 'var(--bg-secondary)'
  };

  const styles = {
    footer: {
      background: 'var(--bg-primary)',
      padding: '20px 30px',
      borderTop: `1px solid ${colors.border}`,
      marginTop: 'auto'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none'
    },
    logoIcon: {
      fontSize: '24px',
      color: colors.primary,
    },
    logoText: {
      fontSize: '20px',
      fontWeight: '700',
      color: colors.text,
      letterSpacing: '-0.5px'
    },
    contact: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: colors.textLight,
      fontSize: '14px',
      textDecoration: 'none',
      transition: 'color 0.2s',
      cursor: 'pointer'
    },
    copyright: {
      color: colors.textLight,
      fontSize: '13px',
      opacity: 0.8
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <FiAward style={styles.logoIcon} />
          <span style={styles.logoText}>Academa</span>
        </div>
        
        <a href="mailto:support@academa.edu" style={styles.contact}
           onMouseEnter={e => e.currentTarget.style.color = colors.primary}
           onMouseLeave={e => e.currentTarget.style.color = colors.textLight}>
          <FiMail /> Contact Support
        </a>

        <div style={styles.copyright}>
          © 2026 Academa. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;