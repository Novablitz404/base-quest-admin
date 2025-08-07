'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import QuestForm from '@/components/QuestForm';
import { getQuestById, updateQuest } from '@/lib/quest-service';
import { Quest } from '@/lib/quest-service';

export default function EditQuestPage() {
  const router = useRouter();
  const params = useParams();
  const questId = params.id as string;
  
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuest = useCallback(async () => {
    try {
      setLoading(true);
      const questData = await getQuestById(questId);
      
      if (!questData) {
        setError('Quest not found');
        return;
      }
      
      setQuest(questData);
    } catch (err) {
      setError('Failed to load quest');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [questId]);

  useEffect(() => {
    loadQuest();
  }, [loadQuest]);

  const handleSubmit = async (questData: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setSaving(true);
      setError(null);
      
      await updateQuest(questId, questData);
      
      // Redirect to dashboard after successful update
      router.push('/');
    } catch (err) {
      setError('Failed to update quest. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading quest...</p>
        </div>
      </div>
    );
  }

  if (error && !quest) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-900 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-900 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Quest</h1>
              <p className="text-gray-600 mt-2">Update quest details for the Blue Square mini app</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Quest Form */}
      {quest && (
        <QuestForm
          quest={quest}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      )}
    </div>
  );
} 