import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const PrivateRoute = ({ children, role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    switch (user.role) {
      case 'student': return <Navigate to="/student/dashboard" replace />;
      case 'faculty': return <Navigate to="/faculty/dashboard" replace />;
      case 'admin': return <Navigate to="/admin/dashboard" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar userRole={user.role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.1)',
            backdropFilter: 'blur(2px)',
            zIndex: 1000,
            display: window.innerWidth < 1024 ? 'block' : 'none'
          }}
        />
      )}

      <div 
        onClick={() => { if(isSidebarOpen) setIsSidebarOpen(false); }}
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minWidth: 0,
          transition: 'all 0.3s ease'
        }}>
        <Header 
          userRole={user.role} 
          userName={user.name} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <main style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default PrivateRoute;
