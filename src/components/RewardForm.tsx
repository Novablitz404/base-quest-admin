"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createReward, updateReward, getRewardById } from '../lib/reward-service';
import { Quest, getAllQuests } from '../lib/quest-service';

interface RewardFormProps {
  rewardId?: string;
}

export default function RewardForm({ rewardId }: RewardFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'points' as 'points' | 'nft' | 'token' | 'badge' | 'discount',
    pointsReward: 0,
    requiredLevel: 0,
    questIds: [] as string[],
    isActive: true,
    maxRedemptions: undefined as number | undefined
  });

  const loadQuests = useCallback(async () => {
    try {
      const allQuests = await getAllQuests();
      setQuests(allQuests);
    } catch (error) {
      console.error('Error loading quests:', error);
    }
  }, []);

  const loadReward = useCallback(async () => {
    if (!rewardId) return;
    
    try {
      setLoading(true);
      const reward = await getRewardById(rewardId);
      if (reward) {
        setFormData({
          name: reward.name,
          description: reward.description,
          type: reward.type,
          pointsReward: reward.pointsReward,
          requiredLevel: reward.requirements.requiredLevel,
          questIds: reward.requirements.questIds,
          isActive: reward.isActive,
          maxRedemptions: reward.maxRedemptions
        });
      }
    } catch (error) {
      console.error('Error loading reward:', error);
    } finally {
      setLoading(false);
    }
  }, [rewardId]);

  useEffect(() => {
    loadQuests();
    if (rewardId) {
      loadReward();
    }
  }, [loadQuests, loadReward]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const rewardData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        pointsReward: formData.pointsReward,
        requirements: {
          questIds: formData.questIds,
          requiredLevel: formData.requiredLevel
        },
        isActive: formData.isActive,
        maxRedemptions: formData.maxRedemptions
      };

      if (rewardId) {
        await updateReward(rewardId, rewardData);
      } else {
        await createReward(rewardData);
      }

      router.push('/rewards');
    } catch (error) {
      console.error('Error saving reward:', error);
      alert('Error saving reward. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestToggle = (questId: string) => {
    setFormData(prev => ({
      ...prev,
      questIds: prev.questIds.includes(questId)
        ? prev.questIds.filter(id => id !== questId)
        : [...prev.questIds, questId]
    }));
  };

  if (loading && rewardId) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {rewardId ? 'Edit Reward' : 'Create New Reward'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'points' | 'nft' | 'token' | 'badge' | 'discount' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="points">Points</option>
                <option value="nft">NFT</option>
                <option value="token">Token</option>
                <option value="badge">Badge</option>
                <option value="discount">Discount</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points Reward
              </label>
              <input
                type="number"
                value={formData.pointsReward}
                onChange={(e) => setFormData(prev => ({ ...prev, pointsReward: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Level
              </label>
              <input
                type="number"
                value={formData.requiredLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, requiredLevel: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Redemptions (optional)
              </label>
              <input
                type="number"
                value={formData.maxRedemptions || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  maxRedemptions: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Quest Requirements */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Quest Requirements</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select quests that users must complete to be eligible for this reward:
          </p>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {quests.map((quest) => (
              <label key={quest.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.questIds.includes(quest.id)}
                  onChange={() => handleQuestToggle(quest.id)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">{quest.title}</div>
                  <div className="text-sm text-gray-600">{quest.description}</div>
                </div>
              </label>
            ))}
          </div>
          
          {quests.length === 0 && (
            <p className="text-sm text-gray-500 italic">No quests available. Create some quests first.</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/rewards')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : (rewardId ? 'Update Reward' : 'Create Reward')}
          </button>
        </div>
      </form>
    </div>
  );
} 