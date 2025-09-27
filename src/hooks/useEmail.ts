import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NotificationEmailData } from '@/lib/email';

export function useEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendEmail = async (emailData: NotificationEmailData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Email Sent",
          description: "Notification email sent successfully",
          duration: 3000,
        });
        return { success: true, data: result.data };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        variant: "destructive",
        title: "Email Failed",
        description: error instanceof Error ? error.message : "Failed to send email",
        duration: 5000,
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async (userName: string, userEmail: string) => {
    return sendEmail({
      userName,
      userEmail,
      bookTitle: '', // Not needed for welcome email
      notificationType: 'welcome',
    });
  };

  const sendReservationConfirmationEmail = async (
    userName: string,
    userEmail: string,
    bookTitle: string,
    pickupDate?: string
  ) => {
    return sendEmail({
      userName,
      userEmail,
      bookTitle,
      notificationType: 'reservation_confirmed',
      additionalData: { pickupDate },
    });
  };

  const sendBookReadyEmail = async (
    userName: string,
    userEmail: string,
    bookTitle: string,
    dueDate?: string
  ) => {
    return sendEmail({
      userName,
      userEmail,
      bookTitle,
      notificationType: 'book_ready',
      additionalData: { dueDate },
    });
  };

  const sendOverdueReminderEmail = async (
    userName: string,
    userEmail: string,
    bookTitle: string
  ) => {
    return sendEmail({
      userName,
      userEmail,
      bookTitle,
      notificationType: 'overdue_reminder',
    });
  };

  const sendPasswordResetEmail = async (
    userName: string,
    userEmail: string,
    resetCode: string
  ) => {
    return sendEmail({
      userName,
      userEmail,
      bookTitle: '', // Not needed for password reset
      notificationType: 'password_reset',
      additionalData: { resetCode },
    });
  };

  return {
    sendEmail,
    sendWelcomeEmail,
    sendReservationConfirmationEmail,
    sendBookReadyEmail,
    sendOverdueReminderEmail,
    sendPasswordResetEmail,
    isLoading,
  };
}