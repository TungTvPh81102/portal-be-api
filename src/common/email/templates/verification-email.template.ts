import { getBaseEmailLayout } from './base.layout';

export const getVerificationEmailTemplate = (name: string, verificationLink: string) => {
  const content = `
    <div class="greeting">Hello ${name},</div>
    <div class="text">
        Welcome to Portal! We're excited to have you on board.
        <br><br>
        To get started, please verify your email address to ensure your account is secure and you receive important updates.
    </div>
    
    <div class="button-container">
        <a href="${verificationLink}" class="button">Verify Email Address</a>
    </div>
    
    <div class="text" style="font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        <p>Or paste this link into your browser:</p>
        <a href="${verificationLink}" class="link">${verificationLink}</a>
        <br><br>
        <span style="color: #e53e3e;">This link will expire in 24 hours.</span>
    </div>
  `;

  return getBaseEmailLayout(content, 'Verify your email - Portal');
};
