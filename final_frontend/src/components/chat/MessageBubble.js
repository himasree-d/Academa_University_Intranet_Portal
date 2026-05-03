import React from 'react';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';
import { formatTime } from '../../utils/helpers';

const MessageBubble = ({ message }) => {
  const isMe = message.isMe;

  const colors = {
    primary: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    messageMe: '#2563eb',
    messageOther: '#f1f5f9'
  };

  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
      marginBottom: '4px'
    },
    bubble: {
      maxWidth: '60%',
      padding: '10px 14px',
      borderRadius: '18px',
      position: 'relative',
      wordWrap: 'break-word',
      background: isMe ? colors.messageMe : colors.messageOther,
      color: isMe ? 'white' : colors.text,
      borderBottomRightRadius: isMe ? '4px' : '18px',
      borderBottomLeftRadius: isMe ? '18px' : '4px'
    },
    content: {
      fontSize: '14px',
      lineHeight: '1.5',
      marginBottom: '4px'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '4px',
      fontSize: '11px',
      color: isMe ? 'rgba(255,255,255,0.7)' : colors.textLight
    },
    status: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px'
    },
    importantTag: {
      background: '#f59e0b',
      color: 'white',
      fontSize: '10px',
      padding: '2px 8px',
      borderRadius: '12px',
      marginBottom: '6px',
      display: 'inline-block'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble}>
        {message.isImportant && (
          <div style={styles.importantTag}>Important</div>
        )}
        <div style={styles.content}>{message.content}</div>
        <div style={styles.footer}>
          <span>{formatTime(message.timestamp)}</span>
          {isMe && (
            <span style={styles.status}>
              {message.status === 'read' ? (
                <span style={{ display: 'flex', gap: '-4px' }}>
                  <FiCheck size={12} />
                  <FiCheck size={12} style={{ marginLeft: '-6px' }} />
                </span>
              ) : (
                <FiCheck size={12} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;