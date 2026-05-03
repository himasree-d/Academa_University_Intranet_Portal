import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAward, FiAlertCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import ThemeToggle from '../../components/common/ThemeToggle';

const API = 'http://localhost:5001/api';

const DEPARTMENTS = ['CSE','AI','Mechatronics','Biotechnology','ECE','ECM','Civil','Mechanical','Computational Mathematics','Computational Biology'];

const RegisterPage = () => {
  const [step, setStep]             = useState(1);
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [otp, setOtp]               = useState(['','','','','','']);
  const [resendTimer, setResendTimer] = useState(0);
  const [form, setForm] = useState({
    name:'', email:'', password:'', confirmPassword:'',
    role:'student', department:'CSE', branch:'CSE',
    batch: new Date().getFullYear().toString(),
    enrollment_id:'', designation:''
  });
  const navigate = useNavigate();

  const handleChange = e => { setForm({...form,[e.target.name]:e.target.value}); if(error) setError(''); };

  const handleSendOTP = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API}/auth/send-otp`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name:form.name, email:form.email, password:form.password,
          role:form.role, department:form.department, branch:form.branch,
          batch:form.batch, enrollment_id:form.enrollment_id, designation:form.designation })
      });
      const data = await res.json();
      if (!data.success) return setError(data.message);
      setSuccess(data.message); setStep(2); startTimer();
    } catch(e) { setError('Failed to send OTP. Check your connection.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async e => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length < 6) return setError('Enter the complete 6-digit OTP');
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API}/auth/verify-otp`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email:form.email, otp:otpStr })
      });
      const data = await res.json();
      if (!data.success) return setError(data.message);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      setSuccess('Account created! Redirecting...');
      setTimeout(() => {
        const r = data.data.user.role;
        navigate(r==='faculty'?'/faculty/dashboard':r==='admin'?'/admin/dashboard':'/student/dashboard');
      }, 1500);
    } catch(e) { setError('Verification failed. Try again.'); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const res  = await fetch(`${API}/auth/resend-otp`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email:form.email })
      });
      const data = await res.json();
      if (!data.success) return setError(data.message);
      setSuccess('New OTP sent!'); setOtp(['','','','','','']); startTimer();
    } catch(e) { setError('Failed to resend OTP'); }
    finally { setLoading(false); }
  };

  const startTimer = () => {
    setResendTimer(60);
    const iv = setInterval(() => setResendTimer(p => { if(p<=1){clearInterval(iv);return 0;} return p-1; }), 1000);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...otp]; n[i] = val.slice(-1); setOtp(n);
    if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
  };
  const handleOtpKeyDown = (i, e) => { if(e.key==='Backspace' && !otp[i] && i>0) document.getElementById(`otp-${i-1}`)?.focus(); };
  const handleOtpPaste = e => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    const n = [...otp]; p.split('').forEach((d,i)=>{ if(i<6) n[i]=d; }); setOtp(n);
    document.getElementById(`otp-${Math.min(p.length,5)}`)?.focus();
  };

  const s = {
    page: {minHeight:'100vh',backgroundImage:'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url("assets/images/bg.jpeg")',backgroundSize:'cover',backgroundPosition:'center',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'},
    grid: {display:'grid',gridTemplateColumns:'1fr 1fr',maxWidth:'1200px',width:'100%',background:'var(--bg-secondary)',borderRadius:'30px',overflow:'hidden',boxShadow:'var(--card-shadow)',position:'relative'},
    left: {background:'#1a2639',padding:'60px 40px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'},
    right: {padding:'40px 50px',display:'flex',alignItems:'center',justifyContent:'center',overflowY:'auto',maxHeight:'100vh'},
    form: {width:'100%',maxWidth:'420px'},
    title: {fontSize:'28px',fontWeight:'600',color:'var(--text-primary)',marginBottom:'6px'},
    sub: {color:'var(--text-secondary)',fontSize:'14px',marginBottom:'24px'},
    err: {display:'flex',alignItems:'center',gap:'8px',padding:'11px 15px',borderRadius:'11px',marginBottom:'16px',fontSize:'13px',background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626'},
    ok:  {display:'flex',alignItems:'center',gap:'8px',padding:'11px 15px',borderRadius:'11px',marginBottom:'16px',fontSize:'13px',background:'#f0fdf4',border:'1px solid #bbf7d0',color:'#15803d'},
    grp: {marginBottom:'15px'},
    lbl: {display:'block',fontSize:'13px',fontWeight:'500',color:'#334155',marginBottom:'7px'},
    inpWrap: {position:'relative',display:'flex',alignItems:'center'},
    inp: {width:'100%',padding:'12px 42px',border:'1px solid var(--border-color)',borderRadius:'11px',fontSize:'14px',outline:'none',background:'var(--bg-tertiary)',color:'var(--text-primary)',boxSizing:'border-box',transition:'border 0.2s'},
    inpSm: {width:'100%',padding:'12px 14px',border:'1px solid var(--border-color)',borderRadius:'11px',fontSize:'14px',outline:'none',background:'var(--bg-tertiary)',color:'var(--text-primary)',boxSizing:'border-box'},
    icon: {position:'absolute',left:'13px',color:'var(--text-muted)',fontSize:'17px',pointerEvents:'none'},
    toggle: {position:'absolute',right:'13px',background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:'17px',display:'flex',alignItems:'center'},
    sel: {width:'100%',padding:'12px 14px',border:'1px solid var(--border-color)',borderRadius:'11px',fontSize:'14px',outline:'none',background:'var(--bg-tertiary)',color:'var(--text-primary)',cursor:'pointer'},
    row2: {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'},
    btn: {width:'100%',padding:'13px',background:'var(--accent-primary)',color:'white',border:'none',borderRadius:'11px',fontSize:'15px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginTop:'6px',transition:'all 0.2s'},
    foot: {textAlign:'center',color:'var(--text-secondary)',fontSize:'13px',marginTop:'14px'},
    lnk: {color:'var(--text-primary)',textDecoration:'none',fontWeight:'600',marginLeft:'4px'},
    otpRow: {display:'flex',gap:'10px',justifyContent:'center',marginBottom:'24px'},
    otpBox: {width:'50px',height:'58px',fontSize:'24px',fontWeight:'700',textAlign:'center',border:'2px solid var(--border-color)',borderRadius:'12px',outline:'none',color:'var(--text-primary)',transition:'border 0.2s'},
    backBtn: {background:'none',border:'none',color:'#2563eb',fontSize:'13px',cursor:'pointer',marginBottom:'8px',display:'inline-flex',alignItems:'center',gap:'4px'},
  };

  return (
    <div style={s.page}>
      <div style={s.grid}>
        {/* Left */}
        <div style={s.left}>
          <div style={{display:'flex',alignItems:'center',fontSize:'36px',fontWeight:'700',color:'white',marginBottom:'28px'}}>
            <FiAward style={{color:'var(--accent-primary)', marginRight:'8px'}}/>Acad<span style={{color:'var(--accent-primary)'}}>ema</span>
          </div>
          <img src="/assets/images/image.png" alt="" onError={e=>e.target.style.display='none'}
            style={{width:'100%',height:'240px',objectFit:'contain',borderRadius:'16px',marginBottom:'24px',border:'1px solid rgba(255,255,255,0.1)'}}/>
          <p style={{color:'#e5e9f0',fontSize:'15px',lineHeight:'1.7',textAlign:'center'}}>
            {step===1 ? 'Join Academa — your complete university portal for courses, assignments, grades and more.' :
             `We've sent a 6-digit OTP to\n${form.email}\n\nEnter it to verify your email and create your account.`}
          </p>
        </div>

        {/* Right */}
        <div style={s.right}>
          <div style={s.form}>

            {/* ── STEP 1: Registration Form ── */}
            {step===1 && <>
              <h1 style={s.title}>Create Account</h1>
              <p style={s.sub}>Fill in your details to register</p>
              {error   && <div style={s.err}><FiAlertCircle/>{error}</div>}
              {success && <div style={s.ok}><FiCheckCircle/>{success}</div>}

              <form onSubmit={handleSendOTP}>
                <div style={s.grp}>
                  <label style={s.lbl}>I am a</label>
                  <select name="role" value={form.role} onChange={handleChange} style={s.sel}>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>

                <div style={s.grp}>
                  <label style={s.lbl}>Full Name *</label>
                  <div style={s.inpWrap}>
                    <FiUser style={s.icon}/>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" style={s.inp}
                      onFocus={e=>e.target.style.borderColor='var(--accent-primary)'} onBlur={e=>e.target.style.borderColor='var(--border-color)'}/>
                  </div>
                </div>

                <div style={s.grp}>
                  <label style={s.lbl}>Email Address *</label>
                  <div style={s.inpWrap}>
                    <FiMail style={s.icon}/>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter email address" style={s.inp}
                      onFocus={e=>e.target.style.borderColor='var(--accent-primary)'} onBlur={e=>e.target.style.borderColor='var(--border-color)'}/>
                  </div>
                </div>

                <div style={s.row2}>
                  <div style={s.grp}>
                    <label style={s.lbl}>Password *</label>
                    <div style={s.inpWrap}>
                      <FiLock style={s.icon}/>
                      <input name="password" type={showPass?'text':'password'} value={form.password} onChange={handleChange} required placeholder="Min 6 chars" style={s.inp}
                        onFocus={e=>e.target.style.borderColor='var(--accent-primary)'} onBlur={e=>e.target.style.borderColor='var(--border-color)'}/>
                      <button type="button" style={s.toggle} onClick={()=>setShowPass(!showPass)}>{showPass?<FiEyeOff/>:<FiEye/>}</button>
                    </div>
                  </div>
                  <div style={s.grp}>
                    <label style={s.lbl}>Confirm *</label>
                    <div style={s.inpWrap}>
                      <FiLock style={s.icon}/>
                      <input name="confirmPassword" type={showConfirm?'text':'password'} value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat" style={s.inp}
                        onFocus={e=>e.target.style.borderColor='var(--accent-primary)'} onBlur={e=>e.target.style.borderColor='var(--border-color)'}/>
                      <button type="button" style={s.toggle} onClick={()=>setShowConfirm(!showConfirm)}>{showConfirm?<FiEyeOff/>:<FiEye/>}</button>
                    </div>
                  </div>
                </div>

                <div style={s.row2}>
                  <div style={s.grp}>
                    <label style={s.lbl}>Department *</label>
                    <select name="department" value={form.department} onChange={e=>{setForm(p=>({...p,department:e.target.value,branch:e.target.value}));}} style={s.sel}>
                      {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  {form.role==='student' && (
                    <div style={s.grp}>
                      <label style={s.lbl}>Batch (Year)</label>
                      <input name="batch" value={form.batch} onChange={handleChange} placeholder="2023" style={s.inpSm}
                        onFocus={e=>e.target.style.borderColor='var(--accent-primary)'} onBlur={e=>e.target.style.borderColor='var(--border-color)'}/>
                    </div>
                  )}
                  {form.role==='faculty' && (
                    <div style={s.grp}>
                      <label style={s.lbl}>Designation</label>
                      <input name="designation" value={form.designation} onChange={handleChange} placeholder="Professor" style={s.inpSm}
                        onFocus={e=>e.target.style.borderColor='var(--accent-primary)'} onBlur={e=>e.target.style.borderColor='var(--border-color)'}/>
                    </div>
                  )}
                </div>

                {form.role==='student' && (
                  <div style={s.grp}>
                    <label style={s.lbl}>Enrollment ID</label>
                    <input name="enrollment_id" value={form.enrollment_id} onChange={handleChange} placeholder="Enrollment ID" style={s.inpSm}
                      onFocus={e=>e.target.style.borderColor='var(--accent-primary)'} onBlur={e=>e.target.style.borderColor='var(--border-color)'}/>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{...s.btn, background:loading?'#ccc':'var(--accent-primary)', cursor:loading?'not-allowed':'pointer'}}
                  onMouseEnter={e=>{if(!loading)e.currentTarget.style.background='var(--accent-hover)';}}
                  onMouseLeave={e=>{if(!loading)e.currentTarget.style.background='var(--accent-primary)';}}>
                  {loading ? 'Sending OTP...' : <>'Send OTP to Email' <FiArrowRight/></>}
                </button>
              </form>
              <p style={s.foot}>Already have an account?<Link to="/login" style={s.lnk}>Sign in</Link></p>
            </>}

            {/* ── STEP 2: OTP Verification ── */}
            {step===2 && <>
              <button style={s.backBtn} onClick={()=>{setStep(1);setError('');setSuccess('');setOtp(['','','','','','']);}}>← Back</button>
              <h1 style={s.title}>Verify Your Email</h1>
              <p style={s.sub}>OTP sent to <strong>{form.email}</strong></p>
              {error   && <div style={s.err}><FiAlertCircle/>{error}</div>}
              {success && <div style={s.ok}><FiCheckCircle/>{success}</div>}

              <form onSubmit={handleVerifyOTP}>
                <div style={s.otpRow} onPaste={handleOtpPaste}>
                  {otp.map((digit,i) => (
                    <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e=>handleOtpChange(i,e.target.value)}
                      onKeyDown={e=>handleOtpKeyDown(i,e)}
                      style={{...s.otpBox, borderColor:digit?'var(--accent-primary)':'var(--border-color)'}}
                      onFocus={e=>e.target.style.borderColor='var(--accent-primary)'}
                      onBlur={e=>e.target.style.borderColor=digit?'var(--accent-primary)':'var(--border-color)'}/>
                  ))}
                </div>
                <button type="submit" disabled={loading}
                  style={{...s.btn, background:loading?'#ccc':'var(--accent-primary)', cursor:loading?'not-allowed':'pointer'}}>
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>
              </form>

              <div style={{textAlign:'center',marginTop:'18px',fontSize:'13px',color:'var(--text-secondary)'}}>
                Didn't get OTP?{' '}
                {resendTimer>0
                  ? <span style={{color:'var(--text-muted)'}}>Resend in {resendTimer}s</span>
                  : <button onClick={handleResend} disabled={loading}
                      style={{background:'none',border:'none',color:'var(--accent-primary)',fontWeight:'600',cursor:'pointer',fontSize:'13px'}}>
                      Resend OTP
                    </button>
                }
              </div>

              <div style={{marginTop:'16px',padding:'12px 16px',background:'#f0fdf4',borderRadius:'10px',fontSize:'12px',color:'#15803d',lineHeight:'1.6'}}>
                ✅ After creating your account, admin will verify and assign your courses. You'll be able to see your timetable and courses after that.
              </div>
            </>}

          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
