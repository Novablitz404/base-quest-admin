import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  getDocs,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

export interface Quest {
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

// Create a new quest
export async function createQuest(questData: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const questRef = doc(collection(db, 'quests'));
    const now = Timestamp.now();
    
    const quest: Quest = {
      ...questData,
      id: questRef.id,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    };

    await setDoc(questRef, {
      ...quest,
      createdAt: now,
      updatedAt: now,
      startDate: Timestamp.fromDate(questData.startDate),
      endDate: questData.endDate ? Timestamp.fromDate(questData.endDate) : null
    });

    return questRef.id;
  } catch (error) {
    console.error('Error creating quest:', error);
    throw error;
  }
}

// Get all quests
export async function getAllQuests(): Promise<Quest[]> {
  try {
    const q = query(collection(db, 'quests'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate() || new Date(),
      endDate: doc.data().endDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Quest[];
  } catch (error) {
    console.error('Error fetching quests:', error);
    throw error;
  }
}

// Get a single quest by ID
export async function getQuestById(id: string): Promise<Quest | null> {
  try {
    const questRef = doc(db, 'quests', id);
    const questDoc = await getDoc(questRef);
    
    if (questDoc.exists()) {
      const data = questDoc.data();
      return {
        id: questDoc.id,
        ...data,
        startDate: data.startDate?.toDate() || new Date(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Quest;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching quest:', error);
    throw error;
  }
}

// Update a quest
export async function updateQuest(id: string, questData: Partial<Quest>): Promise<void> {
  try {
    const questRef = doc(db, 'quests', id);
    const now = Timestamp.now();
    
    const updateData: Partial<Quest> = {
      ...questData,
      updatedAt: now.toDate()
    };

    // Convert Date objects to Timestamps for Firestore
    if (questData.startDate) {
      updateData.startDate = questData.startDate;
    }
    if (questData.endDate) {
      updateData.endDate = questData.endDate;
    }

    await updateDoc(questRef, {
      ...updateData,
      updatedAt: now,
      startDate: questData.startDate ? Timestamp.fromDate(questData.startDate) : undefined,
      endDate: questData.endDate ? Timestamp.fromDate(questData.endDate) : undefined
    });
  } catch (error) {
    console.error('Error updating quest:', error);
    throw error;
  }
}

// Delete a quest
export async function deleteQuest(id: string): Promise<void> {
  try {
    const questRef = doc(db, 'quests', id);
    await deleteDoc(questRef);
  } catch (error) {
    console.error('Error deleting quest:', error);
    throw error;
  }
}

// Toggle quest active status
export async function toggleQuestStatus(id: string, isActive: boolean): Promise<void> {
  try {
    const questRef = doc(db, 'quests', id);
    await updateDoc(questRef, {
      isActive,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error toggling quest status:', error);
    throw error;
  }
} 