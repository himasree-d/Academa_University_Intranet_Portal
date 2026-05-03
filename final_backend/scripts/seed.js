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
  { id: 'BIT', name: 'Biotechnology', code: 'BIT', type: 'Engineering' },
  { id: 'ECE', name: 'Electronics and Communication', code: 'ECE', type: 'Engineering' },
  { id: 'ECM', name: 'Electronics and Computer Engineering', code: 'ECM', type: 'Engineering' },
  { id: 'CIE', name: 'Civil Engineering', code: 'CIE', type: 'Engineering' },
  { id: 'MEE', name: 'Mechanical', code: 'MEE', type: 'Engineering' },
  { id: 'CAM', name: 'Computational Mathematics', code: 'CAM', type: 'Science' },
  { id: 'CAB', name: 'Computational Biology', code: 'CAB', type: 'Science' }
];

const years = ['2023', '2024', '2025']; // 3rd, 2nd, 1st year

const getRandomName = () => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

const seed = async () => {
  try {
    console.log('🌱 Starting Database Seeding...');
    
    // Clean existing data (optional depending on user choice, but here we wipe for a clean state)
    console.log('🧹 Cleaning existing tables...');
    await db.query('TRUNCATE TABLE enrollments, submissions, assignments, materials, announcements, timetable_entries, chat_messages, courses, users RESTART IDENTITY CASCADE');

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Insert Admin
    console.log('👤 Creating Admin...');
    await db.query(
      `INSERT INTO users (name, email, password_hash, role, department, is_active, is_verified, email_verified) 
       VALUES ($1, $2, $3, $4, $5, true, true, true)`,
      ['Admin User', 'admin@academa.edu', passwordHash, 'admin', 'Administration']
    );

    // 2. Insert Faculty (2 per branch)
    console.log('👨‍🏫 Creating Faculty...');
    const facultyIds = {};
    for (const branch of branches) {
      facultyIds[branch.id] = [];
      for (let i = 1; i <= 2; i++) {
        const name = `Prof. ${getRandomName()}`;
        const email = `prof.${branch.id.toLowerCase()}${i}@academa.edu`;
        const res = await db.query(
          `INSERT INTO users (name, email, password_hash, role, department, designation, is_active, is_verified, email_verified) 
           VALUES ($1, $2, $3, $4, $5, $6, true, true, true) RETURNING id`,
          [name, email, passwordHash, 'faculty', branch.name, i===1 ? 'Professor' : 'Assistant Professor']
        );
        facultyIds[branch.id].push(res.rows[0].id);
      }
    }

    // 3. Insert Courses
    console.log('📚 Creating Courses...');
    const courseIds = [];
    const courseByBranchAndYear = {};
    
    let courseCounter = 101;
    for (const branch of branches) {
      for (const year of years) {
        const semester = year === '2023' ? 6 : (year === '2024' ? 4 : 2); // Approximation
        
        // 2 Core courses per branch per year
        for (let i = 1; i <= 2; i++) {
          const instructor_id = facultyIds[branch.id][i-1];
          const code = `${branch.id}${semester}0${i}`;
          const res = await db.query(
            `INSERT INTO courses (code, name, description, credits, department, branch, course_type, semester_number, instructor_id, semester, max_students, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) RETURNING id`,
            [code, `Core ${branch.name} ${i} (Sem ${semester})`, `Fundamental course for ${branch.name}`, 4, branch.type, branch.id, 'core', semester, instructor_id, 'Spring 2024', 60]
          );
          courseIds.push(res.rows[0].id);
          if(!courseByBranchAndYear[`${branch.id}-${year}`]) courseByBranchAndYear[`${branch.id}-${year}`] = [];
          courseByBranchAndYear[`${branch.id}-${year}`].push(res.rows[0].id);
        }

        // Electives for 3rd year (2023) and 4th year (if any)
        if (year === '2023') {
          for (let i = 1; i <= 2; i++) {
            const instructor_id = facultyIds[branch.id][i-1];
            const code = `${branch.id}${semester}E${i}`;
            const res = await db.query(
              `INSERT INTO courses (code, name, description, credits, department, branch, course_type, semester_number, instructor_id, semester, max_students, is_active) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) RETURNING id`,
              [code, `Elective ${branch.name} ${i} (Sem ${semester})`, `Advanced elective course for ${branch.name}`, 3, branch.type, branch.id, 'elective', semester, instructor_id, 'Spring 2024', 60]
            );
            courseIds.push(res.rows[0].id);
            courseByBranchAndYear[`${branch.id}-${year}`].push(res.rows[0].id);
          }
        }
      }
    }

    // 4. Insert Students
    console.log('🎓 Creating Students...');
    let totalStudents = 0;
    
    for (const year of years) {
      for (const branch of branches) {
        // Generate 5-10 students per branch per year
        const numStudents = Math.floor(Math.random() * 6) + 5; 
        for (let i = 1; i <= numStudents; i++) {
          totalStudents++;
          const name = getRandomName();
          const rollNum = i.toString().padStart(3, '0');
          const shortYear = year.slice(-2); // '23', '24', '25'
          const enrollment_id = `SE${shortYear}U${branch.code}${rollNum}`; // Changed MU to SE as per user's original data example, but user asked for MU. Let's use MU as requested.
          const final_enrollment_id = `MU${shortYear}U${branch.code}${rollNum}`;
          const email = `${final_enrollment_id.toLowerCase()}@mahindrauniversity.edu.in`;

          const res = await db.query(
            `INSERT INTO users (name, email, password_hash, role, department, branch, batch, enrollment_id, is_active, is_verified, email_verified) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, true, true) RETURNING id`,
            [name, email, passwordHash, 'student', branch.type, branch.id, year, final_enrollment_id]
          );
          const studentId = res.rows[0].id;

          // Enroll student in courses
          const myCourses = courseByBranchAndYear[`${branch.id}-${year}`];
          if (myCourses) {
            for (const courseId of myCourses) {
              await db.query(
                `INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, 'active')`,
                [studentId, courseId]
              );
            }
          }
        }
      }
    }
    
    console.log(`✅ Seeding Complete!`);
    console.log(`Created 1 Admin, ${branches.length * 2} Faculty, ${courseIds.length} Courses, and ${totalStudents} Students.`);
    console.log(`Test Student Login: mu23ucse001@mahindrauniversity.edu.in / password123`);
    console.log(`Test Faculty Login: prof.cse1@academa.edu / password123`);
    console.log(`Test Admin Login: admin@academa.edu / password123`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seed();
