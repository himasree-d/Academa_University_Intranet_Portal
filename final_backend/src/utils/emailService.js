const nodemailer = require('nodemailer');

// Works with ANY email provider - Gmail, Outlook, Yahoo, college SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false }
  });
};

const sendOTPEmail = async (email, otp, name) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `${otp} is your Academa OTP`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#2563eb;margin:0;font-size:28px;">Acad<span style="color:#d4a373;">ema</span></h1>
          <p style="color:#64748b;margin-top:4px;font-size:14px;">Learning Management System</p>
        </div>
        <div style="background:white;border-radius:12px;padding:28px;border:1px solid #e2e8f0;">
          <h2 style="color:#1e293b;margin-top:0;">Hello, ${name}! 👋</h2>
          <p style="color:#475569;line-height:1.6;">Use the OTP below to complete your registration. It is valid for <strong>10 minutes</strong>.</p>
          <div style="text-align:center;margin:28px 0;">
            <div style="display:inline-block;background:#f0f9ff;border:2px dashed #2563eb;border-radius:14px;padding:22px 48px;">
              <p style="margin:0;font-size:11px;color:#64748b;letter-spacing:2px;text-transform:uppercase;">Your OTP</p>
              <p style="margin:8px 0 0;font-size:46px;font-weight:800;letter-spacing:14px;color:#2563eb;">${otp}</p>
            </div>
          </div>
          <p style="color:#94a3b8;font-size:13px;text-align:center;margin-bottom:0;">
            Never share this OTP with anyone.<br/>
            If you didn't request this, please ignore this email.
          </p>
        </div>
        <p style="text-align:center;color:#cbd5e1;font-size:12px;margin-top:20px;">© ${new Date().getFullYear()} Academa LMS</p>
      </div>
    `,
  });
  console.log(`[Email] OTP ${otp} sent to ${email}`);
};

const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to Academa LMS!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
          <h1 style="color:#2563eb;">Welcome to Academa, ${user.name}! 🎉</h1>
          <p style="color:#475569;">Your account has been created successfully.</p>
          <p style="color:#475569;">Your role: <strong style="color:#1e293b;">${user.role}</strong></p>
          <p style="color:#475569;">You can now log in and start using the platform. Your account will be fully active once the admin assigns your courses.</p>
          <p style="color:#94a3b8;font-size:13px;">© ${new Date().getFullYear()} Academa LMS</p>
        </div>
      `,
    });
  } catch (e) {
    console.error('[Email] Welcome email failed:', e.message);
  }
};

module.exports = { sendOTPEmail, sendWelcomeEmail };
