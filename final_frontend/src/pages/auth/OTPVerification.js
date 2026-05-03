import React, { useState, useRef, useEffect } from 'react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const OTPVerification = ({ email, onVerify, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (otpValue) => {
    onVerify(otpValue);
  };

  const handleResend = () => {
    if (canResend) {
      console.log('Resending OTP to:', email);
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      maxWidth: '1000px',
      width: '100%',
      background: 'var(--bg-secondary)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    imageSide: {
      background: 'linear-gradient(135deg, #4cc9f0, var(--accent-primary))',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    imageContent: {
      textAlign: 'center',
      color: 'white'
    },
    imageIcon: {
      fontSize: '80px',
      marginBottom: '20px'
    },
    imageTitle: {
      fontSize: '28px',
      marginBottom: '10px',
      fontWeight: '700'
    },
    imageText: {
      fontSize: '16px',
      opacity: 0.9
    },
    formSide: {
      padding: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      marginBottom: '30px',
      fontSize: '14px',
      padding: '5px 0'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '24px',
      color: 'var(--text-primary)',
      marginBottom: '10px'
    },
    description: {
      color: 'var(--text-secondary)',
      fontSize: '14px',
      lineHeight: '1.6'
    },
    emailHighlight: {
      color: 'var(--accent-primary)',
      fontWeight: '600',
      fontSize: '16px'
    },
    otpContainer: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      margin: '30px 0'
    },
    otpInput: {
      width: '50px',
      height: '50px',
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: '600',
      border: '2px solid var(--border-color)',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s'
    },
    timerText: {
      textAlign: 'center',
      margin: '20px 0',
      color: 'var(--text-secondary)',
      fontSize: '14px'
    },
    timer: {
      color: 'var(--accent-primary)',
      fontWeight: '600'
    },
    resendButton: {
      width: '100%',
      padding: '12px',
      background: canResend ? 'var(--accent-primary)' : '#e0e0e0',
      color: canResend ? 'white' : '#999',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: canResend ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* Left side */}
        <div style={styles.imageSide}>
          <div style={styles.imageContent}>
            <FiMail style={styles.imageIcon} />
            <h2 style={styles.imageTitle}>Verify Email</h2>
            <p style={styles.imageText}>Enter the OTP sent to your email</p>
          </div>
        </div>

        {/* Right side */}
        <div style={styles.formSide}>
          <div style={styles.formContainer}>
            <button onClick={onBack} style={styles.backButton}>
              <FiArrowLeft /> Back
            </button>

            <div style={styles.header}>
              <h1 style={styles.title}>OTP Verification</h1>
              <p style={styles.description}>
                We've sent a verification code to<br />
                <span style={styles.emailHighlight}>{email}</span>
              </p>
            </div>

            <div style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={{
                    ...styles.otpInput,
                    borderColor: digit ? 'var(--accent-primary)' : 'var(--border-color)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.target.style.borderColor = digit ? 'var(--accent-primary)' : '#e0e0e0'}
                />
              ))}
            </div>

            <div style={styles.timerText}>
              {timer > 0 ? (
                <p>Resend code in <span style={styles.timer}>{timer}s</span></p>
              ) : (
                <p>Didn't receive the code?</p>
              )}
            </div>

            <button 
              onClick={handleResend}
              disabled={!canResend}
              style={styles.resendButton}
              onMouseEnter={(e) => {
                if (canResend) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 5px 15px rgba(67, 97, 238, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;