import transporter from "../config/email.js";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: 'Quick Nest "amitdabhi526@gmail.com"',
      to,
      subject,
      html,
    });

    console.log("email sent id", info.messageId);
  } catch (error) {
    console.log(error.message);
  }
};

export default sendEmail;
