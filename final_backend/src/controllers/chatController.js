const db = require('../config/database');
const socketManager = require('../config/socket');

// Get all people user can chat with
const getPeople = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id,name,role,department,designation FROM users WHERE id!=$1 AND is_active=true ORDER BY role,name',
      [req.user.id]
    );
    res.json({ success:true, data:result.rows });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

// Get conversations (list of people you've chatted with + last message AND groups)
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    // Direct messages
    const dmResult = await db.query(
      `SELECT DISTINCT ON (other_user.id)
              'direct' as type,
              other_user.id, other_user.name, other_user.role, other_user.designation,
              cm.message as last_message, cm.created_at as last_message_time,
              (SELECT COUNT(*) FROM chat_messages
               WHERE sender_id=other_user.id AND receiver_id=$1 AND is_read=false) as unread_count
       FROM chat_messages cm
       JOIN users other_user ON (
         CASE WHEN cm.sender_id=$1 THEN cm.receiver_id ELSE cm.sender_id END
       ) = other_user.id
       WHERE (cm.sender_id=$1 OR cm.receiver_id=$1) AND cm.group_id IS NULL
       ORDER BY other_user.id, cm.created_at DESC`,
      [userId]
    );

    // Group messages
    const groupResult = await db.query(
      `SELECT cg.id, cg.name, 'group' as type,
              (SELECT message FROM chat_messages WHERE group_id=cg.id ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT created_at FROM chat_messages WHERE group_id=cg.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
              0 as unread_count
       FROM chat_groups cg
       JOIN chat_group_members cgm ON cg.id=cgm.group_id
       WHERE cgm.user_id=$1`,
      [userId]
    );

    const conversations = [...dmResult.rows, ...groupResult.rows].sort((a,b) => {
      const aTime = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
      const bTime = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
      return bTime - aTime;
    });

    res.json({ success:true, data:conversations });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

// Get messages between two users OR a group
const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const isGroup = req.query.type === 'group';

    if (isGroup) {
      // Verify membership
      const memberCheck = await db.query('SELECT 1 FROM chat_group_members WHERE group_id=$1 AND user_id=$2', [id, req.user.id]);
      if (!memberCheck.rows.length) return res.status(403).json({ success:false, message:'Not a member of this group' });

      const result = await db.query(
        `SELECT cm.*, u.name as sender_name, u.role as sender_role
         FROM chat_messages cm JOIN users u ON cm.sender_id=u.id
         WHERE cm.group_id=$1
         ORDER BY cm.created_at ASC`,
        [id]
      );
      res.json({ success:true, data:result.rows });
    } else {
      const result = await db.query(
        `SELECT cm.*, u.name as sender_name, u.role as sender_role
         FROM chat_messages cm JOIN users u ON cm.sender_id=u.id
         WHERE (cm.sender_id=$1 AND cm.receiver_id=$2 AND cm.group_id IS NULL)
            OR (cm.sender_id=$2 AND cm.receiver_id=$1 AND cm.group_id IS NULL)
         ORDER BY cm.created_at ASC`,
        [req.user.id, id]
      );
      // Mark as read
      await db.query(
        'UPDATE chat_messages SET is_read=true WHERE sender_id=$1 AND receiver_id=$2 AND is_read=false',
        [id, req.user.id]
      );
      res.json({ success:true, data:result.rows });
    }
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiver_id, group_id, message } = req.body;
    let fileUrl = null, fileName = null;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    }

    if (!message && !req.file) {
      return res.status(400).json({ success:false, message:'Message or file is required' });
    }

    let result;
    if (group_id) {
      // Send to group
      result = await db.query(
        'INSERT INTO chat_messages (sender_id, group_id, message, file_url, file_name) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [req.user.id, group_id, message || '', fileUrl, fileName]
      );
    } else if (receiver_id) {
      // Send to user
      result = await db.query(
        'INSERT INTO chat_messages (sender_id, receiver_id, message, file_url, file_name) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [req.user.id, receiver_id, message || '', fileUrl, fileName]
      );
    } else {
      return res.status(400).json({ success:false, message:'receiver_id or group_id is required' });
    }

    const newMessage = { ...result.rows[0], sender_name: req.user.name };

    // Emit real-time event
    const io = socketManager.getIo();
    if (group_id) {
      io.to(`group_${group_id}`).emit('new_message', newMessage);
    } else if (receiver_id) {
      const receiverSocketId = socketManager.getSocketId(receiver_id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', newMessage);
      }
    }

    res.status(201).json({ success:true, data: newMessage });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE receiver_id=$1 AND is_read=false AND group_id IS NULL',
      [req.user.id]
    );
    res.json({ success:true, data:{ count: parseInt(result.rows[0].count) } });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

// Create a new group
const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name || !members || !Array.isArray(members)) {
      return res.status(400).json({ success:false, message:'Group name and members array required' });
    }

    // Include the creator in the members list if not already there
    const memberSet = new Set([...members, req.user.id]);

    const groupResult = await db.query(
      'INSERT INTO chat_groups (name, created_by) VALUES ($1, $2) RETURNING *',
      [name, req.user.id]
    );
    const groupId = groupResult.rows[0].id;

    for (const userId of memberSet) {
      await db.query('INSERT INTO chat_group_members (group_id, user_id) VALUES ($1, $2)', [groupId, userId]);
    }

    res.status(201).json({ success:true, data:groupResult.rows[0] });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Only allow sender to delete their own message
    const result = await db.query(
      'DELETE FROM chat_messages WHERE id=$1 AND sender_id=$2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Message not found or unauthorized' });
    }

    const msg = result.rows[0];

    // Notify recipient/group about deletion
    const io = socketManager.getIo();
    if (msg.group_id) {
      io.to(`group_${msg.group_id}`).emit('message_deleted', id);
    } else {
      const recipientSocketId = socketManager.getSocketId(msg.receiver_id);
      if (recipientSocketId) io.to(recipientSocketId).emit('message_deleted', id);
    }

    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getPeople, getConversations, getMessages, sendMessage, getUnreadCount, createGroup, deleteMessage };
