const API_BASE_URL = 'http://localhost:5001/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const apiCall = async (method, path, body = null) => {
  const options = { method, headers: getHeaders() };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return { data: data.data || data };
};

// Faculty APIs
export const fetchFacultyCourses = () => apiCall('GET', '/courses/my-courses');
export const fetchCourseSubmissions = (courseId) => apiCall('GET', `/submissions/course/${courseId}`);
export const createAssignment = (data) => apiCall('POST', '/assignments', data);
export const gradeSubmission = (id, data) => apiCall('PUT', `/submissions/${id}/grade`, data);
export const postAnnouncement = (data) => apiCall('POST', '/announcements', data);

// Materials - file upload uses FormData, handled separately
export const uploadMaterial = async (courseId, formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/materials`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Upload failed');
  return { data: data.data };
};

// Admin APIs
export const fetchUsers = () => apiCall('GET', '/users');
export const createUser = (data) => apiCall('POST', '/users', data);
export const updateUser = (id, data) => apiCall('PUT', `/users/${id}`, data);
export const deleteUser = (id) => apiCall('DELETE', `/users/${id}`);
export const fetchCourses = () => apiCall('GET', '/courses');
export const createCourse = (data) => apiCall('POST', '/courses', data);
export const updateCourse = (id, data) => apiCall('PUT', `/courses/${id}`, data);
export const deleteCourse = (id) => apiCall('DELETE', `/courses/${id}`);
export const fetchSystemStats = () => apiCall('GET', '/dashboard/stats');

// Student APIs
export const fetchStudentCourses = () => apiCall('GET', '/courses/my-courses');
export const fetchStudentAssignments = () => apiCall('GET', '/assignments/my-assignments');
export const fetchStudentGrades = () => apiCall('GET', '/grades/my-grades');
export const fetchAnnouncements = () => apiCall('GET', '/announcements');
export const fetchDashboardData = () => apiCall('GET', '/dashboard');

// Submission - file upload
export const submitAssignment = async (assignmentId, formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/submissions`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Submission failed');
  return { data: data.data };
};
