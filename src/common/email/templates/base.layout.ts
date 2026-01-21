export const getBaseEmailLayout = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Base Resets */
        body { margin: 0; padding: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f4f7fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        table { border-spacing: 0; border-collapse: collapse; }
        img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Container */
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); margin-top: 40px; margin-bottom: 40px; }
        
        /* Header */
        .header { background-color: #1a1a2e; padding: 30px 40px; text-align: center; }
        .logo { color: #ffffff; font-size: 24px; font-weight: 700; text-decoration: none; letter-spacing: 1px; }
        
        /* Content */
        .content { padding: 40px; color: #333333; line-height: 1.6; font-size: 16px; }
        .greeting { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1a1a2e; }
        .text { margin-bottom: 24px; color: #4a5568; }
        
        /* Button */
        .button-container { text-align: center; margin: 32px 0; }
        .button { display: inline-block; padding: 14px 32px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease; }
        .button:hover { background-color: #4338ca; }
        
        /* Footer */
        .footer { background-color: #f4f7fa; padding: 24px 40px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #e2e8f0; }
        .link { color: #4f46e5; text-decoration: none; word-break: break-all; }
        
        /* Mobile */
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: 0 !important; border-radius: 0; }
            .content { padding: 24px !important; }
            .header { padding: 24px !important; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <a href="#" class="logo">PORTAL</a>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            ${content}
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Portal Inc. All rights reserved.</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
`;
