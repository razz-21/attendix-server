import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { GetUser } from '../users/users.model.js';
import {
  buildApprovalEmailHtml,
  buildResetPasswordEmailHtml,
} from './email-templates.js';

config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (
  to: string,
  resetToken: string,
  firstName?: string
) => {
  const resetLink = `${process.env.CORS_ORIGIN}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Attendix" <${process.env.SMTP_USERNAME}>`,
    to,
    subject: 'Password Reset Request',
    html: buildResetPasswordEmailHtml(resetLink, firstName),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendApprovalEmail = async (to: string, user: GetUser) => {
  const loginLink = `${process.env.CORS_ORIGIN}/login`;

  const mailOptions = {
    from: `"Attendix" <${process.env.SMTP_USERNAME}>`,
    to,
    subject: 'Account Approval',
    html: buildApprovalEmailHtml(loginLink, user.firstname, user.lastname),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Approval email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw new Error('Failed to send approval email');
  }
}