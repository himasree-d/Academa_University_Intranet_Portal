import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  name,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const colors = {
    primary: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc',
    error: '#ef4444',
    success: '#10b981'
  };

  const styles = {
    container: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '13px',
      fontWeight: '500',
      color: error ? colors.error : colors.text
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    input: {
      width: '100%',
      padding: icon ? '10px 40px' : '10px 12px',
      paddingRight: type === 'password' ? '40px' : '12px',
      border: `1px solid ${
        error ? colors.error : 
        success ? colors.success : 
        focused ? colors.primary : colors.border
      }`,
      borderRadius: '10px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s',
      background: disabled ? colors.lightBg : 'white',
      color: colors.text
    },
    icon: {
      position: 'absolute',
      left: '12px',
      color: colors.textLight,
      fontSize: '16px'
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      background: 'none',
      border: 'none',
      color: colors.textLight,
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center'
    },
    message: {
      marginTop: '4px',
      fontSize: '11px',
      color: error ? colors.error : success ? colors.success : colors.textLight
    }
  };

  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}{required && ' *'}</label>}
      <div style={styles.inputWrapper}>
        {icon && <span style={styles.icon}>{icon}</span>}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          name={name}
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            style={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
      {(error || success) && (
        <div style={styles.message}>
          {error || success}
        </div>
      )}
    </div>
  );
};

export default Input;