import commonjsVariables from 'commonjs-variables-for-esmodules';
import nodemailer from 'nodemailer';
import path from 'path';
import { renderFile } from 'pug';
import { convert } from 'html-to-text';

const createSMTPTransport = () => {
  return nodemailer.createTransport({
    service: process.env.MAIL_SMTP_SERVICE,
    auth: {
      user: process.env.MAIL_SMTP_USER,
      pass: process.env.MAIL_SMTP_PASS,
    },
  });
};

const createEmailHtml = (username, link) => {
  const { __dirname } = commonjsVariables(import.meta);
  const activationLink = `${process.env.CLIENT_URL}/api/v1/user/activate/${link}`;

  return renderFile(
    path.join(__dirname, '..', 'views', 'emails', 'activationEmail.pug'),
    {
      username,
      activationLink,
    },
  );
};

export const sendActivationLink = async (username, email, link) => {
  const transporter = createSMTPTransport();
  const html = createEmailHtml(username, link);

  const emailConfig = {
    from: process.env.MAIL_SMTP_USER,
    to: email,
    subject: 'TaskBoard account activation',
    text: convert(html),
    html,
  };

  await transporter.sendMail(emailConfig);
};

export default {
  sendActivationLink,
};
