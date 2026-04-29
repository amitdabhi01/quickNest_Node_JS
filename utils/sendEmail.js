import transporter from "../config/email.js";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mail = {
      from: `"QuickNest" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mail);

    // console.log("mail sent to this id", info.messageId);

    return info;
  } catch (error) {
    throw new Error("Email sending failed: " + error.message);
  }
};

export default sendEmail;
