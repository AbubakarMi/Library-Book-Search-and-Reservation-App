import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Reservation } from '@/lib/types';

// Get all reservations from localStorage
function getReservations(): Reservation[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('reservations');
  return stored ? JSON.parse(stored) : [];
}

// Save reservations to localStorage
function saveReservations(reservations: Reservation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Send notification to user
function sendNotificationToUser(userID: string, notification: any): void {
  if (typeof window === 'undefined') return;
  const existingNotifications = localStorage.getItem(`notifications_${userID}`);
  const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
  notifications.push(notification);
  localStorage.setItem(`notifications_${userID}`, JSON.stringify(notifications));

  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('notificationUpdate', {
    detail: { userID, notification }
  }));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const userCookie = cookieStore.get('library_user');

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = JSON.parse(userCookie.value);

    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can approve/reject reservations' }, { status: 403 });
    }

    const { action, rejectionReason } = await request.json();
    const reservationId = params.id;

    // For server-side operations, we'll return the update data to be handled client-side
    if (action === 'approve') {
      const pickupDate = new Date().toISOString();
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now

      return NextResponse.json({
        success: true,
        action: 'approve',
        data: {
          status: 'approved',
          adminID: currentUser.id,
          approvalDate: new Date().toISOString(),
          pickupDate,
          expiryDate,
          notification: {
            id: Date.now().toString(),
            title: 'Reservation Approved',
            message: 'Your book reservation has been approved. Please pick up your book within 7 days.',
            type: 'success',
            timestamp: new Date().toISOString(),
            read: false
          }
        }
      });
    } else if (action === 'reject') {
      if (!rejectionReason) {
        return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        action: 'reject',
        data: {
          status: 'rejected',
          adminID: currentUser.id,
          approvalDate: new Date().toISOString(),
          rejectionReason,
          notification: {
            id: Date.now().toString(),
            title: 'Reservation Rejected',
            message: `Your book reservation has been rejected. Reason: ${rejectionReason}`,
            type: 'error',
            timestamp: new Date().toISOString(),
            read: false
          }
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing reservation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}