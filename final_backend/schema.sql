-- ============================================================
-- ACADEMA LMS - Complete Database Schema v2
-- Run: psql -U himasree -d academa_lms -f schema.sql
-- ============================================================

-- Drop and recreate
DROP TABLE IF EXISTS otp_verifications CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS timetable_entries CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student','faculty','admin')),
    department VARCHAR(100),
    branch VARCHAR(100),
    batch VARCHAR(20),
    enrollment_id VARCHAR(50) UNIQUE,
    designation VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ── OTP VERIFICATIONS ────────────────────────────────────────
CREATE TABLE otp_verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    data JSONB NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ── COURSES ──────────────────────────────────────────────────
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    department VARCHAR(100),
    branch VARCHAR(100),
    course_type VARCHAR(20) DEFAULT 'core' CHECK (course_type IN ('core','elective','lab')),
    semester_number INTEGER,
    instructor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    semester VARCHAR(50),
    academic_year VARCHAR(20),
    schedule VARCHAR(200),
    room VARCHAR(50),
    max_students INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ── TIMETABLE ────────────────────────────────────────────────
CREATE TABLE timetable_entries (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')),
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    room VARCHAR(50),
    entry_type VARCHAR(10) DEFAULT 'lecture' CHECK (entry_type IN ('lecture','lab','tutorial')),
    branch VARCHAR(100),
    batch VARCHAR(20),
    semester_number INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ── ENROLLMENTS ──────────────────────────────────────────────
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','dropped','completed')),
    UNIQUE(student_id, course_id)
);

-- ── ASSIGNMENTS ──────────────────────────────────────────────
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP NOT NULL,
    due_time VARCHAR(10) DEFAULT '23:59',
    total_marks INTEGER DEFAULT 100,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ── SUBMISSIONS ──────────────────────────────────────────────
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted','graded','late')),
    grade INTEGER,
    feedback TEXT,
    graded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    graded_at TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- ── GRADES ───────────────────────────────────────────────────
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    internal_marks DECIMAL(5,2),
    external_marks DECIMAL(5,2),
    total_marks DECIMAL(5,2),
    grade VARCHAR(5),
    grade_point DECIMAL(3,1),
    semester VARCHAR(50),
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ── ANNOUNCEMENTS ────────────────────────────────────────────
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    is_global BOOLEAN DEFAULT false,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ── MATERIALS ────────────────────────────────────────────────
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    instructor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    file_type VARCHAR(50),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ── CHAT MESSAGES ────────────────────────────────────────────
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ── INDEXES ──────────────────────────────────────────────────
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_timetable_branch ON timetable_entries(branch, semester_number);
CREATE INDEX idx_chat_users ON chat_messages(sender_id, receiver_id);

-- ════════════════════════════════════════════════════════════
-- SEED DATA — one working demo set
-- Password for all: "password"
-- ════════════════════════════════════════════════════════════

INSERT INTO users (name,email,password_hash,role,department) VALUES
('Admin User','admin@academa.edu','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LDRVgtnzFtq','admin','Administration');

INSERT INTO users (name,email,password_hash,role,department,designation) VALUES
('Prof. Rajesh Kumar','rajesh@academa.edu','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LDRVgtnzFtq','faculty','CSE','Professor'),
('Dr. Priya Sharma','priya@academa.edu','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LDRVgtnzFtq','faculty','CSE','Associate Professor'),
('Prof. Amit Patel','amit@academa.edu','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LDRVgtnzFtq','faculty','CSE','Assistant Professor'),
('Dr. Sneha Reddy','sneha@academa.edu','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LDRVgtnzFtq','faculty','CSE','Assistant Professor');

INSERT INTO users (name,email,password_hash,role,department,branch,batch,enrollment_id,is_verified,email_verified) VALUES
('Arjun Kumar','arjun@academa.edu','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LDRVgtnzFtq','student','Engineering','CSE','2023','2023CS001',true,true),
('Priya Singh','priyasingh@academa.edu','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LDRVgtnzFtq','student','Engineering','CSE','2023','2023CS002',true,true),
('Rahul Sharma','rahul@academa.edu','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LDRVgtnzFtq','student','Engineering','AI','2023','2023AI001',true,true);

-- Courses
INSERT INTO courses (code,name,description,credits,department,branch,course_type,semester_number,instructor_id,semester,schedule,room) VALUES
('CS201','Data Structures & Algorithms','Fundamental data structures and algorithms',4,'Engineering','CSE','core',3,2,'Spring 2024','Mon/Wed/Fri 09:25 AM','ELT-2'),
('CS301','Database Management Systems','Relational databases and SQL',3,'Engineering','CSE','core',3,3,'Spring 2024','Tue/Thu 10:35 AM','ELT-6'),
('CS401','Computer Networks','Network protocols and architecture',3,'Engineering','CSE','core',3,4,'Spring 2024','Mon/Wed 01:35 PM','ELT-1'),
('CS202','Operating Systems','Process and memory management',4,'Engineering','CSE','core',3,5,'Spring 2024','Tue/Thu/Fri 03:50 PM','ECR-17'),
('AI201','Machine Learning','Supervised and unsupervised learning algorithms',4,'Engineering','AI','core',3,2,'Spring 2024','Mon/Wed/Fri 10:35 AM','ELT-3'),
('AI202','Deep Learning','Neural networks and deep architectures',3,'Engineering','AI','core',3,3,'Spring 2024','Tue/Thu 09:25 AM','ELT-4');

-- Timetable
INSERT INTO timetable_entries (course_id,day_of_week,start_time,end_time,room,entry_type,branch,batch,semester_number) VALUES
(1,'Monday','09:25','10:20','ELT-2','lecture','CSE','2023',3),
(1,'Wednesday','09:25','10:20','ELT-2','lecture','CSE','2023',3),
(1,'Friday','09:25','10:20','ELT-2','lecture','CSE','2023',3),
(2,'Tuesday','10:35','11:30','ELT-6','lecture','CSE','2023',3),
(2,'Thursday','10:35','11:30','ELT-6','lecture','CSE','2023',3),
(3,'Monday','13:35','14:30','ELT-1','lecture','CSE','2023',3),
(3,'Wednesday','13:35','14:30','ELT-1','lecture','CSE','2023',3),
(4,'Tuesday','15:50','16:45','ECR-17','lecture','CSE','2023',3),
(4,'Thursday','15:50','16:45','ECR-17','lecture','CSE','2023',3),
(4,'Friday','15:50','16:45','ECR-17','lecture','CSE','2023',3),
(5,'Monday','10:35','11:30','ELT-3','lecture','AI','2023',3),
(5,'Wednesday','10:35','11:30','ELT-3','lecture','AI','2023',3),
(5,'Friday','10:35','11:30','ELT-3','lecture','AI','2023',3),
(6,'Tuesday','09:25','10:20','ELT-4','lecture','AI','2023',3),
(6,'Thursday','09:25','10:20','ELT-4','lecture','AI','2023',3);

-- Enrollments
INSERT INTO enrollments (student_id,course_id) VALUES
(6,1),(6,2),(6,3),(6,4),
(7,1),(7,2),
(8,5),(8,6);

-- Assignments
INSERT INTO assignments (title,description,course_id,created_by,due_date,total_marks) VALUES
('Binary Tree Implementation','Implement a binary tree with traversals',1,2,NOW()+INTERVAL '7 days',100),
('SQL Query Optimization','Write optimized SQL queries',2,3,NOW()+INTERVAL '8 days',50),
('ML Classification Problem','Build a classifier using scikit-learn',5,2,NOW()+INTERVAL '10 days',100);

-- Announcements
INSERT INTO announcements (title,description,author_id,is_important,is_pinned,is_global) VALUES
('Welcome to Spring 2024 Semester!','Welcome all students! Classes begin Monday. Check your timetable for your schedule.',1,true,true,true),
('Assignment Submission Portal Open','The assignment submission portal is now active. Submit your assignments before the deadline.',1,true,false,true);

INSERT INTO announcements (title,description,author_id,course_id,is_important) VALUES
('Binary Tree Assignment Posted','Assignment 3 on Binary Trees is now live. Due in 7 days.',2,1,true),
('ML Project Guidelines','Project guidelines for the classification assignment have been uploaded.',2,5,true);

-- Materials
INSERT INTO materials (title,course_id,instructor_id,file_name,file_type,file_size) VALUES
('Lecture 1: Introduction to Algorithms',1,2,'lecture1_algorithms.pdf','pdf','2.4 MB'),
('Lecture 2: Arrays and Linked Lists',1,2,'lecture2_arrays.pdf','pdf','1.8 MB'),
('DBMS Lecture 1: Introduction',2,3,'dbms_intro.pdf','pdf','3.2 MB'),
('ML Lecture 1: Introduction to ML',5,2,'ml_intro.pdf','pdf','2.6 MB');

-- Grades
INSERT INTO grades (student_id,course_id,internal_marks,external_marks,total_marks,grade,grade_point,semester,academic_year) VALUES
(6,1,42,43,85,'A',9.0,'Spring 2024','2023-24'),
(6,2,45,44,89,'A',9.0,'Spring 2024','2023-24'),
(7,1,40,41,81,'A',9.0,'Spring 2024','2023-24'),
(8,5,43,44,87,'A',9.0,'Spring 2024','2023-24');

-- Fix passwords (run this after schema)
UPDATE users SET password_hash='$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LDRVgtnzFtq';

SELECT ' Schema setup complete!' AS status;
SELECT role, COUNT(*) FROM users GROUP BY role;
