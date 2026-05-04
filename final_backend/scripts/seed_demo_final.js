const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const db = new Pool({
  user: 'himasree',
  host: 'localhost',
  database: 'academa_lms',
  password: '',
  port: 5432,
});

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Diya', 'Ananya', 'Aadhya', 'Saanvi', 'Kavya', 'Priya', 'Riya', 'Anjali', 'Sneha', 'Neha', 'Rahul', 'Karan', 'Rohan', 'Vikas', 'Amit', 'Sunil', 'Vijay', 'Akash', 'Siddharth', 'Nikhil', 'Pooja', 'Shruti', 'Swati', 'Megha', 'Divya', 'Deepika', 'Kriti', 'Aditi', 'Harshitha', 'Tanvi', 'Himasree'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Rao', 'Das', 'Roy', 'Chowdhury', 'Mishra', 'Tiwari', 'Pandey', 'Nair', 'Menon', 'Iyer', 'Pillai', 'Jain', 'Shah', 'Agarwal', 'Bansal', 'Garg', 'Kolla', 'Nadimpalli', 'Dintakurthy', 'Borkar'];

const branches = [
  { id: 'CSE', name: 'Computer Science', code: 'CSE', type: 'Engineering' },
  { id: 'AI', name: 'Artificial Intelligence', code: 'ARI', type: 'Engineering' },
  { id: 'MEC', name: 'Mechatronics', code: 'MEC', type: 'Engineering' },
  { id: 'ECE', name: 'Electronics and Communication', code: 'ECE', type: 'Engineering' },
  { id: 'BIT', name: 'Biotechnology', code: 'BIT', type: 'Engineering' }
];

const getRandomName = () => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

const seed = async () => {
  try {
    console.log('🌱 Starting Database Seeding (50 students, 5 faculty)...');
    
    // Clean existing data
    console.log('🧹 Cleaning existing tables...');
    await db.query('TRUNCATE TABLE enrollments, submissions, assignments, materials, announcements, timetable_entries, chat_messages, chat_groups, courses, users RESTART IDENTITY CASCADE');

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Admin
    await db.query(
      `INSERT INTO users (name, email, password_hash, role, department, is_active, is_verified, email_verified) 
       VALUES ($1, $2, $3, $4, $5, true, true, true)`,
      ['Admin User', 'admin@academa.edu', passwordHash, 'admin', 'Administration']
    );

    // 2. 5 Faculty (1 per branch)
    console.log('👨‍🏫 Creating 5 Faculty...');
    const facultyIds = {};
    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];
      const name = `Prof. ${getRandomName()}`;
      const email = `prof.${branch.id.toLowerCase()}1@academa.edu`;
      const res = await db.query(
        `INSERT INTO users (name, email, password_hash, role, department, designation, is_active, is_verified, email_verified) 
         VALUES ($1, $2, $3, $4, $5, $6, true, true, true) RETURNING id`,
        [name, email, passwordHash, 'faculty', branch.name, 'Professor']
      );
      facultyIds[branch.id] = res.rows[0].id;
    }

    // 3. Courses (2 Core + 1 Elective per branch)
    console.log('📚 Creating Courses...');
    const branchCourses = {};
    for (const branch of branches) {
      branchCourses[branch.id] = [];
      const facId = facultyIds[branch.id];
      
      // Core 1
      let res = await db.query(
        `INSERT INTO courses (code, name, description, credits, department, branch, course_type, semester_number, instructor_id, semester, max_students, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) RETURNING id`,
        [`${branch.id}401`, `Core ${branch.name} 1`, `Fundamental course`, 4, branch.type, branch.id, 'core', 4, facId, 'Spring 2024', 60]
      );
      branchCourses[branch.id].push(res.rows[0].id);

      // Core 2
      res = await db.query(
        `INSERT INTO courses (code, name, description, credits, department, branch, course_type, semester_number, instructor_id, semester, max_students, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) RETURNING id`,
        [`${branch.id}402`, `Core ${branch.name} 2`, `Advanced course`, 4, branch.type, branch.id, 'core', 4, facId, 'Spring 2024', 60]
      );
      branchCourses[branch.id].push(res.rows[0].id);

      // Elective
      res = await db.query(
        `INSERT INTO courses (code, name, description, credits, department, branch, course_type, semester_number, instructor_id, semester, max_students, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) RETURNING id`,
        [`${branch.id}40E`, `Elective ${branch.name}`, `Specialization course`, 3, branch.type, branch.id, 'elective', 4, facId, 'Spring 2024', 60]
      );
      branchCourses[branch.id].push(res.rows[0].id);
    }

    // 4. 50 Students (10 per branch)
    console.log('🎓 Creating 50 Students & Enrolling...');
    let demoStudentId = null;
    let demoFacultyId = facultyIds['CSE'];
    let demoCourseId = branchCourses['CSE'][0];

    for (const branch of branches) {
      for (let i = 1; i <= 10; i++) {
        const name = getRandomName();
        const rollNum = i.toString().padStart(3, '0');
        const enrollment_id = `MU24U${branch.code}${rollNum}`;
        const email = `${enrollment_id.toLowerCase()}@mahindrauniversity.edu.in`;

        const res = await db.query(
          `INSERT INTO users (name, email, password_hash, role, department, branch, batch, enrollment_id, is_active, is_verified, email_verified) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, true, true) RETURNING id`,
          [name, email, passwordHash, 'student', branch.type, branch.id, '2024', enrollment_id]
        );
        const stuId = res.rows[0].id;

        if (branch.id === 'CSE' && i === 1) {
          demoStudentId = stuId; // Save first CSE student for demo
        }

        // Enroll in all 3 courses for their branch
        for (const cId of branchCourses[branch.id]) {
          await db.query(`INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, 'active')`, [stuId, cId]);
        }
      }
    }

    // 5. Add Demo Data (Assignments, Materials, Announcements, Chat) for the demo course
    console.log('📝 Seeding Demo Data (Assignments, Materials)...');
    
    // Assignment
    await db.query(`
      INSERT INTO assignments (title, description, course_id, created_by, due_date, total_marks, is_active)
      VALUES ('Mid-Term Project', 'Submit project report', $1, $2, NOW() + INTERVAL '7 days', 100, true)
    `, [demoCourseId, demoFacultyId]);

    // Material
    await db.query(`
      INSERT INTO materials (title, description, file_url, file_type, file_size, course_id, instructor_id)
      VALUES ('Lecture 1 Slides', 'Course Intro', '/uploads/lecture1.pdf', 'pdf', '1MB', $1, $2)
    `, [demoCourseId, demoFacultyId]);

    // Announcement
    await db.query(`
      INSERT INTO announcements (title, description, course_id, author_id, is_important)
      VALUES ('Welcome to the Course!', 'Please review the syllabus uploaded in materials.', $1, $2, true)
    `, [demoCourseId, demoFacultyId]);

    // Chat Message
    await db.query(`
      INSERT INTO chat_messages (sender_id, receiver_id, message, is_read)
      VALUES ($1, $2, 'Welcome to the class! Let me know if you have questions.', false)
    `, [demoFacultyId, demoStudentId]);

    console.log('\n=============================================');
    console.log('✅ SEEDING COMPLETE - EXACTLY 50 STUDENTS, 5 FACULTY');
    console.log('=============================================');
    console.log('Use this pair for your DEMO (They are connected & have data):');
    console.log('\n🧑‍🎓 STUDENT:');
    console.log('Email: mu24ucse001@mahindrauniversity.edu.in');
    console.log('Pass:  password123');
    console.log('\n👨‍🏫 FACULTY:');
    console.log('Email: prof.cse1@academa.edu');
    console.log('Pass:  password123');
    console.log('=============================================');

    await db.end();
  } catch (err) {
    console.error('Seeding Error:', err);
    await db.end();
  }
};

seed();
