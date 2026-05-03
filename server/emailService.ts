import { MailService } from '@sendgrid/mail';
import type { Subscriber, Event } from '@shared/schema';

const mailService = new MailService();

if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@watchmennationsprayer.org';
const APP_NAME = 'Watchmen Nations Prayer';

function getBaseUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.REPLIT_DOMAINS) return `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`;
  return 'http://localhost:5000';
}

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set — skipping email send to:', params.to, '| Subject:', params.subject);
    return false;
  }
  try {
    await mailService.send({
      to: params.to,
      from: FROM_EMAIL,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

function emailWrapper(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 26px;">${APP_NAME}</h1>
    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.85;">Standing on the Wall in Prayer</p>
  </div>
  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
    ${body}
    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
      <p style="margin: 0; color: #888; font-size: 13px;">
        Blessings,<br><strong>The ${APP_NAME} Team</strong>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendAccountVerificationEmail(name: string, email: string, token: string): Promise<boolean> {
  const verifyUrl = `${getBaseUrl()}/verify-email?token=${token}`;
  const subject = `Verify your ${APP_NAME} account`;
  const body = `
    <h2 style="color: #1e3a8a; margin-top: 0;">Hello ${name},</h2>
    <p style="font-size: 16px; line-height: 1.8;">
      Welcome to the ${APP_NAME} community! Please verify your email address to activate your account.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyUrl}" style="background: #eab308; color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
        Verify My Email
      </a>
    </div>
    <p style="font-size: 14px; color: #666; line-height: 1.6;">
      This link expires in 24 hours. If the button doesn't work, copy and paste this link:<br>
      <a href="${verifyUrl}" style="color: #1e40af; word-break: break-all;">${verifyUrl}</a>
    </p>
    <p style="font-size: 14px; color: #888;">If you didn't create an account, you can safely ignore this email.</p>
  `;
  return sendEmail({ to: email, subject, text: `Hello ${name},\n\nPlease verify your email: ${verifyUrl}\n\nThis link expires in 24 hours.`, html: emailWrapper(subject, body) });
}

export async function sendPasswordResetEmail(name: string, email: string, token: string): Promise<boolean> {
  const resetUrl = `${getBaseUrl()}/reset-password?token=${token}`;
  const subject = `Reset your ${APP_NAME} password`;
  const body = `
    <h2 style="color: #1e3a8a; margin-top: 0;">Hello ${name},</h2>
    <p style="font-size: 16px; line-height: 1.8;">
      We received a request to reset your password. Click the button below to set a new password:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background: #eab308; color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
        Reset My Password
      </a>
    </div>
    <p style="font-size: 14px; color: #666; line-height: 1.6;">
      This link expires in 1 hour. If you didn't request a password reset, please ignore this email — your password will remain unchanged.
    </p>
    <p style="font-size: 14px; color: #666;">
      Copy and paste this link if the button doesn't work:<br>
      <a href="${resetUrl}" style="color: #1e40af; word-break: break-all;">${resetUrl}</a>
    </p>
  `;
  return sendEmail({ to: email, subject, text: `Hello ${name},\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.`, html: emailWrapper(subject, body) });
}

export async function sendVerificationEmail(subscriber: Subscriber): Promise<boolean> {
  const verifyUrl = `${getBaseUrl()}/verify?token=${subscriber.verifyToken}`;
  const subject = `Verify Your ${APP_NAME} Subscription`;
  const body = `
    <h2 style="color: #1e3a8a; margin-top: 0;">Hello ${subscriber.firstName} ${subscriber.lastName},</h2>
    <p style="font-size: 16px; line-height: 1.8;">
      Thank you for joining our global prayer network! Please verify your email address:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyUrl}" style="background: #eab308; color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
        Verify My Email
      </a>
    </div>
    <p style="font-size: 14px; color: #666;">
      If you didn't sign up for this, you can safely ignore this email.
    </p>
  `;
  return sendEmail({ to: subscriber.email, subject, text: `Hello ${subscriber.firstName},\n\nVerify your subscription: ${verifyUrl}`, html: emailWrapper(subject, body) });
}

export async function sendEventNotification(subscriber: Subscriber, event: Event): Promise<boolean> {
  const unsubscribeUrl = `${getBaseUrl()}/unsubscribe?token=${subscriber.unsubscribeToken}`;
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });
  const subject = `New Prayer Event: ${event.title}`;
  const body = `
    <h2 style="color: #1e3a8a; margin-top: 0;">Hello ${subscriber.firstName},</h2>
    <p style="font-size: 16px; line-height: 1.8;">A new prayer event has been scheduled:</p>
    <div style="background: white; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #eab308;">
      <h3 style="color: #1e3a8a; margin-top: 0; font-size: 20px;">${event.title}</h3>
      <p style="font-size: 16px; margin: 10px 0; color: #666;"><strong>📅 Date:</strong> ${eventDate}</p>
      ${event.location ? `<p style="font-size: 16px; margin: 10px 0; color: #666;"><strong>📍 Location:</strong> ${event.location}</p>` : ''}
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 16px; line-height: 1.8; margin: 0;">${event.description}</p>
        ${event.content ? `<p style="font-size: 15px; line-height: 1.7; color: #555; margin-top: 15px;">${event.content.replace(/\n/g, '<br>')}</p>` : ''}
      </div>
    </div>
    <p style="font-size: 16px; text-align: center; background: #fef3c7; padding: 20px; border-radius: 8px;"><strong>Join us in this time of prayer and intercession!</strong></p>
    <p style="font-size: 12px; color: #888; text-align: center;">
      <a href="${unsubscribeUrl}" style="color: #888; text-decoration: underline;">Unsubscribe from event notifications</a>
    </p>
  `;
  return sendEmail({ to: subscriber.email, subject, text: `${event.title}\nDate: ${eventDate}\n\n${event.description}`, html: emailWrapper(subject, body) });
}
