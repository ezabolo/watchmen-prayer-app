import { MailService } from '@sendgrid/mail';
import type { Subscriber, Event } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = 'notifications@prayerwatchman.com'; // Replace with your verified sender

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function sendEmail(params: EmailParams): Promise<boolean> {
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

export async function sendVerificationEmail(subscriber: Subscriber): Promise<boolean> {
  const verifyUrl = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/verify?token=${subscriber.verifyToken}`;
  
  const subject = 'Verify Your Prayer Watchman Subscription';
  const text = `
Hello ${subscriber.firstName} ${subscriber.lastName},

Thank you for subscribing to Prayer Watchman! Please verify your email address by clicking the link below:

${verifyUrl}

If you didn't sign up for this, you can safely ignore this email.

Blessings,
The Prayer Watchman Team
  `;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Subscription</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Prayer Watchman</h1>
    <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Standing on the Wall in Prayer</p>
  </div>
  
  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1e40af; margin-top: 0;">Hello ${subscriber.firstName} ${subscriber.lastName},</h2>
    
    <p style="font-size: 16px; line-height: 1.8;">
      Thank you for joining our global prayer network! We're excited to have you as part of our community of intercessors.
    </p>
    
    <p style="font-size: 16px; line-height: 1.8;">
      To complete your subscription and start receiving updates, please verify your email address:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyUrl}" style="background: #eab308; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
        Verify My Email
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; line-height: 1.6;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${verifyUrl}" style="color: #1e40af; word-break: break-all;">${verifyUrl}</a>
    </p>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      If you didn't sign up for this, you can safely ignore this email.
    </p>
    
    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        Blessings,<br>
        <strong>The Prayer Watchman Team</strong>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return await sendEmail({
    to: subscriber.email,
    subject,
    text,
    html
  });
}

export async function sendEventNotification(subscriber: Subscriber, event: Event): Promise<boolean> {
  const unsubscribeUrl = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/unsubscribe?token=${subscriber.unsubscribeToken}`;
  
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const subject = `New Prayer Event: ${event.title}`;
  const text = `
Hello ${subscriber.firstName} ${subscriber.lastName},

A new prayer event has been scheduled:

${event.title}
Date: ${eventDate}
${event.location ? `Location: ${event.location}` : ''}

${event.description}

${event.content || ''}

Join us in this time of prayer and intercession.

---
To unsubscribe from event notifications: ${unsubscribeUrl}

Blessings,
The Prayer Watchman Team
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Prayer Event</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Prayer Watchman</h1>
    <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">New Prayer Event</p>
  </div>
  
  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1e40af; margin-top: 0;">Hello ${subscriber.firstName},</h2>
    
    <p style="font-size: 16px; line-height: 1.8;">
      A new prayer event has been scheduled for our global prayer network:
    </p>
    
    <div style="background: white; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #eab308;">
      <h3 style="color: #1e40af; margin-top: 0; font-size: 20px;">${event.title}</h3>
      <p style="font-size: 16px; margin: 10px 0; color: #666;">
        <strong>📅 Date:</strong> ${eventDate}
      </p>
      ${event.location ? `<p style="font-size: 16px; margin: 10px 0; color: #666;"><strong>📍 Location:</strong> ${event.location}</p>` : ''}
      
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 16px; line-height: 1.8; margin: 0;">
          ${event.description}
        </p>
        ${event.content ? `
        <div style="margin-top: 15px;">
          <p style="font-size: 15px; line-height: 1.7; color: #555;">
            ${event.content.replace(/\n/g, '<br>')}
          </p>
        </div>
        ` : ''}
      </div>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; text-align: center; background: #fef3c7; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <strong>Join us in this time of prayer and intercession!</strong>
    </p>
    
    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
      <p style="margin: 0; color: #666; font-size: 12px; text-align: center;">
        You're receiving this because you subscribed to Prayer Watchman Events.<br>
        <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Unsubscribe from event notifications</a>
      </p>
      
      <div style="text-align: center; margin-top: 20px;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          Blessings,<br>
          <strong>The Prayer Watchman Team</strong>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return await sendEmail({
    to: subscriber.email,
    subject,
    text,
    html
  });
}