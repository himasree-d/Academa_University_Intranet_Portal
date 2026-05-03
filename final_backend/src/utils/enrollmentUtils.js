const db = require('../config/database');

/**
 * Automatically enrolls a student in specific courses based on their enrollment ID.
 * @param {number} studentId - The ID of the student user.
 * @param {string} enrollmentId - The enrollment ID (e.g., SE23UCSE190).
 */
async function autoEnrollStudent(studentId, enrollmentId) {
  if (!enrollmentId) return;

  const is2023Batch = enrollmentId.startsWith('SE23');
  if (!is2023Batch) return;

  const isCSE = enrollmentId.includes('UCSE');
  const isAI = enrollmentId.includes('UARI');

  if (isCSE || isAI) {
    const mainCourses = [
      'CS3223', // DNN
      'CS3201', // SE
      'CS3204', // PW
      'CS3206', // WW
      'HS3201'  // ITPD
    ];

    console.log(`Auto-enrolling student ${studentId} (${enrollmentId}) in ${mainCourses.join(', ')}`);

    for (const code of mainCourses) {
      try {
        // Get course ID
        const courseRes = await db.query('SELECT id FROM courses WHERE code = $1', [code]);
        if (courseRes.rows.length === 0) {
          console.warn(`Course ${code} not found, skipping enrollment.`);
          continue;
        }

        const courseId = courseRes.rows[0].id;

        // Check if already enrolled
        const exists = await db.query(
          'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
          [studentId, courseId]
        );

        if (exists.rows.length === 0) {
          await db.query(
            'INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, $3)',
            [studentId, courseId, 'active']
          );
        }
      } catch (err) {
        console.error(`Error enrolling student ${studentId} in course ${code}:`, err.message);
      }
    }
  }
}

module.exports = { autoEnrollStudent };
