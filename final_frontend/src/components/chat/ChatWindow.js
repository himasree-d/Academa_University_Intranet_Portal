import React, { useRef, useEffect } from 'react';
import { FiPhone, FiVideo, FiInfo, FiMoreVertical } from 'react-icons/fi';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { getInitials } from '../../utils/helpers';

const ChatWindow = ({ chat, messages, onSendMessage, onTyping }) => {
  const messagesEndRef = useRef(null);

  const colors = {
    primary: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc',
    online: '#10b981',
    offline: '#94a3b8'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const styles = {
    window: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff'
    },
    header: {
      padding: '20px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    chatInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    avatar: {
      width: '44px',
      height: '44px',
      borderRadius: '14px',
      background: colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '16px'
    },
    details: {
      flex: 1
    },
    name: {
      fontSize: '16px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '2px'
    },
    status: {
      fontSize: '13px',
      color: colors.textLight,
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: chat?.online ? colors.online : colors.offline
    },
    actions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: colors.lightBg,
      border: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: colors.textLight,
      transition: 'all 0.2s'
    },
    messagesArea: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      background: colors.lightBg
    },
    dateDivider: {
      textAlign: 'center',
      margin: '16px 0',
      position: 'relative'
    },
    dateText: {
      background: '#ffffff',
      padding: '4px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      color: colors.textLight,
      border: `1px solid ${colors.border}`,
      display: 'inline-block'
    },
    typingIndicator: {
      padding: '12px',
      color: colors.textLight,
      fontSize: '12px',
      fontStyle: 'italic'
    }
  };

  if (!chat) {
    return (
      <div style={styles.window}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textLight }}>
          Select a chat to start messaging
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div style={styles.window}>
      {/* Chat Header */}
      <div style={styles.header}>
        <div style={styles.chatInfo}>
          <div style={styles.avatar}>
            {getInitials(chat.name)}
          </div>
          <div style={styles.details}>
            <div style={styles.name}>{chat.name}</div>
            <div style={styles.status}>
              <span style={styles.statusDot}></span>
              {chat.online ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
        <div style={styles.actions}>
          <button 
            style={styles.actionButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary + '15';
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.lightBg;
              e.currentTarget.style.color = colors.textLight;
            }}
          >
            <FiPhone />
          </button>
          <button 
            style={styles.actionButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary + '15';
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.lightBg;
              e.currentTarget.style.color = colors.textLight;
            }}
          >
            <FiVideo />
          </button>
          <button 
            style={styles.actionButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary + '15';
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.lightBg;
              e.currentTarget.style.color = colors.textLight;
            }}
          >
            <FiInfo />
          </button>
          <button 
            style={styles.actionButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary + '15';
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.lightBg;
              e.currentTarget.style.color = colors.textLight;
            }}
          >
            <FiMoreVertical />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={styles.messagesArea}>
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <React.Fragment key={date}>
            <div style={styles.dateDivider}>
              <span style={styles.dateText}>
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            {msgs.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={onSendMessage} onTyping={onTyping} />
    </div>
  );
};

export default ChatWindow;