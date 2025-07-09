exports.contactTemplate = (email, name, message) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Contact Us - EzyBuyy</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        background: #fff;
        margin: 30px auto;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background-color: #4f46e5;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .header img {
        height: 50px;
        margin-bottom: 10px;
      }
      .content {
        padding: 25px;
      }
      .content h2 {
        color: #333;
        margin-top: 0;
      }
      .content p {
        line-height: 1.6;
        color: #555;
      }
      .footer {
        background-color: #f3f4f6;
        padding: 15px;
        text-align: center;
        font-size: 13px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://res.cloudinary.com/dbsrbfj8y/image/upload/v1752053847/nav-logo_hplql3.png" alt="EzyBuyy Logo" />
        <h1>New Contact Message</h1>
      </div>
      <div class="content">
        <h2>Hi EzyBuyy Team,</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/> ${message}</p>
      </div>
      <div class="footer">
        &copy; 2025 EzyBuyy. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
