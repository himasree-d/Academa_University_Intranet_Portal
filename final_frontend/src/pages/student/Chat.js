import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiSearch, FiSend, FiUser, FiPaperclip, FiUsers, FiX, FiPlus, FiDownload, FiTrash2, FiEye } from 'react-icons/fi';
import PDFModal from '../../components/common/PDFModal';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { initSocket, getSocket, disconnectSocket } from '../../services/socket';

const API = 'http://localhost:5001/api';

const Chat = () => {
  const [people, setPeople]           = useState([]);
  const [conversations, setConvs]     = useState([]);
  const [selectedUser, setSelected]   = useState(null); // Can be a user or a group
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [file, setFile]               = useState(null);
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [dragging, setDragging]       = useState(false);
  const [view, setView]               = useState('conversations'); // 'conversations' | 'people'
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [viewingPDF, setViewingPDF]     = useState(null); // { url, name }
  const [msgToDelete, setMsgToDelete]   = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({}); // { conversationId: userName }
  
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const h     = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchConversations();
    fetchPeople();
    
    const socket = initSocket(token);

    socket.on('current_online_users', (uids) => setOnlineUsers(new Set(uids)));
    
    socket.on('user_status_change', ({ userId, status }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (status === 'online') next.add(userId);
        else next.delete(userId);
        return next;
      });
    });

    socket.on('display_typing', ({ userId, userName, groupId, receiverId, isTyping }) => {
      const convId = groupId ? `group_${groupId}` : `user_${userId}`;
      setTypingUsers(prev => ({
        ...prev,
        [convId]: isTyping ? userName : null
      }));
    });

    socket.on('new_message', (msg) => {
      // If the message belongs to the current conversation, add it
      setMessages(prev => {
        // Check if message is already in list (sent by me)
        if (prev.some(m => m.id === msg.id)) return prev;
        
        // If it's a group message and matches selected group
        if (msg.group_id && selectedUser?.type === 'group' && selectedUser.id === msg.group_id) {
          return [...prev, msg];
        }
        // If it's a direct message between me and selected user
        if (!msg.group_id && selectedUser?.type !== 'group' && 
           (msg.sender_id === selectedUser?.id || msg.receiver_id === selectedUser?.id)) {
          return [...prev, msg];
        }
        return prev;
      });
      
      // Update conversations list to show last message
      fetchConversations();
    });

    socket.on('message_deleted', (msgId) => {
      setMessages(prev => prev.filter(m => m.id !== parseInt(msgId)));
    });

    return () => disconnectSocket();
  }, [selectedUser]); // Re-subscribe when selected user changes to ensure correct filtering logic

  const handleTyping = () => {
    const socket = getSocket();
    if (!socket || !selectedUser) return;

    socket.emit('typing', {
      receiverId: selectedUser.type !== 'group' ? selectedUser.id : null,
      groupId: selectedUser.type === 'group' ? selectedUser.id : null,
      isTyping: true
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        receiverId: selectedUser.type !== 'group' ? selectedUser.id : null,
        groupId: selectedUser.type === 'group' ? selectedUser.id : null,
        isTyping: false
      });
    }, 3000);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversations = async () => {
    const res  = await fetch(`${API}/chat/conversations`, { headers: h });
    const data = await res.json();
    if (data.success) setConvs(data.data);
  };

  const fetchPeople = async () => {
    const res  = await fetch(`${API}/chat/people`, { headers: h });
    const data = await res.json();
    if (data.success) setPeople(data.data);
  };

  const fetchMessages = async (id, isGroup) => {
    const url = isGroup ? `${API}/chat/messages/${id}?type=group` : `${API}/chat/messages/${id}`;
    const res  = await fetch(url, { headers: h });
    const data = await res.json();
    if (data.success) setMessages(data.data);
  };

  const selectUser = async (person) => {
    setSelected(person);
    setMessages([]);
    await fetchMessages(person.id, person.type === 'group');
    fetchConversations();
    
    const socket = getSocket();
    if (socket && person.type === 'group') {
      socket.emit('join_room', `group_${person.id}`);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !file) || !selectedUser || loading) return;
    setLoading(true);
    
    const formData = new FormData();
    if (input.trim()) formData.append('message', input.trim());
    if (file) formData.append('file', file);
    
    if (selectedUser.type === 'group') {
      formData.append('group_id', selectedUser.id);
    } else {
      formData.append('receiver_id', selectedUser.id);
    }

    setInput('');
    setFile(null);

    try {
      const res  = await fetch(`${API}/chat/send`, {
        method:'POST', headers:{ Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        fetchConversations();
      }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const createGroup = async () => {
    if (!newGroupName.trim() || selectedMembers.length === 0) return alert('Enter a name and select members');
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat/groups`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName.trim(), members: selectedMembers })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateGroup(false);
        setNewGroupName('');
        setSelectedMembers([]);
        fetchConversations();
        selectUser({ ...data.data, type: 'group' });
        setView('conversations');
      }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const deleteMessage = async (msgId) => {
    setMsgToDelete(msgId);
  };

  const confirmDelete = async () => {
    if (!msgToDelete) return;
    try {
      const res = await fetch(`${API}/chat/messages/${msgToDelete}`, { method: 'DELETE', headers: h });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => m.id !== msgToDelete));
      }
    } catch(e) { console.error(e); }
    setMsgToDelete(null);
  };

  const handleKeyDown = e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const getInitials = name => name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '??';
  const getRoleColor = role => ({ admin:'#5e7a6d', faculty:'#7ea191', student:'#8a9f94' }[role] || 'var(--text-secondary)');

  const displayList = view === 'conversations'
    ? conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : people.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.department||'').toLowerCase().includes(search.toLowerCase()));

  const colors = { 
    primary: 'var(--accent-primary)', 
    bg: 'var(--bg-primary)', 
    card: 'var(--bg-secondary)', 
    text: 'var(--text-primary)', 
    light: 'var(--text-secondary)', 
    border: 'var(--border-color)', 
    lightBg: 'var(--bg-tertiary)',
    activeBlue: 'var(--accent-light)'
  };

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'24px'}}>
      <div style={{maxWidth:'1400px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <div>
            <h1 style={{fontSize:'26px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
              <FiMessageSquare style={{color:colors.primary}}/> Messages
            </h1>
            <p style={{color:colors.light}}>Chat with faculty, classmates, and groups</p>
          </div>
          <button onClick={() => setShowCreateGroup(true)}
            style={{padding:'10px 20px', background:colors.primary, color:'white', borderRadius:'12px', border:'none', fontSize:'14px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px'}}>
            <FiUsers/> Create Group
          </button>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'320px 1fr', gap:'20px', height:'calc(100vh - 180px)'}}>
          {/* Sidebar */}
          <div style={{background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`, display:'flex', flexDirection:'column', overflow:'hidden'}}>
            {/* Search */}
            <div style={{padding:'16px', borderBottom:`1px solid ${colors.border}`}}>
              <div style={{display:'flex', gap:'8px', marginBottom:'12px'}}>
                <button onClick={()=>setView('conversations')}
                  style={{flex:1, padding:'8px', borderRadius:'10px', border:`1px solid ${view==='conversations'?colors.primary:colors.border}`, background:view==='conversations'?colors.activeBlue:colors.lightBg, color:view==='conversations'?colors.primary:colors.light, fontSize:'13px', fontWeight:'600', cursor:'pointer'}}>
                  Chats
                </button>
                <button onClick={()=>setView('people')}
                  style={{flex:1, padding:'8px', borderRadius:'10px', border:`1px solid ${view==='people'?colors.primary:colors.border}`, background:view==='people'?colors.activeBlue:colors.lightBg, color:view==='people'?colors.primary:colors.light, fontSize:'13px', fontWeight:'600', cursor:'pointer'}}>
                  Directory
                </button>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', background:colors.lightBg, padding:'9px 13px', borderRadius:'10px', border:`1px solid ${colors.border}`}}>
                <FiSearch color={colors.light} size={14}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{border:'none', outline:'none', fontSize:'14px', width:'100%', background:'transparent', color:colors.text}}/>
              </div>
            </div>

            {/* List */}
            <div style={{flex:1, overflowY:'auto', padding:'8px'}}>
              {displayList.length === 0 ? (
                <div style={{textAlign:'center', padding:'40px 20px', color:colors.light}}>
                  <FiUser size={32} style={{opacity:0.3, marginBottom:'8px'}}/>
                  <p style={{fontSize:'13px'}}>{view==='conversations'?'No conversations yet.':'No people found.'}</p>
                </div>
              ) : displayList.map(person => (
                <div key={`${person.type||'direct'}-${person.id}`}
                  onClick={() => selectUser(person)}
                  style={{display:'flex', alignItems:'center', gap:'11px', padding:'11px 12px', borderRadius:'14px', cursor:'pointer', marginBottom:'4px', background:selectedUser?.id===person.id && selectedUser?.type===person.type?colors.activeBlue:'transparent', transition:'all 0.15s'}}
                  onMouseEnter={e=>{ if(selectedUser?.id!==person.id) e.currentTarget.style.background=colors.lightBg; }}
                  onMouseLeave={e=>{ if(selectedUser?.id!==person.id) e.currentTarget.style.background='transparent'; }}>
                  <div style={{position:'relative', flexShrink:0}}>
                    <div style={{width:'42px', height:'42px', borderRadius:'12px', background:person.type==='group'?'#d4a373':getRoleColor(person.role), display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'14px'}}>
                      {person.type==='group' ? <FiUsers size={18}/> : getInitials(person.name)}
                    </div>
                    {person.type !== 'group' && onlineUsers.has(person.id) && (
                      <div style={{position:'absolute', bottom:'-2px', right:'-2px', width:'12px', height:'12px', borderRadius:'50%', background:'#10b981', border:`2px solid ${colors.card}`}} />
                    )}
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:'14px', fontWeight:'600', color:colors.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{person.name}</span>
                      {person.last_message_time && <span style={{fontSize:'11px', color:colors.light, flexShrink:0, marginLeft:'4px'}}>{new Date(person.last_message_time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>}
                    </div>
                    <div style={{fontSize:'12px', color:colors.light, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                      {typingUsers[person.type==='group' ? `group_${person.id}` : `user_${person.id}`] ? (
                        <span style={{color:'#10b981', fontWeight:'500'}}>typing...</span>
                      ) : (
                        person.type==='group' ? 'Group Chat' : (person.designation || person.department || person.role)
                      )}
                    </div>
                  </div>
                  {parseInt(person.unread_count) > 0 && (
                    <span style={{background:colors.primary, color:'white', fontSize:'11px', fontWeight:'700', padding:'2px 7px', borderRadius:'12px', flexShrink:0}}>
                      {person.unread_count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div 
            style={{
              background:colors.card, 
              borderRadius:'20px', 
              border:`1px solid ${dragging ? colors.primary : colors.border}`, 
              display:'flex', 
              flexDirection:'column', 
              overflow:'hidden',
              position: 'relative'
            }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {dragging && (
              <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, background: 'rgba(var(--accent-primary-rgb), 0.1)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none'}}>
                <div style={{padding: '20px 40px', background: colors.card, borderRadius: '20px', border: `2px dashed ${colors.primary}`, color: colors.primary, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <FiPaperclip size={24}/> Drop file to upload
                </div>
              </div>
            )}

            {!selectedUser ? (
              <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:colors.light}}>
                <FiMessageSquare size={64} style={{opacity:0.2, marginBottom:'16px'}}/>
                <p style={{fontSize:'16px', fontWeight:'500'}}>Select a conversation to start messaging</p>
                <p style={{fontSize:'13px', marginTop:'4px'}}>Or click "Directory" to find someone to chat with</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{padding:'16px 20px', borderBottom:`1px solid ${colors.border}`, display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{position:'relative'}}>
                    <div style={{width:'42px', height:'42px', borderRadius:'12px', background:selectedUser.type==='group'?'#d4a373':getRoleColor(selectedUser.role), display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'14px'}}>
                      {selectedUser.type==='group' ? <FiUsers size={18}/> : getInitials(selectedUser.name)}
                    </div>
                    {selectedUser.type !== 'group' && onlineUsers.has(selectedUser.id) && (
                      <div style={{position:'absolute', bottom:'-2px', right:'-2px', width:'12px', height:'12px', borderRadius:'50%', background:'#10b981', border:`2px solid ${colors.card}`}} />
                    )}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'15px', fontWeight:'600', color:colors.text, display:'flex', alignItems:'center', gap:'8px'}}>
                      {selectedUser.name}
                      {selectedUser.type !== 'group' && onlineUsers.has(selectedUser.id) && <span style={{fontSize:'11px', color:'#10b981', fontWeight:'500'}}>• Online</span>}
                    </div>
                    <div style={{fontSize:'12px', color:colors.light}}>
                      {typingUsers[selectedUser.type==='group' ? `group_${selectedUser.id}` : `user_${selectedUser.id}`] ? (
                        <span style={{color:'#10b981', fontWeight:'500'}}>
                          {selectedUser.type==='group' ? `${typingUsers[`group_${selectedUser.id}`]} is typing...` : 'typing...'}
                        </span>
                      ) : (
                        selectedUser.type==='group' ? 'Group Chat' : (selectedUser.designation || selectedUser.department || selectedUser.role)
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div ref={containerRef} style={{flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:'10px', background:'var(--bg-tertiary)'}}>
                  {messages.length === 0 ? (
                    <div style={{textAlign:'center', color:colors.light, marginTop:'40px'}}>
                      <p style={{fontSize:'14px'}}>No messages yet. Say hi! 👋</p>
                    </div>
                  ) : messages.map((msg, i) => {
                    const isMe = msg.sender_id === user.id;
                    const showDate = i===0 || new Date(messages[i-1].created_at).toDateString()!==new Date(msg.created_at).toDateString();
                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div style={{textAlign:'center', margin:'8px 0'}}>
                            <span style={{background:colors.card, padding:'4px 14px', borderRadius:'20px', fontSize:'12px', color:colors.light, border:`1px solid ${colors.border}`}}>
                              {new Date(msg.created_at).toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}
                            </span>
                          </div>
                        )}
                        <div 
                          style={{display:'flex', flexDirection:'column', alignItems:isMe?'flex-end':'flex-start'}}
                          onMouseEnter={e => { if(isMe) e.currentTarget.querySelector('.delete-btn').style.opacity = 1; }}
                          onMouseLeave={e => { if(isMe) e.currentTarget.querySelector('.delete-btn').style.opacity = 0; }}
                        >
                          {!isMe && selectedUser.type==='group' && (
                            <span style={{fontSize:'11px', color:colors.light, marginBottom:'2px', marginLeft:'4px'}}>{msg.sender_name}</span>
                          )}
                          <div style={{position: 'relative', maxWidth:'65%'}}>
                            {isMe && (
                              <button 
                                className="delete-btn"
                                onClick={() => deleteMessage(msg.id)}
                                style={{position: 'absolute', left: '-30px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s', padding: '5px'}}
                              >
                                <FiTrash2 size={14}/>
                              </button>
                            )}
                            <div style={{padding:'11px 16px', borderRadius:isMe?'18px 18px 4px 18px':'18px 18px 18px 4px', background:isMe?colors.primary:colors.lightBg, color:isMe?'white':colors.text, border:isMe?'none':`1px solid ${colors.border}`, boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
                              {msg.file_url && (
                                <div 
                                  onClick={() => {
                                    if (msg.file_url.toLowerCase().endsWith('.pdf')) {
                                      setViewingPDF({ url: `http://localhost:5001${msg.file_url}`, name: msg.file_name });
                                    } else {
                                      window.open(`http://localhost:5001${msg.file_url}`, '_blank');
                                    }
                                  }}
                                  style={{display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', background:isMe?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.05)', borderRadius:'10px', marginBottom:msg.message?'8px':0, color:isMe?'white':colors.primary, cursor: 'pointer', fontSize:'13px', border:isMe?'1px solid rgba(255,255,255,0.2)':`1px solid ${colors.border}`}}
                                >
                                  {msg.file_url.toLowerCase().endsWith('.pdf') ? <FiEye size={16}/> : <FiDownload size={16}/>}
                                  <span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex: 1}}>{msg.file_name}</span>
                                </div>
                              )}
                              {msg.message && <div style={{fontSize:'14px', lineHeight:'1.5', wordBreak:'break-word'}}>{msg.message}</div>}
                              <div style={{fontSize:'11px', marginTop:'5px', textAlign:'right', opacity:0.7}}>
                                {new Date(msg.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Input */}
                <div style={{padding:'16px 20px', borderTop:`1px solid ${colors.border}`, background:colors.card}}>
                  {file && (
                    <div style={{display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', background:colors.lightBg, borderRadius:'10px', marginBottom:'10px', border:`1px solid ${colors.border}`, width:'fit-content'}}>
                      <FiPaperclip size={14} color={colors.primary}/>
                      <span style={{fontSize:'13px', color:colors.text, maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{file.name}</span>
                      <FiX size={16} color={colors.light} style={{cursor:'pointer', marginLeft:'10px'}} onClick={()=>setFile(null)}/>
                    </div>
                  )}
                  <div style={{display:'flex', gap:'12px', alignItems:'center', background:colors.lightBg, border:`1px solid ${colors.border}`, borderRadius:'14px', padding:'8px 12px'}}>
                    <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={e=>setFile(e.target.files[0])}/>
                    <button onClick={()=>fileInputRef.current.click()} style={{background:'none', border:'none', color:colors.light, cursor:'pointer', display:'flex', padding:'4px'}}>
                      <FiPaperclip size={20} />
                    </button>
                    <input value={input} onChange={e=>{setInput(e.target.value); handleTyping();}} onKeyDown={handleKeyDown}
                      placeholder={selectedUser.type==='group' ? `Message group...` : `Message ${selectedUser.name.split(' ')[0]}...`}
                      style={{flex:1, border:'none', outline:'none', fontSize:'14px', background:'transparent', color:colors.text}}/>
                    <button onClick={sendMessage} disabled={(!input.trim() && !file) || loading}
                      style={{width:'38px', height:'38px', borderRadius:'10px', background:(input.trim()||file)?colors.primary:'var(--border-color)', border:'none', color:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:(input.trim()||file)?'pointer':'not-allowed', transition:'all 0.2s'}}>
                      <FiSend size={16}/>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <DeleteConfirmModal 
          isOpen={!!msgToDelete} 
          onClose={() => setMsgToDelete(null)} 
          onConfirm={confirmDelete}
          title="Delete Message"
          message="Are you sure you want to delete this message? This will remove it for you permanently."
        />

        <PDFModal 
          isOpen={!!viewingPDF} 
          onClose={() => setViewingPDF(null)} 
          fileUrl={viewingPDF?.url} 
          fileName={viewingPDF?.name} 
        />

        {/* Create Group Modal */}
        {showCreateGroup && (
          <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter: 'blur(4px)'}}>
            <div style={{background:colors.card, width:'400px', borderRadius:'24px', padding:'24px', border:`1px solid ${colors.border}`, boxShadow:'0 10px 25px rgba(0,0,0,0.1)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h3 style={{fontSize:'18px', fontWeight:'600', color:colors.text}}>Create Group</h3>
                <FiX size={20} color={colors.light} style={{cursor:'pointer'}} onClick={()=>setShowCreateGroup(false)}/>
              </div>
              <input value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} placeholder="Group Name"
                style={{width:'100%', padding:'12px 16px', background:colors.lightBg, border:`1px solid ${colors.border}`, borderRadius:'12px', fontSize:'14px', marginBottom:'16px', outline:'none', color:colors.text}}/>
              
              <div style={{fontSize:'14px', fontWeight:'500', color:colors.text, marginBottom:'8px'}}>Select Members</div>
              <div style={{maxHeight:'250px', overflowY:'auto', border:`1px solid ${colors.border}`, borderRadius:'12px', background:colors.lightBg, padding:'8px'}}>
                {people.map(p => (
                  <div key={p.id} onClick={()=>setSelectedMembers(prev => prev.includes(p.id) ? prev.filter(id=>id!==p.id) : [...prev, p.id])}
                    style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', cursor:'pointer', background:selectedMembers.includes(p.id)?colors.activeBlue:'transparent'}}>
                    <input type="checkbox" checked={selectedMembers.includes(p.id)} readOnly style={{accentColor:colors.primary}}/>
                    <span style={{fontSize:'14px', color:colors.text}}>{p.name} <span style={{fontSize:'12px', color:colors.light}}>({p.role})</span></span>
                  </div>
                ))}
              </div>
              
              <button onClick={createGroup} disabled={!newGroupName.trim() || selectedMembers.length===0 || loading}
                style={{width:'100%', padding:'14px', background:(!newGroupName.trim() || selectedMembers.length===0)?'var(--border-color)':colors.primary, color:'white', borderRadius:'12px', border:'none', fontSize:'15px', fontWeight:'600', marginTop:'20px', cursor:(!newGroupName.trim() || selectedMembers.length===0)?'not-allowed':'pointer'}}>
                Create Group Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
