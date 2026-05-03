const { Pool } = require('pg');

const db = new Pool({
  user: 'himasree',
  host: 'localhost',
  database: 'academa_lms',
  password: '',
  port: 5432,
});

const gradePoints = {
  'A+': 10,
  'A': 9,
  'B+': 8,
  'B': 7,
  'C+': 6,
  'C': 5,
  'D': 4,
  'F': 0
};

const gradesArr = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

const seedGrades = async () => {
  try {
    console.log('🌱 Seeding historical grades...');

    // 1. Get all students
    const studentsRes = await db.query("SELECT id, name, batch FROM users WHERE role = 'student'");
    const students = studentsRes.rows;

    // 2. Get all courses to use as dummy courses
    const coursesRes = await db.query("SELECT id, name, credits FROM courses");
    const courses = coursesRes.rows;

    if (courses.length === 0) {
      console.log('❌ No courses found. Run seed.js first.');
      process.exit(1);
    }

    for (const student of students) {
      // Determine how many semesters to seed
      // Batch 2023 -> up to Sem 5
      // Batch 2024 -> up to Sem 3
      // Batch 2025 -> up to Sem 1
      const currentYear = new Date().getFullYear();
      const batchYear = parseInt(student.batch);
      const semestersToSeed = (2026 - batchYear) * 2 - 1; // Assuming Spring 2026 is current (Sem 6 for 2023)
      
      console.log(`  Grading ${student.name} (Batch ${student.batch}) for ${semestersToSeed} semesters...`);

      for (let sem = 1; sem <= semestersToSeed; sem++) {
        // Pick 5 random courses for this semester
        const semCourses = [...courses].sort(() => 0.5 - Math.random()).slice(0, 5);
        
        for (const course of semCourses) {
          const grade = gradesArr[Math.floor(Math.random() * gradesArr.length)];
          const gradePoint = gradePoints[grade];
          const totalMarks = Math.floor(Math.random() * 40) + 60; // 60-100

          await db.query(
            `INSERT INTO grades (student_id, course_id, semester, academic_year, total_marks, grade, grade_point) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [student.id, course.id, `Semester ${sem}`, `${batchYear + Math.floor((sem-1)/2)}-${batchYear + Math.floor((sem-1)/2) + 1}`, totalMarks, grade, gradePoint]
          );
        }
      }
    }

    console.log('✅ Historical grades seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding grades:', err);
    process.exit(1);
  }
};

seedGrades();
