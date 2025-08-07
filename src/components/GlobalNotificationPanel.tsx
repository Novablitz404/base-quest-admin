'use client';

import { useState } from 'react';
import { sendGlobalNotification, createGlobalNotification } from '@/lib/notification-service';

interface GlobalNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalNotificationPanel({ isOpen, onClose }: GlobalNotificationPanelProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      setError("Please fill in both title and body");
      return;
    }

    setIsSending(true);
    setResult(null);
    setError(null);

    try {
      const targetUsersArray = targetUsers.trim() 
        ? targetUsers.split(',').map(user => user.trim()).filter(Boolean)
        : undefined;

      const result = await sendGlobalNotification(title.trim(), body.trim(), targetUsersArray);
      
      setResult(result);
      setTitle("");
      setBody("");
      setTargetUsers("");
    } catch (error) {
      console.error('Error sending notification:', error);
      setError('Failed to send notification. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNotification = async () => {
    if (!title.trim() || !body.trim()) {
      setError("Please fill in both title and body");
      return;
    }

    setIsSending(true);
    setResult(null);
    setError(null);

    try {
      const targetUsersArray = targetUsers.trim() 
        ? targetUsers.split(',').map(user => user.trim()).filter(Boolean)
        : undefined;

      await createGlobalNotification(title.trim(), body.trim(), targetUsersArray);
      
      setResult({ success: 1, failed: 0, total: 1 }); // Created successfully
      setTitle("");
      setBody("");
      setTargetUsers("");
    } catch (error) {
      console.error('Error creating notification:', error);
      setError('Failed to create notification. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Send Global Notification</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/50 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter notification message..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{body.length}/200 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Users (Optional)
            </label>
            <input
              type="text"
              value={targetUsers}
              onChange={(e) => setTargetUsers(e.target.value)}
              placeholder="Comma-separated wallet addresses (leave empty for all users)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to send to all users
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">
                ❌ {error}
              </p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-800">
                ✅ Notification sent successfully!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Sent to {result.success} users, failed for {result.failed} users (Total: {result.total})
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSendNotification}
              disabled={isSending || !title.trim() || !body.trim()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? "Sending..." : "Send Now"}
            </button>
            <button
              onClick={handleCreateNotification}
              disabled={isSending || !title.trim() || !body.trim()}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? "Creating..." : "Create Draft"}
            </button>
            <button
              onClick={onClose}
              disabled={isSending}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 