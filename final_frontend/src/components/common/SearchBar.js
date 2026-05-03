import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ 
  value, 
  onChange, 
  onClear,
  placeholder = 'Search...',
  width = '300px'
}) => {
  const colors = {
    primary: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc'
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'white',
      padding: '8px 16px',
      borderRadius: '30px',
      border: `1px solid ${colors.border}`,
      width,
      transition: 'all 0.2s'
    },
    icon: {
      color: colors.textLight,
      fontSize: '16px'
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      background: 'transparent',
      color: colors.text
    },
    clearButton: {
      background: 'none',
      border: 'none',
      color: colors.textLight,
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '50%',
      transition: 'all 0.2s'
    }
  };

  return (
    <div 
      style={styles.container}
      onFocus={(e) => e.currentTarget.style.borderColor = colors.primary}
      onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
    >
      <FiSearch style={styles.icon} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={styles.input}
      />
      {value && (
        <button 
          style={styles.clearButton}
          onClick={onClear}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.lightBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <FiX size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;