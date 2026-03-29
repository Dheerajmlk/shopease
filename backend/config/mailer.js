const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your login password)
  },
});

const sendResetEmail = async (toEmail, resetLink, userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #131921 0%, #232f3e 100%); padding: 30px 32px; text-align: center; }
        .logo-shop { color: #fff; font-size: 28px; font-weight: 800; }
        .logo-ease { color: #f08804; font-size: 28px; font-weight: 800; }
        .body { padding: 36px 32px; }
        h2 { color: #0f1111; font-size: 22px; margin: 0 0 12px; }
        p { color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
        .btn { display: inline-block; background: linear-gradient(180deg, #f7dfa5 0%, #f0c14b 100%); color: #0f1111; text-decoration: none; padding: 13px 36px; border-radius: 8px; font-weight: 700; font-size: 15px; border: 1px solid #a88734; margin: 8px 0 20px; }
        .link-box { background: #f7f7f7; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px 16px; word-break: break-all; font-size: 13px; color: #007185; margin-bottom: 20px; }
        .footer { background: #f7f7f7; padding: 20px 32px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        .warning { background: #fff8e1; border-left: 4px solid #f0c14b; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #555; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="logo-shop">Shop</span><span class="logo-ease">Ease</span>
          <p style="color:#ccc;font-size:13px;margin:6px 0 0;">Password Reset Request</p>
        </div>
        <div class="body">
          <h2>Hi ${userName}, 👋</h2>
          <p>We received a request to reset the password for your <strong>ShopEase</strong> account associated with <strong>${toEmail}</strong>.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align:center">
            <a href="${resetLink}" class="btn">Reset My Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <div class="link-box">${resetLink}</div>
          <div class="warning">
            ⏰ This link will expire in <strong>15 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.
          </div>
          <p style="font-size:13px;color:#999;">For security, this link can only be used once.</p>
        </div>
        <div class="footer">
          © 2024 ShopEase &nbsp;|&nbsp; This is an automated message, please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Your ShopEase Password",
    html,
  });
};

module.exports = { sendResetEmail };
