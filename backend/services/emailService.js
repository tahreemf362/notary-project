import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    // Check if real email credentials are configured
    const hasEmailConfig = process.env.EMAIL_USER && 
                          process.env.EMAIL_USER !== 'your_email@gmail.com' &&
                          process.env.EMAIL_PASSWORD && 
                          process.env.EMAIL_PASSWORD !== 'your_app_specific_password';

    if (hasEmailConfig) {
      // Use real email configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      console.log('✅ Email Service: Using configured SMTP');
    } else {
      // Create test account for development
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        console.log('📧 Email Service: Using Ethereal test account');
        console.log('📧 Test Email User:', testAccount.user);
        console.log('📧 View emails at: https://ethereal.email/');
      } catch (error) {
        console.error('⚠️  Email Service: Could not create test account, emails will be logged only');
        // Create a dummy transporter that logs instead of sending
        this.transporter = {
          sendMail: async (mailOptions) => {
            console.log('📧 [EMAIL WOULD BE SENT]:');
            console.log('   To:', mailOptions.to);
            console.log('   Subject:', mailOptions.subject);
            return { messageId: 'logged-only-' + Date.now() };
          }
        };
      }
    }
  }

  async sendEmail(options) {
    // Wait for transporter to initialize if not ready
    if (!this.transporter) {
      await this.initializeTransporter();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Project-Nos <noreply@project-nos.com>',
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      
      // Log preview URL for Ethereal test emails
      if (info.messageId.includes('@ethereal.email')) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('📧 Preview email at:', previewUrl);
      }
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending email:', error.message);
      // Don't throw error - allow signup to continue even if email fails
      return { success: false, error: error.message };
    }
  }

  async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1d4ed8; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background-color: #1d4ed8; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Project-Nos!</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.name},</h2>
            <p>Thank you for registering with Project-Nos. Please verify your email address to complete your registration.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Project-Nos. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email - Project-Nos',
      html
    });
  }

  async sendPasswordResetEmail(user, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1d4ed8; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background-color: #1d4ed8; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 10px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.name},</h2>
            <p>We received a request to reset your password for your Project-Nos account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${resetUrl}</p>
            <div class="warning">
              <strong>Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request a password reset, please ignore this email</li>
                <li>Your password won't change until you create a new one</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2025 Project-Nos. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Project-Nos',
      html
    });
  }

  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1d4ed8; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Project-Nos!</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.name},</h2>
            <p>Your email has been verified successfully! Welcome to Project-Nos.</p>
            <p>You can now enjoy all the features of our platform, including:</p>
            <ul>
              <li>Online document notarization</li>
              <li>Audio and video signing</li>
              <li>24/7 notary availability</li>
              <li>Secure document storage</li>
            </ul>
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Project-Nos. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Project-Nos!',
      html
    });
  }
}

export default new EmailService();
