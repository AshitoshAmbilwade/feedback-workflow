import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFeedbackRequestEmail(
  clientEmail: string,
  clientName: string,
  feedbackLink: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Feedback System <onboarding@resend.dev>',
      to: clientEmail,
      subject: 'Feedback Request',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
              .dark-mode { background-color: #1a1a1a; color: #ffffff; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Feedback Request</h2>
              <p>Hello ${clientName},</p>
              <p>We would appreciate your feedback on our services. Please take a moment to complete our feedback form.</p>
              <p>
                <a href="${feedbackLink}" class="button">Provide Feedback</a>
              </p>
              <p>This link will expire in 7 days.</p>
              <p>Best regards,<br>The Team</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending feedback request email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendHRNotificationEmail(
  hrEmail: string,
  clientName: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Feedback System <feedback@yourdomain.com>',
      to: hrEmail,
      subject: 'Feedback Submitted',
      html: `
        <div>
          <h2>Feedback Received</h2>
          <p>Hello HR Team,</p>
          <p>${clientName} has submitted their feedback.</p>
          <p>You can review the feedback in your dashboard.</p>
          <p>Best regards,<br>Feedback System</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending HR notification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendThankYouEmail(clientEmail: string, clientName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Feedback System <feedback@yourdomain.com>',
      to: clientEmail,
      subject: 'Thank You for Your Feedback',
      html: `
        <div>
          <h2>Thank You!</h2>
          <p>Hello ${clientName},</p>
          <p>Thank you for taking the time to provide your valuable feedback.</p>
          <p>We appreciate your input and will use it to improve our services.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending thank you email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}