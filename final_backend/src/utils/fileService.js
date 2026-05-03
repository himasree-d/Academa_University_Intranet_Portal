const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure directory exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Generate unique filename
const generateUniqueFilename = (originalname) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalname);
  const basename = path.basename(originalname, ext);
  return `${basename}-${timestamp}-${randomString}${ext}`;
};

// Get file size in readable format
const getReadableFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on mime type
const getFileIcon = (mimetype) => {
  const icons = {
    'application/pdf': 'pdf',
    'application/msword': 'word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
    'application/vnd.ms-excel': 'excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
    'application/vnd.ms-powerpoint': 'powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'powerpoint',
    'text/plain': 'text',
    'text/x-c': 'code',
    'text/x-c++': 'code',
    'text/x-python': 'code',
    'text/x-java': 'code',
    'application/zip': 'archive',
    'application/x-rar-compressed': 'archive',
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image'
  };
  return icons[mimetype] || 'file';
};

// Get file type category
const getFileCategory = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('text/')) return 'text';
  if (mimetype.includes('pdf')) return 'document';
  if (mimetype.includes('word')) return 'document';
  if (mimetype.includes('excel')) return 'spreadsheet';
  if (mimetype.includes('powerpoint')) return 'presentation';
  if (mimetype.includes('zip') || mimetype.includes('rar')) return 'archive';
  if (mimetype.includes('c++') || mimetype.includes('python') || mimetype.includes('java')) return 'code';
  return 'other';
};

// Validate file type
const isValidFileType = (mimetype, allowedTypes) => {
  return allowedTypes.includes(mimetype);
};

// Delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Move file
const moveFile = (sourcePath, destinationPath) => {
  try {
    ensureDir(path.dirname(destinationPath));
    fs.renameSync(sourcePath, destinationPath);
    return true;
  } catch (error) {
    console.error('Error moving file:', error);
    return false;
  }
};

// Copy file
const copyFile = (sourcePath, destinationPath) => {
  try {
    ensureDir(path.dirname(destinationPath));
    fs.copyFileSync(sourcePath, destinationPath);
    return true;
  } catch (error) {
    console.error('Error copying file:', error);
    return false;
  }
};

// Get file stats
const getFileStats = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      readableSize: getReadableFileSize(stats.size),
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    console.error('Error getting file stats:', error);
    return null;
  }
};

// List files in directory
const listFiles = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    
    const files = fs.readdirSync(dirPath);
    return files.map(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        size: stats.size,
        readableSize: getReadableFileSize(stats.size),
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      };
    });
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};

// Create directory for course materials
const createCourseDirectory = (courseId) => {
  const dirPath = path.join(__dirname, '../../uploads/materials', `course-${courseId}`);
  ensureDir(dirPath);
  return dirPath;
};

// Create directory for assignment submissions
const createAssignmentDirectory = (assignmentId) => {
  const dirPath = path.join(__dirname, '../../uploads/assignments', `assignment-${assignmentId}`);
  ensureDir(dirPath);
  return dirPath;
};

// Create directory for user avatars
const createAvatarDirectory = (userId) => {
  const dirPath = path.join(__dirname, '../../uploads/avatars', `user-${userId}`);
  ensureDir(dirPath);
  return dirPath;
};

// Clean up old files (older than specified days)
const cleanupOldFiles = (dirPath, daysOld = 30) => {
  try {
    if (!fs.existsSync(dirPath)) return 0;
    
    const files = fs.readdirSync(dirPath);
    const now = Date.now();
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      const fileAge = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24); // age in days
      
      if (fileAge > daysOld) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up files:', error);
    return 0;
  }
};

module.exports = {
  ensureDir,
  generateUniqueFilename,
  getReadableFileSize,
  getFileIcon,
  getFileCategory,
  isValidFileType,
  deleteFile,
  moveFile,
  copyFile,
  getFileStats,
  listFiles,
  createCourseDirectory,
  createAssignmentDirectory,
  createAvatarDirectory,
  cleanupOldFiles
};