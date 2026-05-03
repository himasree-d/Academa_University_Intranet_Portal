import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiShield, FiCheckCircle, FiAlertCircle, FiChevronLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email) return setError('Please enter your email');
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setSuccess('OTP sent to your email!');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.otp.length !== 6) return setError('Please enter valid 6-digit OTP');
    
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp, newPassword: formData.newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Password updated successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const colors = { primary: '#7ea191', bg: '#fdfdfb', card: '#ffffff', text: '#2d3748', light: '#718096', border: '#e2e8f0' };

  const inputStyle = {
    width: '100%', padding: '14px 16px 14px 45px', border: `1px solid ${colors.border}`, borderRadius: '14px',
    fontSize: '15px', outline: 'none', transition: 'all 0.2s', background: '#f8fafc', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/assets/images/bg.jpeg")', backgroundSize:'cover', backgroundPosition:'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '450px', background: colors.card, borderRadius: '30px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: colors.primary, textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
          <FiChevronLeft /> Back to Login
        </Link>

        <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.text, marginBottom: '8px' }}>Reset Password</h1>
        <p style={{ color: colors.light, marginBottom: '32px' }}>{step === 1 ? 'Enter your email to receive a verification code' : 'Verify the code and set your new password'}</p>

        {error && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px', marginBottom: '20px', color: '#dc2626', fontSize: '14px' }}><FiAlertCircle />{error}</div>}
        {success && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px', marginBottom: '20px', color: '#15803d', fontSize: '14px' }}><FiCheckCircle />{success}</div>}

        <form onSubmit={step === 1 ? handleSendOTP : handleResetPassword}>
          {step === 1 ? (
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: colors.light, fontSize: '18px' }} />
              <input type="email" placeholder="University Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} required />
            </div>
          ) : (
            <>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <FiShield style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: colors.light, fontSize: '18px' }} />
                <input type="text" placeholder="6-digit OTP" value={formData.otp} onChange={e => setFormData({ ...formData, otp: e.target.value })} style={inputStyle} maxLength={6} required />
              </div>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: colors.light, fontSize: '18px' }} />
                <input type="password" placeholder="New Password" value={formData.newPassword} onChange={e => setFormData({ ...formData, newPassword: e.target.value })} style={inputStyle} required />
              </div>
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: colors.light, fontSize: '18px' }} />
                <input type="password" placeholder="Confirm New Password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} style={inputStyle} required />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: colors.primary, color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {loading ? 'Processing...' : step === 1 ? 'Send OTP' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
