import { getBaseEmailLayout } from './base.layout';

export const getResetPasswordEmailTemplate = (name: string, resetLink: string) => {
  const content = `
    <div class="greeting">Reset your password</div>
    <div class="text">
        Hello ${name},
        <br><br>
        We received a request to reset your password. No changes have been made to your account yet.
        <br>
        You can reset your password by clicking the link below:
    </div>
    
    <div class="button-container">
        <a href="${resetLink}" class="button" style="background-color: #dc2626;">Reset Password</a>
    </div>
    
    <div class="text" style="font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        <p>Or paste this link into your browser:</p>
        <a href="${resetLink}" class="link">${resetLink}</a>
        <br><br>
        <span style="color: #e53e3e;">This link will expire in 1 hour.</span>
        <br><br>
        If you did not request this, please ignore this email.
    </div>
  `;

  return getBaseEmailLayout(content, 'Reset your password - Portal');
};
