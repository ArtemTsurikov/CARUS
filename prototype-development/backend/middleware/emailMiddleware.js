import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const handleMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: '"CARUS - Share Mobility" <noreply.carus@gmail.com>',
    to: to, 
    subject: subject,
    html: html,
  });
};

export default { handleMail };
