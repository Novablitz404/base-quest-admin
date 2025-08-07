"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reward, getAllRewards, toggleRewardStatus, deleteReward } from '../../lib/reward-service';

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      setLoading(true);
      const allRewards = await getAllRewards();
      setRewards(allRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (rewardId: string, currentStatus: boolean) => {
    try {
      await toggleRewardStatus(rewardId, !currentStatus);
      setRewards(prev => prev.map(reward => 
        reward.id === rewardId ? { ...reward, isActive: !currentStatus } : reward
      ));
    } catch (error) {
      console.error('Error toggling reward status:', error);
      alert('Error updating reward status');
    }
  };

  const handleDelete = async (rewardId: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;
    
    try {
      await deleteReward(rewardId);
      setRewards(prev => prev.filter(reward => reward.id !== rewardId));
    } catch (error) {
      console.error('Error deleting reward:', error);
      alert('Error deleting reward');
    }
  };

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case 'points': return 'bg-green-100 text-green-800';
      case 'nft': return 'bg-purple-100 text-purple-800';
      case 'token': return 'bg-blue-100 text-blue-800';
      case 'badge': return 'bg-yellow-100 text-yellow-800';
      case 'discount': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rewards Management</h1>
        <Link
          href="/rewards/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Reward
        </Link>
      </div>

      {rewards.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards yet</h3>
          <p className="text-gray-600 mb-4">Create your first reward to get started.</p>
          <Link
            href="/rewards/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Reward
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{reward.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRewardTypeColor(reward.type)}`}>
                      {reward.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reward.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {reward.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{reward.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Points Reward:</span> {reward.pointsReward}
                    </div>
                    <div>
                      <span className="font-medium">Required Level:</span> {reward.requirements.requiredLevel}
                    </div>
                    <div>
                      <span className="font-medium">Required Quests:</span> {reward.requirements.questIds.length}
                    </div>
                  </div>
                  
                  {reward.maxRedemptions && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Redemptions:</span> {reward.currentRedemptions} / {reward.maxRedemptions}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Link
                    href={`/rewards/${reward.id}/edit`}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(reward.id, reward.isActive)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      reward.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {reward.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {reward.requirements.questIds.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Required Quests:</h4>
                  <div className="flex flex-wrap gap-2">
                    {reward.requirements.questIds.map((questId) => (
                      <span
                        key={questId}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        Quest {questId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 