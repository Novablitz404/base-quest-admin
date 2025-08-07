# Quest Admin Panel

A Next.js admin panel for managing quests in the Blue Square mini app. This application allows administrators to create, edit, and manage quests that are stored in Firebase and can be read by the Blue Square mini app.

## Features

- **Quest Management**: Create, edit, and delete quests
- **Quest Types**: Support for different quest types:
  - Activity Based: Require users to complete a certain number of activities
  - Daily Login: Require users to log in for a specified number of days
  - Early Adopter: Available to users who join before a specific date
  - Streak Based: Require users to maintain a login streak
- **Real-time Updates**: Changes are immediately reflected in the Blue Square mini app
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Firebase Integration**: Secure data storage and retrieval

## Prerequisites

- Node.js 18+ 
- Firebase project with Firestore enabled
- Firebase configuration credentials

## Setup

1. **Clone and Install Dependencies**
   ```bash
   cd quest-admin
   npm install
   ```

2. **Environment Configuration**
   Copy the environment example file and configure your Firebase credentials:
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Firebase project credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Create a collection named `quests` in Firestore
   - Set up security rules for the `quests` collection

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Dashboard
The main dashboard shows all quests in a table format with:
- Quest title and description
- Quest type
- Active/Inactive status
- Reward information
- Creation date
- Action buttons (Edit/Delete)

### Creating Quests
1. Click "Create New Quest" on the dashboard
2. Fill in the quest details:
   - **Basic Information**: Title, description, and quest type
   - **Requirements**: Type-specific requirements (e.g., activity count, streak days)
   - **Rewards**: Points
   - **Settings**: Start/end dates and active status
3. Click "Create Quest" to save

### Editing Quests
1. Click "Edit" on any quest in the dashboard
2. Modify the quest details as needed
3. Click "Update Quest" to save changes

### Quest Types

#### Activity Based
- Requires users to complete a specific number of on-chain activities
- Set the `Activity Count Required` field

#### Daily Login
- Requires users to log in for a specified number of consecutive days
- Set the `Daily Logins Required` field

#### Early Adopter
- Available to users who join before a specific date
- Set the `Target Date` field

#### Streak Based
- Requires users to maintain a login streak for a specified number of days
- Set the `Streak Days Required` field

## Quest Structure

Each quest in Firebase has the following structure:

```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'early_adopter' | 'activity_based' | 'streak_based';
  requirements: {
    dailyLogins?: number;
    targetDate?: string;
    activityCount?: number;
    streakDays?: number;
  };
  rewards: {
    points: number;
  };
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Integration with Blue Square Mini App

The Blue Square mini app reads quests from the same Firebase collection (`quests`) that this admin panel manages. When you create or update quests in this admin panel, they will automatically be available in the Blue Square mini app.

The Blue Square app uses the `getQuestsFromFirebase()` function to fetch active quests and display them to users.

## Development

### Project Structure
```
quest-admin/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── page.tsx        # Dashboard
│   │   └── quests/         # Quest management pages
│   ├── components/         # Reusable components
│   │   └── QuestForm.tsx  # Quest creation/edit form
│   └── lib/               # Utility functions
│       ├── firebase.ts    # Firebase configuration
│       └── quest-service.ts # Quest CRUD operations
├── public/                # Static assets
└── package.json
```

### Key Files
- `src/app/page.tsx`: Main dashboard with quest list
- `src/components/QuestForm.tsx`: Reusable form for creating/editing quests
- `src/lib/quest-service.ts`: Firebase operations for quests
- `src/lib/firebase.ts`: Firebase configuration

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Security Considerations

- Firebase security rules should be configured to restrict access to the `quests` collection
- Consider implementing authentication for the admin panel
- Use environment variables for all sensitive configuration
- Regularly review and update dependencies

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify your Firebase configuration in `.env.local`
   - Ensure Firestore is enabled in your Firebase project
   - Check Firebase security rules

2. **Quest Not Appearing in Blue Square App**
   - Verify the quest is marked as `isActive: true`
   - Check that the quest's `startDate` is in the past
   - Ensure the quest's `endDate` (if set) is in the future

3. **Form Validation Errors**
   - Fill in all required fields marked with *
   - Ensure numeric fields have positive values
   - Check date formats are correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Blue Square mini app ecosystem.
