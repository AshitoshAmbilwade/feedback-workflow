// Mock Email Utility — Option 1 (For Assignment / Demo)
// This file simulates sending emails without using an actual email service.
// All email actions are logged to the console for demo and testing purposes.

export async function sendFeedbackRequestEmail(
  clientEmail: string,
  clientName: string,
  feedbackLink: string
) {
  console.log(`
  📩 [Mock] Feedback Request Email
  --------------------------------
  To: ${clientEmail}
  Subject: Feedback Request
  Message: Hello ${clientName},
  Please complete your feedback form at: ${feedbackLink}
  --------------------------------
  `);

  return { success: true, simulated: true };
}

export async function sendHRNotificationEmail(
  hrEmail: string,
  clientName: string
) {
  console.log(`
  📩 [Mock] HR Notification Email
  --------------------------------
  To: ${hrEmail}
  Subject: Feedback Submitted
  Message: ${clientName} has submitted their feedback.
  --------------------------------
  `);

  return { success: true, simulated: true };
}

export async function sendThankYouEmail(
  clientEmail: string,
  clientName: string
) {
  console.log(`
  📩 [Mock] Thank You Email
  --------------------------------
  To: ${clientEmail}
  Subject: Thank You for Your Feedback
  Message: Hello ${clientName}, thank you for your valuable feedback!
  --------------------------------
  `);

  return { success: true, simulated: true };
}
