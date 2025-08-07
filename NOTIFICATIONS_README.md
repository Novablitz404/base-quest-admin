# Notifications Feature - Quest Admin

This document explains the notifications feature that has been added to the Quest Admin panel.

## 🎯 Overview

The Quest Admin now includes a comprehensive notifications system that allows you to:

1. **Send Global Notifications** - Send notifications to all users or specific users
2. **Create Draft Notifications** - Create notifications for later sending
3. **View Notification History** - See all sent and draft notifications
4. **Manage Notifications** - Track notification status and results

## 🚀 How to Use

### **1. Accessing Notifications**

1. Open the Quest Admin panel
2. Click on the "📢 Notifications" link in the navigation
3. You'll see the notifications dashboard with stats and history

### **2. Sending a Global Notification**

1. Click the "📢 Send Notification" button
2. Fill in the notification details:
   - **Title** (required, max 50 characters)
   - **Body** (required, max 200 characters)
   - **Target Users** (optional, comma-separated wallet addresses)
3. Choose your action:
   - **Send Now** - Immediately sends the notification
   - **Create Draft** - Creates a draft for later sending

### **3. Managing Notifications**

- **View All Notifications**: See all sent and draft notifications
- **Send Drafts**: Click "Send" on any draft notification
- **Track Results**: View success/failure rates for sent notifications

## 🔧 Technical Details

### **API Endpoints**

The quest-admin includes proxy API endpoints that forward requests to the Blue Square mini-app:

- `POST /api/notifications/global` - Send or create global notifications
- `GET /api/notifications/global` - Get all notifications
- `POST /api/notifications/send` - Send notification by ID

### **Environment Variables**

Add this to your `.env.local` file:

```env
BLUE_SQUARE_API_URL=http://localhost:3000
```

This should point to your Blue Square mini-app's API URL.

### **Integration with Blue Square**

The notifications system integrates with the Blue Square mini-app through:

1. **API Proxying** - Quest-admin forwards requests to blue-square
2. **Shared Database** - Both apps use the same Firebase database
3. **Real-time Updates** - Notifications are sent immediately to users

## 📊 Features

### **Notification Types**

1. **Global Notifications** - Sent to all users
2. **Targeted Notifications** - Sent to specific wallet addresses
3. **Draft Notifications** - Created for later sending

### **Notification Content**

- **Title**: Short, engaging title (max 50 characters)
- **Body**: Detailed message (max 200 characters)
- **Targeting**: Optional user targeting
- **Timing**: Immediate or scheduled sending

### **Tracking & Analytics**

- **Success Rates** - Track notification delivery success
- **User Engagement** - Monitor user interaction
- **History** - Complete notification history
- **Status Tracking** - Sent vs draft status

## 🎨 UI Components

### **Notifications Page**

- **Dashboard Stats** - Total, sent, and draft counts
- **Notification List** - All notifications with status
- **Send Panel** - Modal for creating/sending notifications
- **Error Handling** - User-friendly error messages

### **Global Notification Panel**

- **Form Validation** - Real-time validation
- **Character Counters** - Track title and body length
- **Target User Input** - Comma-separated wallet addresses
- **Action Buttons** - Send now, create draft, or cancel

## 🔄 Workflow

### **Typical Notification Workflow**

1. **Plan** - Decide on notification content and target audience
2. **Create** - Use the notification panel to create the notification
3. **Review** - Check the notification content and targeting
4. **Send** - Send immediately or create as draft
5. **Track** - Monitor delivery and engagement

### **Draft Workflow**

1. **Create Draft** - Create notification without sending
2. **Review** - Check content and make adjustments
3. **Send Later** - Send when ready
4. **Track Results** - Monitor success rates

## ⚠️ Important Considerations

### **Rate Limiting**

- Farcaster has rate limits on notifications
- System sends notifications in batches
- Automatic delays between batches

### **User Consent**

- Only send to users who have enabled notifications
- Respect user preferences
- Don't spam users

### **Content Guidelines**

- Keep titles under 50 characters
- Keep body text under 200 characters
- Use emojis for engagement
- Include actionable information

## 🧪 Testing

### **Test Notifications**

1. **Create Test Notification**:
   - Title: "🧪 Test Notification"
   - Body: "This is a test notification from Quest Admin"
   - Target: Leave empty for all users

2. **Verify Delivery**:
   - Check Farcaster app for notification
   - Verify notification content
   - Check notification history

### **Error Handling**

- **Network Errors** - Check API connectivity
- **Validation Errors** - Check input requirements
- **Rate Limiting** - Wait and retry

## 🚀 Next Steps

1. **User Preferences** - Allow users to choose notification types
2. **Templates** - Create reusable notification templates
3. **Scheduling** - Schedule notifications for future sending
4. **Analytics** - Enhanced analytics dashboard
5. **A/B Testing** - Test different notification content

## 🆘 Troubleshooting

### **Common Issues**

1. **Notifications not sending**
   - Check BLUE_SQUARE_API_URL environment variable
   - Verify blue-square app is running
   - Check network connectivity

2. **High failure rates**
   - Check Farcaster API status
   - Verify user FIDs are stored
   - Review error logs

3. **Rate limiting**
   - Reduce notification frequency
   - Implement better batching
   - Add delays between notifications

### **Debug Mode**

Enable debug logging in the browser console to see detailed information about notification requests and responses.

---

**Need Help?** Check the Blue Square documentation or reach out to the development team for assistance with notifications. 