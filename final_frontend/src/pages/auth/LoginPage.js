import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAward, FiAlertCircle } from 'react-icons/fi';
import { useAuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../../components/common/ThemeToggle';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userData = await login(formData.email, formData.password);
      const role = userData?.role;
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'faculty') navigate('/faculty/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("assets/images/bg.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      maxWidth: '1300px',
      width: '100%',
      background: 'var(--bg-secondary)',
      borderRadius: '30px',
      overflow: 'hidden',
      boxShadow: 'var(--card-shadow)',
      position: 'relative'
    },
    imageSide: {
      background: '#1a2639',
      padding: '60px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    imageContent: { textAlign: 'center', color: 'white', zIndex: 1 },
    logo: {
      fontSize: '48px',
      fontWeight: '700',
      marginBottom: '40px',
      letterSpacing: '-0.5px',
      color: 'white'
    },
    logoDot: { color: 'var(--accent-primary)', fontSize: '52px', fontWeight: '700' },
    imagePlaceholder: {
      width: '100%',
      height: '280px',
      background: '#2a374f',
      borderRadius: '20px',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #4a5a77',
      fontSize: '18px',
      color: '#a0b3d9'
    },
    imageText: { fontSize: '18px', lineHeight: '1.6', color: '#e5e9f0', marginBottom: '10px' },
    formSide: {
      padding: '60px 50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-secondary)'
    },
    formContainer: { width: '100%', maxWidth: '400px' },
    header: { marginBottom: '40px' },
    title: { fontSize: '36px', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: '600' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '18px' },
    formGroup: { marginBottom: '25px' },
    label: { display: 'block', marginBottom: '10px', fontWeight: '500', color: 'var(--text-primary)', fontSize: '16px' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    input: {
      width: '100%',
      padding: '16px 50px 16px 50px',
      border: '1px solid var(--border-color)',
      borderRadius: '14px',
      fontSize: '16px',
      transition: 'all 0.2s',
      outline: 'none',
      background: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      boxSizing: 'border-box'
    },
    inputIcon: { position: 'absolute', left: '18px', color: 'var(--text-muted)', fontSize: '20px', pointerEvents: 'none' },
    passwordToggle: {
      position: 'absolute',
      right: '18px',
      background: 'none',
      border: 'none',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      fontSize: '20px',
      padding: '0',
      display: 'flex',
      alignItems: 'center'
    },
    errorBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      padding: '12px 16px',
      marginBottom: '20px',
      color: '#dc2626',
      fontSize: '14px'
    },
    optionsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#475569',
      fontSize: '15px',
      cursor: 'pointer'
    },
    checkbox: { width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-primary)' },
    forgotLink: { color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' },
    button: {
      width: '100%',
      padding: '16px',
      background: loading ? '#ccc' : 'var(--accent-primary)',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      marginBottom: '25px'
    },
    footer: { textAlign: 'center', color: 'var(--text-secondary)', fontSize: '16px' },
    link: { color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '600', marginLeft: '6px', fontSize: '16px' }
  };

  return (
    <div style={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.grid}
      >
        {/* Left side */}
        <div style={styles.imageSide}>
          <div style={styles.imageContent}>
            <div style={{ ...styles.logo, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <FiAward style={{ fontSize: '48px', color: 'var(--accent-primary)' }} />
              <span>Acad<span style={styles.logoDot}>ema</span></span>
            </div>
            <img
              src="/assets/images/image.png"
              alt="Academa"
              style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '20px', marginBottom: '30px', border: '2px solid #4a5a77' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <p style={styles.imageText}>The platform where you get everything you want!</p>
          </div>
        </div>

        {/* Right side - Form */}
        <div style={styles.formSide}>
          <div style={styles.formContainer}>
            <div style={styles.header}>
              <h1 style={styles.title}>Welcome Back!</h1>
              <p style={styles.subtitle}>Please enter your details to sign in</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <FiAlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <FiMail style={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <FiLock style={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    required
                  />
                  <button type="button" style={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div style={styles.optionsRow}>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" style={styles.checkbox} /> Remember me
                </label>
                <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
              </div>

              <button
                type="submit"
                style={styles.button}
                disabled={loading}
                onMouseEnter={(e) => { if (!loading) { e.target.style.background = 'var(--accent-hover)'; e.target.style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={(e) => { if (!loading) { e.target.style.background = 'var(--accent-primary)'; e.target.style.transform = 'translateY(0)'; } }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p style={styles.footer}>
                Don't have an account?
                <Link to="/register" style={styles.link}>Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
