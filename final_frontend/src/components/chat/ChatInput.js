import React, { useState } from 'react';
import { FiSend, FiPaperclip, FiSmile } from 'react-icons/fi';

const ChatInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');

  const colors = {
    primary: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc'
  };

  const styles = {
    inputArea: {
      padding: '20px',
      borderTop: `1px solid ${colors.border}`,
      background: '#ffffff'
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: colors.lightBg,
      padding: '8px 12px',
      borderRadius: '16px',
      border: `1px solid ${colors.border}`
    },
    actions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      background: 'none',
      border: 'none',
      color: colors.textLight,
      fontSize: '20px',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.2s'
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: '14px',
      color: colors.text,
      padding: '8px 0'
    },
    sendButton: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: colors.primary,
      border: 'none',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.inputArea}>
      <div style={styles.container}>
        <div style={styles.actions}>
          <button style={styles.actionButton}>
            <FiPaperclip />
          </button>
          <button style={styles.actionButton}>
            <FiSmile />
          </button>
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => onTyping && onTyping(true)}
          onBlur={() => onTyping && onTyping(false)}
        />
        <button 
          style={styles.sendButton}
          onClick={handleSend}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primary + 'dd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.primary;
          }}
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;