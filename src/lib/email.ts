import { Resend } from 'resend';

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is required');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface NotificationEmailData {
  userName: string;
  userEmail: string;
  bookTitle: string;
  notificationType: 'reservation_confirmed' | 'book_ready' | 'overdue_reminder' | 'welcome' | 'password_reset';
  additionalData?: {
    pickupDate?: string;
    dueDate?: string;
    resetCode?: string;
    libraryName?: string;
  };
}

class EmailService {
  private fromEmail = 'noreply@libroreserva.com'; // Update with your verified domain

  async sendEmail({ to, subject, html, from }: EmailTemplate) {
    try {
      const resend = getResendClient();
      const data = await resend.emails.send({
        from: from || this.fromEmail,
        to: [to],
        subject,
        html,
      });

      console.log('Email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
  }

  async sendNotificationEmail(data: NotificationEmailData) {
    const template = this.getEmailTemplate(data);
    return this.sendEmail({
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
    });
  }

  private getEmailTemplate(data: NotificationEmailData): Omit<EmailTemplate, 'to'> {
    const { userName, bookTitle, notificationType, additionalData } = data;
    const libraryName = additionalData?.libraryName || 'LibroReserva';

    switch (notificationType) {
      case 'welcome':
        return {
          subject: `Welcome to ${libraryName}!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb; text-align: center;">Welcome to ${libraryName}!</h1>
              <p>Dear ${userName},</p>
              <p>Welcome to our library management system! Your account has been successfully created.</p>
              <p>You can now:</p>
              <ul>
                <li>Search and browse our book collection</li>
                <li>Make reservations for available books</li>
                <li>Track your borrowing history</li>
                <li>Receive notifications about your reservations</li>
              </ul>
              <p>Get started by exploring our catalog and making your first reservation!</p>
              <p style="margin-top: 30px;">
                Best regards,<br>
                The ${libraryName} Team
              </p>
            </div>
          `
        };

      case 'reservation_confirmed':
        return {
          subject: `Reservation Confirmed - ${bookTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #059669; text-align: center;">Reservation Confirmed!</h1>
              <p>Dear ${userName},</p>
              <p>Your reservation for <strong>"${bookTitle}"</strong> has been confirmed.</p>
              <p>We'll notify you as soon as the book is ready for pickup.</p>
              ${additionalData?.pickupDate ? `<p><strong>Expected pickup date:</strong> ${additionalData.pickupDate}</p>` : ''}
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Next steps:</strong></p>
                <ul style="margin: 10px 0 0 0;">
                  <li>Wait for our pickup notification</li>
                  <li>Bring a valid ID when collecting the book</li>
                  <li>Check your dashboard for updates</li>
                </ul>
              </div>
              <p style="margin-top: 30px;">
                Best regards,<br>
                The ${libraryName} Team
              </p>
            </div>
          `
        };

      case 'book_ready':
        return {
          subject: `Book Ready for Pickup - ${bookTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb; text-align: center;">Your Book is Ready!</h1>
              <p>Dear ${userName},</p>
              <p>Great news! <strong>"${bookTitle}"</strong> is now available for pickup at the library front desk.</p>
              <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <p style="margin: 0;"><strong>Pickup Information:</strong></p>
                <ul style="margin: 10px 0 0 0;">
                  <li>Location: Library Front Desk</li>
                  <li>Hours: Monday-Friday 9AM-6PM, Saturday 10AM-4PM</li>
                  <li>Please bring a valid ID</li>
                  ${additionalData?.dueDate ? `<li>Due date: ${additionalData.dueDate}</li>` : ''}
                </ul>
              </div>
              <p>Please collect your book within 3 days, or your reservation may be cancelled.</p>
              <p style="margin-top: 30px;">
                Best regards,<br>
                The ${libraryName} Team
              </p>
            </div>
          `
        };

      case 'overdue_reminder':
        return {
          subject: `Return Reminder - ${bookTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #dc2626; text-align: center;">Return Reminder</h1>
              <p>Dear ${userName},</p>
              <p>This is a friendly reminder that <strong>"${bookTitle}"</strong> is overdue.</p>
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <p style="margin: 0;"><strong>Important:</strong></p>
                <ul style="margin: 10px 0 0 0;">
                  <li>Please return the book as soon as possible</li>
                  <li>Late fees may apply for overdue items</li>
                  <li>Contact us if you need to renew or have issues</li>
                </ul>
              </div>
              <p>If you've already returned this book, please disregard this notice.</p>
              <p style="margin-top: 30px;">
                Best regards,<br>
                The ${libraryName} Team
              </p>
            </div>
          `
        };

      case 'password_reset':
        return {
          subject: `Password Reset Code - ${libraryName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb; text-align: center;">Password Reset Request</h1>
              <p>Dear ${userName},</p>
              <p>You requested to reset your password for your ${libraryName} account.</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 10px 0;"><strong>Your reset code is:</strong></p>
                <p style="font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 3px; margin: 0;">
                  ${additionalData?.resetCode}
                </p>
              </div>
              <p><strong>Important:</strong></p>
              <ul>
                <li>This code expires in 15 minutes</li>
                <li>Don't share this code with anyone</li>
                <li>If you didn't request this reset, please ignore this email</li>
              </ul>
              <p style="margin-top: 30px;">
                Best regards,<br>
                The ${libraryName} Team
              </p>
            </div>
          `
        };

      default:
        throw new Error(`Unknown notification type: ${notificationType}`);
    }
  }
}

export const emailService = new EmailService();