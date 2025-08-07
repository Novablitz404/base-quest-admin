// Notification service for quest-admin
// This service handles global notifications for the Blue Square mini-app

export interface GlobalNotification {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  createdAt: Date;
  sentAt?: Date;
  targetUsers?: string[];
}

export interface NotificationResult {
  success: number;
  failed: number;
  total: number;
}

// Send global notification
export async function sendGlobalNotification(
  title: string,
  body: string,
  targetUsers?: string[]
): Promise<NotificationResult> {
  try {
    const response = await fetch('/api/notifications/global', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        targetUsers,
        sendImmediately: true
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result || { success: 0, failed: 0, total: 0 };
  } catch (error) {
    console.error('Error sending global notification:', error);
    throw error;
  }
}

// Create a global notification (without sending)
export async function createGlobalNotification(
  title: string,
  body: string,
  targetUsers?: string[]
): Promise<string> {
  try {
    const response = await fetch('/api/notifications/global', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        targetUsers,
        sendImmediately: false
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.notificationId;
  } catch (error) {
    console.error('Error creating global notification:', error);
    throw error;
  }
}

// Get all global notifications
export async function getGlobalNotifications(): Promise<GlobalNotification[]> {
  try {
    const response = await fetch('/api/notifications/global');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error('Error getting global notifications:', error);
    return [];
  }
}

// Send a notification by ID
export async function sendNotificationById(notificationId: string): Promise<NotificationResult> {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result || { success: 0, failed: 0, total: 0 };
  } catch (error) {
    console.error('Error sending notification by ID:', error);
    throw error;
  }
} 