import React, { useState } from 'react';
import { FiSearch, FiStar } from 'react-icons/fi';
import { getInitials } from '../../utils/helpers';

const ChatSidebar = ({ chats, selectedChat, onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const colors = {
    primary: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc',
    online: '#10b981'
  };

  const styles = {
    sidebar: {
      width: '320px',
      borderRight: `1px solid ${colors.border}`,
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      padding: '20px',
      borderBottom: `1px solid ${colors.border}`
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '16px'
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: colors.lightBg,
      padding: '10px 14px',
      borderRadius: '12px',
      border: `1px solid ${colors.border}`
    },
    searchIcon: {
      color: colors.textLight,
      fontSize: '16px'
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      width: '100%',
      background: 'transparent',
      color: colors.text
    },
    chatsList: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px'
    },
    chatItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginBottom: '4px',
      position: 'relative'
    },
    activeChat: {
      background: colors.lightBg,
      borderLeft: `3px solid ${colors.primary}`
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '16px',
      position: 'relative',
      flexShrink: 0
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: '2px',
      right: '2px',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: colors.online,
      border: '2px solid white'
    },
    chatInfo: {
      flex: 1,
      minWidth: 0
    },
    chatNameRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '4px'
    },
    chatName: {
      fontSize: '15px',
      fontWeight: '600',
      color: colors.text,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    chatTime: {
      fontSize: '11px',
      color: colors.textLight
    },
    chatRole: {
      fontSize: '12px',
      color: colors.textLight,
      marginBottom: '4px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    lastMessage: {
      fontSize: '13px',
      color: colors.textLight,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    unreadBadge: {
      background: colors.primary,
      color: 'white',
      fontSize: '11px',
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '12px',
      minWidth: '20px',
      textAlign: 'center',
      marginLeft: '8px'
    },
    pinnedIcon: {
      color: '#f59e0b',
      fontSize: '12px',
      marginRight: '4px'
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <h2 style={styles.title}>Chats</h2>
        <div style={styles.searchBox}>
          <FiSearch style={styles.searchIcon} />
          <input 
            type="text"
            placeholder="Search chats..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.chatsList}>
        {filteredChats.map(chat => (
          <div 
            key={chat.id}
            style={{
              ...styles.chatItem,
              ...(selectedChat === chat.id ? styles.activeChat : {})
            }}
            onClick={() => onSelectChat(chat.id)}
            onMouseEnter={(e) => {
              if (selectedChat !== chat.id) {
                e.currentTarget.style.background = colors.lightBg;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedChat !== chat.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <div style={styles.avatar}>
              {getInitials(chat.name)}
              {chat.online && <span style={styles.onlineIndicator}></span>}
            </div>
            <div style={styles.chatInfo}>
              <div style={styles.chatNameRow}>
                <span style={styles.chatName}>
                  {chat.pinned && <FiStar style={styles.pinnedIcon} />}
                  {chat.name}
                </span>
                <span style={styles.chatTime}>{chat.time}</span>
              </div>
              <div style={styles.chatRole}>{chat.role}</div>
              <div style={styles.lastMessage}>{chat.lastMessage}</div>
            </div>
            {chat.unread > 0 && (
              <span style={styles.unreadBadge}>{chat.unread}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;