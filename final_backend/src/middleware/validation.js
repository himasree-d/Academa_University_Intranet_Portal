const { body, validationResult } = require('express-validator');

// User validation rules
const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'faculty', 'admin']).withMessage('Invalid role')
];

// Course validation
const validateCourse = [
  body('code').notEmpty().withMessage('Course code is required'),
  body('name').notEmpty().withMessage('Course name is required'),
  body('credits').isInt({ min: 1, max: 4 }).withMessage('Credits must be between 1 and 4')
];

// Assignment validation
const validateAssignment = [
  body('title').notEmpty().withMessage('Title is required'),
  body('due_date').isDate().withMessage('Valid due date required'),
  body('total_marks').isInt({ min: 1 }).withMessage('Valid marks required')
];

// Submission validation
const validateSubmission = [
  body('assignment_id').isInt().withMessage('Valid assignment ID required')
];

// Login validation
const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Validation result handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateUser,
  validateCourse,
  validateAssignment,
  validateSubmission,
  validateLogin,
  handleValidation
};