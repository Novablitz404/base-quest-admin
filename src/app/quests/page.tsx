"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quest, getAllQuests, toggleQuestStatus, deleteQuest } from '../../lib/quest-service';

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      setLoading(true);
      const allQuests = await getAllQuests();
      setQuests(allQuests);
    } catch (error) {
      console.error('Error loading quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (questId: string, currentStatus: boolean) => {
    try {
      await toggleQuestStatus(questId, !currentStatus);
      setQuests(prev => prev.map(quest => 
        quest.id === questId ? { ...quest, isActive: !currentStatus } : quest
      ));
    } catch (error) {
      console.error('Error toggling quest status:', error);
      alert('Error updating quest status');
    }
  };

  const handleDelete = async (questId: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) return;
    
    try {
      await deleteQuest(questId);
      setQuests(prev => prev.filter(quest => quest.id !== questId));
    } catch (error) {
      console.error('Error deleting quest:', error);
      alert('Error deleting quest');
    }
  };

  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'activity_based': return 'bg-blue-100 text-blue-800';
      case 'streak_based': return 'bg-green-100 text-green-800';
      case 'early_adopter': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredQuests = quests.filter(quest => {
    if (filter === 'active') return quest.isActive;
    if (filter === 'inactive') return !quest.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading quests...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quests Management</h1>
        <Link
          href="/quests/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Quest
        </Link>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({quests.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active ({quests.filter(q => q.isActive).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'inactive'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inactive ({quests.filter(q => !q.isActive).length})
          </button>
        </div>
      </div>

      {filteredQuests.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quests found</h3>
          <p className="text-gray-600 mb-4">Create your first quest to get started.</p>
          <Link
            href="/quests/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Quest
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredQuests.map((quest) => (
            <div key={quest.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{quest.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQuestTypeColor(quest.type)}`}>
                      {quest.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      quest.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {quest.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{quest.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Points Reward:</span> {quest.rewards.points}
                    </div>
                    <div>
                      <span className="font-medium">Start Date:</span> {formatDate(quest.startDate)}
                    </div>
                    {quest.endDate && (
                      <div>
                        <span className="font-medium">End Date:</span> {formatDate(quest.endDate)}
                      </div>
                    )}
                  </div>
                  
                  {/* Requirements */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Requirements:</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {quest.requirements.dailyLogins && (
                        <div>• Daily logins: {quest.requirements.dailyLogins}</div>
                      )}
                      {quest.requirements.activityCount && (
                        <div>• Activity count: {quest.requirements.activityCount}</div>
                      )}
                      {quest.requirements.streakDays && (
                        <div>• Streak days: {quest.requirements.streakDays}</div>
                      )}
                      {quest.requirements.targetDate && (
                        <div>• Target date: {quest.requirements.targetDate}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Link
                    href={`/quests/${quest.id}/edit`}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(quest.id, quest.isActive)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      quest.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {quest.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(quest.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 