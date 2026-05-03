// Email validation
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Password validation (min 8 chars, at least one number, one uppercase, one lowercase)
  export const isValidPassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  };
  
  // Phone number validation (10 digits)
  export const isValidPhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };
  
  // Enrollment ID validation (e.g., 2023CS001)
  export const isValidEnrollment = (enrollment) => {
    const re = /^\d{4}[A-Z]{2}\d{3}$/;
    return re.test(enrollment);
  };
  
  // Course code validation (e.g., CS201)
  export const isValidCourseCode = (code) => {
    const re = /^[A-Z]{2}\d{3}$/;
    return re.test(code);
  };
  
  // URL validation
  export const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  // Required field validation
  export const isRequired = (value) => {
    return value && value.trim().length > 0;
  };
  
  // Min length validation
  export const minLength = (value, min) => {
    return value && value.length >= min;
  };
  
  // Max length validation
  export const maxLength = (value, max) => {
    return !value || value.length <= max;
  };
  
  // Number range validation
  export const isInRange = (value, min, max) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  };
  
  // File size validation (in MB)
  export const isValidFileSize = (file, maxSizeMB) => {
    return file.size <= maxSizeMB * 1024 * 1024;
  };
  
  // File type validation
  export const isValidFileType = (file, allowedTypes) => {
    const ext = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(ext);
  };