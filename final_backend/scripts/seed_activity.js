const { Pool } = require('pg');
require('dotenv').config({ path: '../src/.env' });

const pool = new Pool({
  user: 'himasree',
  host: 'localhost',
  database: 'academa_lms',
  password: 'password', // Adjust if needed
  port: 5432,
});

async function generateActivity() {
  console.log('🌱 Starting mock activity generation...');

  try {
    const users = await pool.query('SELECT * FROM users');
    const courses = await pool.query('SELECT * FROM courses');
    const enrollments = await pool.query('SELECT * FROM enrollments');

    if (users.rows.length === 0 || courses.rows.length === 0) {
      console.log('❌ Error: Please run seed.js first to generate users and courses.');
      return;
    }

    const students = users.rows.filter(u => u.role === 'student');
    const faculty = users.rows.filter(u => u.role === 'faculty');
    const admins = users.rows.filter(u => u.role === 'admin');

    console.log('📅 Generating Timetable Entries...');
    await pool.query('TRUNCATE timetable_entries RESTART IDENTITY CASCADE');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00'];
    const rooms = ['Room 101', 'Room 102', 'Lab A', 'Lab B', 'Auditorium'];
    
    for (const course of courses.rows) {
      // 2 classes per course per week
      for (let i=0; i<2; i++) {
        const day = days[Math.floor(Math.random() * days.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        // Just mock some branch specific logic based on course code
        const branchMatch = course.code.match(/^[A-Z]+/);
        const branch = branchMatch ? branchMatch[0] : 'CSE';

        await pool.query(
          `INSERT INTO timetable_entries (course_id, day_of_week, start_time, end_time, room, entry_type, branch)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [course.id, day, time, '11:00', room, i === 0 ? 'lecture' : 'lab', branch]
        );
      }
    }

    console.log('📚 Generating Materials...');
    await pool.query('TRUNCATE materials RESTART IDENTITY CASCADE');
    for (const course of courses.rows) {
      await pool.query(
        `INSERT INTO materials (course_id, title, description, file_name, file_url, instructor_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [course.id, `Syllabus - ${course.name}`, 'Course syllabus and guidelines.', 'syllabus.pdf', '/uploads/mock_syllabus.pdf', course.instructor_id]
      );
      await pool.query(
        `INSERT INTO materials (course_id, title, description, file_name, file_url, instructor_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [course.id, `Lecture 1 Slides`, 'Introduction to the course.', 'lecture1.pdf', '/uploads/mock_lecture.pdf', course.instructor_id]
      );
    }

    console.log('📝 Generating Assignments...');
    await pool.query('TRUNCATE assignments RESTART IDENTITY CASCADE');
    const assignmentIds = [];
    for (const course of courses.rows) {
      // Past Assignment
      let res = await pool.query(
        `INSERT INTO assignments (course_id, title, description, due_date, due_time, total_marks, created_by)
         VALUES ($1, $2, $3, NOW() - INTERVAL '5 days', '23:59', 100, $4) RETURNING id`,
        [course.id, `Assignment 1: Introduction`, 'Complete the introductory exercises.', course.instructor_id]
      );
      assignmentIds.push({ id: res.rows[0].id, course_id: course.id, status: 'past' });

      // Active Assignment
      res = await pool.query(
        `INSERT INTO assignments (course_id, title, description, due_date, due_time, total_marks, created_by)
         VALUES ($1, $2, $3, NOW() + INTERVAL '3 days', '23:59', 100, $4) RETURNING id`,
        [course.id, `Assignment 2: Midterm Prep`, 'Review material for midterm.', course.instructor_id]
      );
      assignmentIds.push({ id: res.rows[0].id, course_id: course.id, status: 'active' });
    }

    console.log('✅ Generating Submissions & Grades...');
    await pool.query('TRUNCATE submissions RESTART IDENTITY CASCADE');
    for (const assign of assignmentIds) {
      // Find students enrolled in this course
      const enrolled = enrollments.rows.filter(e => e.course_id === assign.course_id);
      
      for (let i = 0; i < enrolled.length; i++) {
        const student = enrolled[i];
        
        // Randomly skip some students so they have pending assignments
        if (Math.random() > 0.8) continue; 

        // If assignment is past, maybe grade it
        let status = 'submitted';
        let grade = null;
        let feedback = null;
        let graded_by = null;
        
        if (assign.status === 'past') {
          if (Math.random() > 0.3) {
            status = 'graded';
            grade = Math.floor(Math.random() * 40) + 60; // 60-100
            feedback = 'Good work!';
            graded_by = (courses.rows.find(c => c.id === assign.course_id)).instructor_id;
          }
        }

        await pool.query(
          `INSERT INTO submissions (assignment_id, student_id, file_name, file_url, status, grade, feedback, graded_by, submitted_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '1 day')`,
          [assign.id, student.student_id, 'submission.pdf', '/uploads/mock_submission.pdf', status, grade, feedback, graded_by]
        );
      }
    }

    console.log('💬 Generating Chats & Groups...');
    await pool.query('TRUNCATE chat_groups, chat_group_members, chat_messages RESTART IDENTITY CASCADE');
    
    // Group Chats
    for (const course of courses.rows) {
      // Create a course group
      const res = await pool.query(
        'INSERT INTO chat_groups (name, created_by) VALUES ($1, $2) RETURNING id',
        [`${course.code} Discussion`, course.instructor_id]
      );
      const groupId = res.rows[0].id;
      
      // Add instructor
      await pool.query('INSERT INTO chat_group_members (group_id, user_id) VALUES ($1, $2)', [groupId, course.instructor_id]);
      
      // Add enrolled students
      const enrolled = enrollments.rows.filter(e => e.course_id === course.id);
      for (const e of enrolled) {
        await pool.query('INSERT INTO chat_group_members (group_id, user_id) VALUES ($1, $2)', [groupId, e.student_id]);
      }

      // Add welcome message
      await pool.query(
        'INSERT INTO chat_messages (sender_id, group_id, message) VALUES ($1, $2, $3)',
        [course.instructor_id, groupId, `Welcome to ${course.code}! Feel free to ask questions here.`]
      );

      // Add a student message
      if (enrolled.length > 0) {
        await pool.query(
          'INSERT INTO chat_messages (sender_id, group_id, message) VALUES ($1, $2, $3)',
          [enrolled[0].student_id, groupId, `Hi everyone!`]
        );
      }
    }

    // Direct Messages
    for (let i=0; i<10; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      const fac = faculty[Math.floor(Math.random() * faculty.length)];
      
      await pool.query(
        'INSERT INTO chat_messages (sender_id, receiver_id, message, is_read) VALUES ($1, $2, $3, true)',
        [student.id, fac.id, `Hello Professor, I have a doubt regarding the recent lecture.`]
      );
      await pool.query(
        'INSERT INTO chat_messages (sender_id, receiver_id, message, is_read) VALUES ($1, $2, $3, false)',
        [fac.id, student.id, `Sure, please drop by my office tomorrow.`]
      );
    }
    
    // File upload message
    const student1 = students[0];
    const student2 = students[1];
    if (student1 && student2) {
      await pool.query(
        'INSERT INTO chat_messages (sender_id, receiver_id, message, file_name, file_url, is_read) VALUES ($1, $2, $3, $4, $5, false)',
        [student1.id, student2.id, `Here are the notes from yesterday!`, 'notes.pdf', '/uploads/mock_notes.pdf']
      );
    }


    console.log('🎉 Mock activity generation complete!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error seeding activity data:', err);
    process.exit(1);
  }
}

generateActivity();
