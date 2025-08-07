import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'points' | 'nft' | 'token' | 'badge' | 'discount';
  pointsReward: number;
  requirements: {
    questIds: string[];
    requiredLevel: number;
  };
  isActive: boolean;
  maxRedemptions?: number;
  currentRedemptions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  rewardType: string;
  pointsReward: number;
  redeemedAt: Date;
  status: 'pending' | 'claimed' | 'expired';
}

// Create a new reward
export async function createReward(rewardData: Omit<Reward, 'id' | 'createdAt' | 'updatedAt' | 'currentRedemptions'>): Promise<string> {
  try {
    const rewardRef = doc(collection(db, 'rewards'));
    const now = Timestamp.now();
    
    const reward: Reward = {
      ...rewardData,
      id: rewardRef.id,
      currentRedemptions: 0,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    };

    await setDoc(rewardRef, {
      ...reward,
      createdAt: now,
      updatedAt: now
    });

    return rewardRef.id;
  } catch (error) {
    console.error('Error creating reward:', error);
    throw error;
  }
}

// Get all rewards
export async function getAllRewards(): Promise<Reward[]> {
  try {
    const q = query(collection(db, 'rewards'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Reward[];
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw error;
  }
}

// Get a single reward by ID
export async function getRewardById(id: string): Promise<Reward | null> {
  try {
    const rewardRef = doc(db, 'rewards', id);
    const rewardDoc = await getDoc(rewardRef);
    
    if (rewardDoc.exists()) {
      const data = rewardDoc.data();
      return {
        id: rewardDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Reward;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching reward:', error);
    throw error;
  }
}

// Update a reward
export async function updateReward(id: string, rewardData: Partial<Reward>): Promise<void> {
  try {
    const rewardRef = doc(db, 'rewards', id);
    const now = Timestamp.now();
    
    const updateData: Partial<Reward> = {
      ...rewardData,
      updatedAt: now.toDate()
    };

    await updateDoc(rewardRef, {
      ...updateData,
      updatedAt: now
    });
  } catch (error) {
    console.error('Error updating reward:', error);
    throw error;
  }
}

// Delete a reward
export async function deleteReward(id: string): Promise<void> {
  try {
    const rewardRef = doc(db, 'rewards', id);
    await deleteDoc(rewardRef);
  } catch (error) {
    console.error('Error deleting reward:', error);
    throw error;
  }
}

// Toggle reward active status
export async function toggleRewardStatus(id: string, isActive: boolean): Promise<void> {
  try {
    const rewardRef = doc(db, 'rewards', id);
    await updateDoc(rewardRef, {
      isActive,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error toggling reward status:', error);
    throw error;
  }
}

// Record user reward redemption
export async function recordUserReward(userId: string, reward: Reward): Promise<void> {
  try {
    const userRewardRef = doc(collection(db, 'userRewards'));
    const now = Timestamp.now();
    
    const userReward: UserReward = {
      id: userRewardRef.id,
      userId,
      rewardId: reward.id,
      rewardName: reward.name,
      rewardType: reward.type,
      pointsReward: reward.pointsReward,
      redeemedAt: now.toDate(),
      status: 'claimed'
    };

    await setDoc(userRewardRef, {
      ...userReward,
      redeemedAt: now
    });

    // Update reward redemption count
    const rewardRef = doc(db, 'rewards', reward.id);
    await updateDoc(rewardRef, {
      currentRedemptions: reward.currentRedemptions + 1,
      updatedAt: now
    });
  } catch (error) {
    console.error('Error recording user reward:', error);
    throw error;
  }
}

// Check if user has already redeemed a reward
export async function hasUserRedeemedReward(userId: string, rewardId: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'userRewards'),
      where('userId', '==', userId),
      where('rewardId', '==', rewardId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user reward redemption:', error);
    return false;
  }
}

// Get user's redeemed rewards
export async function getUserRewards(userId: string): Promise<UserReward[]> {
  try {
    const q = query(
      collection(db, 'userRewards'),
      where('userId', '==', userId),
      orderBy('redeemedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      redeemedAt: doc.data().redeemedAt?.toDate() || new Date()
    })) as UserReward[];
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    return [];
  }
} 