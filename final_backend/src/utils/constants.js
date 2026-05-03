module.exports = {
    // User roles
    ROLES: {
      STUDENT: 'student',
      FACULTY: 'faculty',
      ADMIN: 'admin'
    },
  
    // Course status
    COURSE_STATUS: {
      ACTIVE: 'active',
      COMPLETED: 'completed',
      ARCHIVED: 'archived'
    },
  
    // Enrollment status
    ENROLLMENT_STATUS: {
      ACTIVE: 'active',
      DROPPED: 'dropped',
      COMPLETED: 'completed'
    },
  
    // Submission status
    SUBMISSION_STATUS: {
      SUBMITTED: 'submitted',
      LATE: 'late',
      GRADED: 'graded'
    },
  
    // Announcement priority
    ANNOUNCEMENT_PRIORITY: {
      NORMAL: 'normal',
      IMPORTANT: 'important',
      URGENT: 'urgent'
    },
  
    // Announcement target
    ANNOUNCEMENT_TARGET: {
      ALL: 'all',
      STUDENTS: 'students',
      FACULTY: 'faculty',
      COURSE: 'course'
    },
  
    // Notification types
    NOTIFICATION_TYPES: {
      ASSIGNMENT: 'assignment',
      GRADE: 'grade',
      ANNOUNCEMENT: 'announcement',
      MESSAGE: 'message'
    },
  
    // Grade to GPA mapping (10-point scale)
    GRADE_TO_GPA: {
      'A+': 10.0,
      'A': 9.0,
      'B+': 8.0,
      'B': 7.0,
      'C+': 6.0,
      'C': 5.0,
      'D': 4.0,
      'F': 0.0
    },
  
    // GPA to grade mapping
    GPA_TO_GRADE: (gpa) => {
      if (gpa >= 9.0) return 'A';
      if (gpa >= 8.0) return 'B+';
      if (gpa >= 7.0) return 'B';
      if (gpa >= 6.0) return 'C+';
      if (gpa >= 5.0) return 'C';
      if (gpa >= 4.0) return 'D';
      return 'F';
    },
  
    // File size limits (in bytes)
    FILE_LIMITS: {
      ASSIGNMENT: 10 * 1024 * 1024, // 10MB
      MATERIAL: 50 * 1024 * 1024,    // 50MB
      AVATAR: 2 * 1024 * 1024        // 2MB
    },
  
    // Allowed file types
    ALLOWED_FILE_TYPES: {
      ASSIGNMENT: ['pdf', 'doc', 'docx', 'zip', 'c', 'cpp', 'py', 'java'],
      MATERIAL: ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'zip'],
      AVATAR: ['jpg', 'jpeg', 'png']
    },
  
    // Pagination defaults
    PAGINATION: {
      DEFAULT_LIMIT: 20,
      MAX_LIMIT: 100
    },
  
    // Cache durations (in seconds)
    CACHE_DURATION: {
      SHORT: 60,           // 1 minute
      MEDIUM: 300,         // 5 minutes
      LONG: 3600,          // 1 hour
      VERY_LONG: 86400     // 1 day
    }
  };