import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Dropdown = ({ 
  trigger, 
  children, 
  placement = 'bottom-left',
  width = '200px'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const placements = {
    'bottom-left': { top: '100%', right: 'auto', left: 0 },
    'bottom-right': { top: '100%', left: 'auto', right: 0 },
    'top-left': { bottom: '100%', right: 'auto', left: 0 },
    'top-right': { bottom: '100%', left: 'auto', right: 0 }
  };

  const colors = {
    border: '#e2e8f0',
    lightBg: '#f8fafc',
    text: '#1e293b',
    textLight: '#64748b'
  };

  const styles = {
    dropdown: {
      position: 'relative',
      display: 'inline-block'
    },
    trigger: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    menu: {
      position: 'absolute',
      ...placements[placement],
      width,
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.border}`,
      zIndex: 1000,
      marginTop: placement.includes('bottom') ? '8px' : '-8px',
      overflow: 'hidden',
      display: isOpen ? 'block' : 'none'
    },
    item: {
      padding: '10px 16px',
      fontSize: '14px',
      color: colors.text,
      cursor: 'pointer',
      transition: 'background 0.2s',
      borderBottom: `1px solid ${colors.border}`,
      '&:last-child': {
        borderBottom: 'none'
      }
    }
  };

  return (
    <div style={styles.dropdown} ref={dropdownRef}>
      <div style={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
        <FiChevronDown size={14} />
      </div>
      <div style={styles.menu}>
        {React.Children.map(children, (child) => (
          <div
            style={styles.item}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.lightBg}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            onClick={() => {
              child.props.onClick?.();
              setIsOpen(false);
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;