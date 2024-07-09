import nodemailer from "nodemailer";
import config from "../config";

class Mail {
  sendOne(subject: string, from: string, to: string, content: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: config.google.appUser,
        pass: config.google.appPass,
      },
    });

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <p>${content}</p>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    });
  }
  async sendResetPasswordLink(to: string, link: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: config.google.appUser,
        pass: config.google.appPass,
      },
    });

    const mailOptions = {
      from: `Team Manager <${config.google.appUser}>`,
      to: to,
      subject: "Reset Password",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
          }
          h1 {
            color: #333333;
          }
          p {
            color: #555555;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            color: white;
            background-color: #007BFF;
            border-radius: 5px;
            text-decoration: none;
          }
          a:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Password Reset Request</h1>
          <p>This link will be expired in 10 minutes</p>
          <p>We received a request to reset your password. Click the link below to reset it:</p>
          <a style="color: white" href="${link}">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        </div>
      </body>
      </html>
    `,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  }
}

export const MailUtilService = new Mail();
