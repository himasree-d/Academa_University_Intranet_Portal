require('dotenv').config({ path: '../.env' });
const db = require('../src/config/database');
const { autoEnrollStudent } = require('../src/utils/enrollmentUtils');

async function run() {
  try {
    console.log('--- Starting Auto-Enrollment for Existing Students ---');
    
    // Fetch all students whose enrollment_id starts with SE23 and is either UCSE or UARI
    const res = await db.query(`
      SELECT id, enrollment_id, name 
      FROM users 
      WHERE role = 'student' 
        AND enrollment_id LIKE 'SE23%'
        AND (enrollment_id LIKE '%UCSE%' OR enrollment_id LIKE '%UARI%')
    `);

    console.log(`Found ${res.rows.length} matching students.`);

    for (const student of res.rows) {
      console.log(`Processing ${student.name} (${student.enrollment_id})...`);
      await autoEnrollStudent(student.id, student.enrollment_id);
    }

    console.log('--- Finished ---');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error during processing:', err);
    process.exit(1);
  }
}

run();
