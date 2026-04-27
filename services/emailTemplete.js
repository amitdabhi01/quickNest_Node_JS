export const getWelcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to QuickNest</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
        }

        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }

        .header h1 {
          font-size: 28px;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .header p {
          font-size: 14px;
          opacity: 0.9;
        }

        .content {
          padding: 40px 30px;
        }

        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          line-height: 1.8;
        }

        .greeting strong {
          color: #667eea;
          font-size: 20px;
        }

        .welcome-text {
          font-size: 15px;
          color: #555;
          margin-bottom: 25px;
          line-height: 1.8;
        }

        .features {
          background-color: #f8f9fa;
          padding: 25px;
          border-radius: 6px;
          margin: 25px 0;
        }

        .features h3 {
          color: #667eea;
          font-size: 16px;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .features ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .features li {
          padding: 8px 0;
          color: #555;
          font-size: 14px;
          display: flex;
          align-items: center;
        }

        .features li:before {
          content: "✓";
          color: #667eea;
          font-weight: bold;
          margin-right: 10px;
          font-size: 16px;
        }

        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 35px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          margin: 25px 0;
          transition: transform 0.2s ease;
        }

        .cta-button:hover {
          transform: translateY(-2px);
        }

        .support-text {
          font-size: 14px;
          color: #777;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .footer {
          background-color: #f8f9fa;
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #eee;
        }

        .footer p {
          font-size: 12px;
          color: #888;
          margin: 8px 0;
        }

        .footer a {
          color: #667eea;
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        .social-links {
          margin-top: 15px;
        }

        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #667eea;
          font-size: 12px;
          text-decoration: none;
        }

        .divider {
          height: 1px;
          background-color: #eee;
          margin: 20px 0;
        }

        @media only screen and (max-width: 600px) {
          .email-container {
            margin: 0;
            border-radius: 0;
          }

          .header {
            padding: 30px 15px;
          }

          .header h1 {
            font-size: 24px;
          }

          .content {
            padding: 30px 20px;
          }

          .cta-button {
            display: block;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1>🎉 Welcome to QuickNest</h1>
          <p>Your journey starts here</p>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="greeting">
            Hi <strong>${userName}</strong>,
          </div>

          <div class="welcome-text">
            Thank you for joining QuickNest! We're thrilled to have you as part of our community. Whether you're looking to discover amazing services or offer your expertise, you've come to the right place.
          </div>

          <!-- Features Section -->
          <div class="features">
            <h3>What you can do:</h3>
            <ul>
              <li>Browse and book professional services</li>
              <li>Connect with experienced service providers</li>
              <li>Track your bookings and manage appointments</li>
              <li>Leave reviews and ratings</li>
              <li>Get personalized recommendations</li>
            </ul>
          </div>

          <div class="welcome-text">
            Your account has been successfully created and is ready to use. Start exploring our platform and find the services you need.
          </div>

          <!-- CTA Button -->
          <a href="https://quicknest.com/dashboard" class="cta-button">Get Started Now</a>

          <div class="support-text">
            <strong>Need help?</strong> Our support team is here for you. If you have any questions, don't hesitate to reach out to us at support@quicknest.com or visit our FAQ section.
          </div>

          <div class="divider"></div>

          <div style="font-size: 14px; color: #666; line-height: 1.8;">
            <p><strong>Quick Tips:</strong></p>
            <p>✨ Complete your profile to get better recommendations</p>
            <p>🔐 Use a strong password and enable two-factor authentication for security</p>
            <p>📱 Download our mobile app for on-the-go access</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>&copy; 2026 QuickNest. All rights reserved.</p>
          <p>You received this email because you created an account on QuickNest</p>
          
          <div class="social-links">
            <a href="#">Terms of Service</a> | 
            <a href="#">Privacy Policy</a> | 
            <a href="#">Contact Us</a>
          </div>

          <p style="margin-top: 15px; font-size: 11px;">
            QuickNest | Email: support@quicknest.com | Help Center
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default { getWelcomeEmailTemplate };
