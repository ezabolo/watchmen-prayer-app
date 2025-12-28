import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EventRegistrationEmailParams {
  organizerEmail: string;
  organizerName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  registrantName: string;
  registrantEmail: string;
}

export async function sendEventRegistrationEmail(params: EventRegistrationEmailParams): Promise<boolean> {
  try {
    const msg = {
      to: params.organizerEmail,
      from: 'noreply@prayerwatchman.org', // This should be a verified sender domain
      subject: `New Registration for ${params.eventTitle}`,
      text: `
Hello ${params.organizerName},

Someone has registered for your prayer event "${params.eventTitle}".

Event Details:
- Event: ${params.eventTitle}
- Date: ${params.eventDate}
- Location: ${params.eventLocation}

Registrant Information:
- Name: ${params.registrantName}
- Email: ${params.registrantEmail}

You can contact them directly if needed.

Blessings,
Prayer Watchman Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Event Registration</h2>
          
          <p>Hello <strong>${params.organizerName}</strong>,</p>
          
          <p>Someone has registered for your prayer event "<strong>${params.eventTitle}</strong>".</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Event Details:</h3>
            <ul style="margin-bottom: 0;">
              <li><strong>Event:</strong> ${params.eventTitle}</li>
              <li><strong>Date:</strong> ${params.eventDate}</li>
              <li><strong>Location:</strong> ${params.eventLocation}</li>
            </ul>
          </div>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #065f46;">Registrant Information:</h3>
            <ul style="margin-bottom: 0;">
              <li><strong>Name:</strong> ${params.registrantName}</li>
              <li><strong>Email:</strong> ${params.registrantEmail}</li>
            </ul>
          </div>
          
          <p>You can contact them directly if needed.</p>
          
          <p style="margin-top: 30px;">Blessings,<br><strong>Prayer Watchman Team</strong></p>
        </div>
      `,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

interface EventContactEmailParams {
  organizerEmail: string;
  organizerName: string;
  eventTitle: string;
  eventDate: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
}

export async function sendEventContactEmail(params: EventContactEmailParams): Promise<boolean> {
  try {
    const msg = {
      to: params.organizerEmail,
      from: 'noreply@prayerwatchman.org',
      subject: `Message about ${params.eventTitle}`,
      text: `
Hello ${params.organizerName},

Someone has a question about your event: ${params.eventTitle}

Contact Information:
- Name: ${params.senderName}
- Email: ${params.senderEmail}
${params.senderPhone ? `- Phone: ${params.senderPhone}` : ''}

Message:
${params.message}

Event Details:
- Event: ${params.eventTitle}
- Date: ${params.eventDate}

You can reply directly to this email to respond to ${params.senderName}.

Blessings,
Prayer Watchman Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">New Message About Your Event</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <p style="font-size: 18px; color: #374151; margin-bottom: 25px;">
              Hello <strong>${params.organizerName}</strong>,<br>
              Someone has a question about your event: <strong>${params.eventTitle}</strong>
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Name:</strong> ${params.senderName}</li>
                <li><strong>Email:</strong> ${params.senderEmail}</li>
                ${params.senderPhone ? `<li><strong>Phone:</strong> ${params.senderPhone}</li>` : ''}
              </ul>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #374151;">Message</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6;">
${params.message}
              </div>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin-top: 0; color: #374151;">Event Details</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Event:</strong> ${params.eventTitle}</li>
                <li><strong>Date:</strong> ${params.eventDate}</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280;">You can reply directly to this email to respond to ${params.senderName}.</p>
              <p style="margin-top: 20px;">Blessings,<br><strong>Prayer Watchman Team</strong></p>
            </div>
          </div>
        </div>
      `,
      replyTo: params.senderEmail,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    
    // Log the contact details for manual follow-up when email fails
    console.log('CONTACT FORM SUBMISSION (Email failed):');
    console.log('Event:', params.eventTitle);
    console.log('Organizer:', params.organizerName, '(' + params.organizerEmail + ')');
    console.log('From:', params.senderName, '(' + params.senderEmail + ')');
    if (params.senderPhone) console.log('Phone:', params.senderPhone);
    console.log('Message:', params.message);
    console.log('Date:', params.eventDate);
    console.log('---');
    
    return false;
  }
}