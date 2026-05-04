const { Pool } = require('pg');
const db = new Pool({ user:'himasree', host:'localhost', database:'academa_lms', password:'', port:5432 });

(async () => {
  try {
    const facId = 2; // prof.cse1@academa.edu
    const stuId = 22; // mu23ucse001@mahindrauniversity.edu.in
    
    // Add direct message
    await db.query(`
      INSERT INTO chat_messages (sender_id, receiver_id, message, is_read)
      VALUES ($1, $2, 'Aarav, please review the latest lecture slides I uploaded today.', false)
    `, [facId, stuId]);

    console.log('Direct message created');
    await db.end();
  } catch (e) {
    console.error(e);
    await db.end();
  }
})();
