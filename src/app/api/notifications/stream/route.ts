import { NextRequest } from 'next/server';

// Store active connections
const connections = new Map<string, ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response('User ID required', { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Store this connection
      connections.set(userId, controller);

      // Send initial connection message
      const data = JSON.stringify({
        type: 'connected',
        message: 'Real-time notifications connected',
        timestamp: new Date().toISOString()
      });

      controller.enqueue(encoder.encode(`data: ${data}\n\n`));

      // Send heartbeat every 30 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          const heartbeatData = JSON.stringify({
            type: 'heartbeat',
            timestamp: new Date().toISOString()
          });
          controller.enqueue(encoder.encode(`data: ${heartbeatData}\n\n`));
        } catch (error) {
          clearInterval(heartbeat);
          connections.delete(userId);
        }
      }, 30000);

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        connections.delete(userId);
        try {
          controller.close();
        } catch (error) {
          // Connection already closed
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}

// Function to send notification to specific user
export function sendNotificationToUser(userId: string, notification: any) {
  const controller = connections.get(userId);
  if (controller) {
    try {
      const encoder = new TextEncoder();
      const data = JSON.stringify({
        type: 'notification',
        ...notification,
        timestamp: new Date().toISOString()
      });
      controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      connections.delete(userId);
      return false;
    }
  }
  return false;
}

// Function to broadcast to all connected users
export function broadcastNotification(notification: any) {
  const encoder = new TextEncoder();
  const data = JSON.stringify({
    type: 'broadcast',
    ...notification,
    timestamp: new Date().toISOString()
  });

  connections.forEach((controller, userId) => {
    try {
      controller.enqueue(encoder.encode(`data: ${data}\n\n`));
    } catch (error) {
      console.error(`Error broadcasting to user ${userId}:`, error);
      connections.delete(userId);
    }
  });
}