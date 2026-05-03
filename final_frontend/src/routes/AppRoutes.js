import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPassword from '../pages/auth/ForgotPassword';

import StudentDashboard from '../pages/student/StudentDashboard';
import MyCourses from '../pages/student/MyCourses';
import CourseDetail from '../pages/student/CourseDetail';
import Assignments from '../pages/student/Assignments';
import AssignmentSubmission from '../pages/student/AssignmentSubmission';
import Grades from '../pages/student/Grades';
import Timetable from '../pages/student/Timetable';
import Calendar from '../pages/student/Calendar';
import Chat from '../pages/student/Chat';
import Documents from '../pages/student/Documents';
import Announcements from '../pages/student/Announcements';

import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import FacultyCourses from '../pages/faculty/FacultyCourses';
import CreateAssignment from '../pages/faculty/CreateAssignment';
import GradeAssignments from '../pages/faculty/GradeAssignments';
import SubmissionsList from '../pages/faculty/SubmissionsList';
import UploadMaterials from '../pages/faculty/UploadMaterials';
import PostAnnouncement from '../pages/faculty/PostAnnouncement';
import FacultyTimetable from '../pages/faculty/FacultyTimetable';
import CourseStudents from '../pages/faculty/CourseStudents';
import GlobalGrading from '../pages/faculty/GlobalGrading';

import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import UserVerification from '../pages/admin/UserVerification';
import CourseManagement from '../pages/admin/CourseManagement';
import SystemAnnouncements from '../pages/admin/SystemAnnouncements';
import PlatformStats from '../pages/admin/PlatformStats';
import DataImport from '../pages/admin/DataImport';

import Profile             from '../pages/common/Profile';
import Settings            from '../pages/common/Settings';
import Notifications       from '../pages/common/Notifications';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/student/dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
      <Route path="/student/my-courses" element={<PrivateRoute role="student"><MyCourses /></PrivateRoute>} />
      <Route path="/student/course/:id" element={<PrivateRoute role="student"><CourseDetail /></PrivateRoute>} />
      <Route path="/student/assignments" element={<PrivateRoute role="student"><Assignments /></PrivateRoute>} />
      <Route path="/student/assignment-submission/:id" element={<PrivateRoute role="student"><AssignmentSubmission /></PrivateRoute>} />
      <Route path="/student/grades" element={<PrivateRoute role="student"><Grades /></PrivateRoute>} />
      <Route path="/student/timetable" element={<PrivateRoute role="student"><Timetable /></PrivateRoute>} />
      <Route path="/student/calendar" element={<PrivateRoute role="student"><Calendar /></PrivateRoute>} />
      <Route path="/student/chat" element={<PrivateRoute role="student"><Chat /></PrivateRoute>} />
      <Route path="/student/documents" element={<PrivateRoute role="student"><Documents /></PrivateRoute>} />
      <Route path="/student/announcements" element={<PrivateRoute role="student"><Announcements /></PrivateRoute>} />

      <Route path="/faculty/dashboard" element={<PrivateRoute role="faculty"><FacultyDashboard /></PrivateRoute>} />
      <Route path="/faculty/courses" element={<PrivateRoute role="faculty"><FacultyCourses /></PrivateRoute>} />
      <Route path="/faculty/create-assignment" element={<PrivateRoute role="faculty"><CreateAssignment /></PrivateRoute>} />
      <Route path="/faculty/grade-assignments/:courseId" element={<PrivateRoute role="faculty"><GradeAssignments /></PrivateRoute>} />
      <Route path="/faculty/grade" element={<PrivateRoute role="faculty"><GlobalGrading /></PrivateRoute>} />
      <Route path="/faculty/submissions/:assignmentId" element={<PrivateRoute role="faculty"><SubmissionsList /></PrivateRoute>} />
      <Route path="/faculty/upload-materials" element={<PrivateRoute role="faculty"><UploadMaterials /></PrivateRoute>} />
      <Route path="/faculty/post-announcement" element={<PrivateRoute role="faculty"><PostAnnouncement /></PrivateRoute>} />
      <Route path="/faculty/timetable" element={<PrivateRoute role="faculty"><FacultyTimetable /></PrivateRoute>} />
      <Route path="/faculty/chat" element={<PrivateRoute role="faculty"><Chat /></PrivateRoute>} />
      <Route path="/faculty/course/:courseId/students" element={<PrivateRoute role="faculty"><CourseStudents /></PrivateRoute>} />

      <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/verify-users" element={<PrivateRoute role="admin"><UserVerification /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute role="admin"><UserManagement /></PrivateRoute>} />
      <Route path="/admin/courses" element={<PrivateRoute role="admin"><CourseManagement /></PrivateRoute>} />
      <Route path="/admin/announcements" element={<PrivateRoute role="admin"><SystemAnnouncements /></PrivateRoute>} />
      <Route path="/admin/stats" element={<PrivateRoute role="admin"><PlatformStats /></PrivateRoute>} />
      <Route path="/admin/import" element={<PrivateRoute role="admin"><DataImport /></PrivateRoute>} />

      {/* Shared Routes */}
      <Route path="/student/profile"  element={<PrivateRoute role="student"><Profile /></PrivateRoute>} />
      <Route path="/faculty/profile"  element={<PrivateRoute role="faculty"><Profile /></PrivateRoute>} />
      <Route path="/admin/profile"    element={<PrivateRoute role="admin"><Profile /></PrivateRoute>} />
      
      <Route path="/student/settings" element={<PrivateRoute role="student"><Settings /></PrivateRoute>} />
      <Route path="/faculty/settings" element={<PrivateRoute role="faculty"><Settings /></PrivateRoute>} />
      <Route path="/admin/settings"   element={<PrivateRoute role="admin"><Settings /></PrivateRoute>} />

      <Route path="/student/notifications"  element={<PrivateRoute role="student"><Notifications /></PrivateRoute>} />
      <Route path="/faculty/notifications"  element={<PrivateRoute role="faculty"><Notifications /></PrivateRoute>} />
      <Route path="/admin/notifications"    element={<PrivateRoute role="admin"><Notifications /></PrivateRoute>} />
    </Routes>
  </>
);

export default AppRoutes;
