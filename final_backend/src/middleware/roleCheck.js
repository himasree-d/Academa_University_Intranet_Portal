// Check if user has required role
const hasRole = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Required role: ${roles.join(' or ')}` 
        });
      }
  
      next();
    };
  };
  
  // Check if user is student
  const isStudent = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
  
    if (req.user.role !== 'student') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Student access only.' 
      });
    }
  
    next();
  };
  
  // Check if user is faculty
  const isFaculty = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
  
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Faculty access only.' 
      });
    }
  
    next();
  };
  
  // Check if user is admin
  const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
  
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin access only.' 
      });
    }
  
    next();
  };
  
  // Check if user is faculty or admin
  const isFacultyOrAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
  
    if (!['faculty', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Faculty or admin access only.' 
      });
    }
  
    next();
  };
  
  // Check if user owns the resource or is admin
  const isOwnerOrAdmin = (resourceUserId) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }
  
      if (req.user.id !== resourceUserId && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You do not own this resource.' 
        });
      }
  
      next();
    };
  };
  
  module.exports = {
    hasRole,
    isStudent,
    isFaculty,
    isAdmin,
    isFacultyOrAdmin,
    isOwnerOrAdmin
  };