'use client';

import { useState, useEffect } from 'react';
import { Quest } from '@/lib/quest-service';

interface QuestFormProps {
  quest?: Quest;
  onSubmit: (questData: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function QuestForm({ quest, onSubmit, onCancel, loading = false }: QuestFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'activity_based' as Quest['type'],
    requirements: {
      dailyLogins: 0,
      targetDate: '',
      activityCount: 0,
      streakDays: 0,
      shareCount: 0,
      shareContent: '',
      dailyShareLimit: 0,
    },
    rewards: {
      points: 0,
    },
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (quest) {
      setFormData({
        title: quest.title,
        description: quest.description,
        type: quest.type,
        requirements: {
          dailyLogins: quest.requirements.dailyLogins || 0,
          targetDate: quest.requirements.targetDate || '',
          activityCount: quest.requirements.activityCount || 0,
          streakDays: quest.requirements.streakDays || 0,
          shareCount: quest.requirements.shareCount || 0,
          shareContent: quest.requirements.shareContent || '',
          dailyShareLimit: quest.requirements.dailyShareLimit || 0,
        },
        rewards: {
          points: quest.rewards.points,
        },
        isActive: quest.isActive,
        startDate: quest.startDate.toISOString().split('T')[0],
        endDate: quest.endDate ? quest.endDate.toISOString().split('T')[0] : '',
      });
    }
  }, [quest]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.rewards.points <= 0) {
      newErrors.points = 'Points must be greater than 0';
    }

    // Type-specific validations
    switch (formData.type) {
      case 'streak_based':
        if (formData.requirements.streakDays <= 0) {
          newErrors.streakDays = 'Streak days must be greater than 0';
        }
        break;
      case 'early_adopter':
        if (!formData.requirements.targetDate) {
          newErrors.targetDate = 'Target date is required for early adopter quests';
        }
        break;
      case 'activity_based':
        if (formData.requirements.activityCount <= 0) {
          newErrors.activityCount = 'Activity count must be greater than 0';
        }
        break;
      case 'share_based':
        if (formData.requirements.shareCount <= 0) {
          newErrors.shareCount = 'Share count must be greater than 0';
        }
        if (!formData.requirements.shareContent || formData.requirements.shareContent.trim() === '') {
          newErrors.shareContent = 'Share content is required for share-based quests';
        }
        if (formData.requirements.dailyShareLimit < 0) {
          newErrors.dailyShareLimit = 'Daily share limit cannot be negative';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const questData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
    };

    await onSubmit(questData);
  };

  const handleInputChange = (field: string, value: string | boolean | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRequirementsChange = (field: string, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [field]: value
      }
    }));
  };

  const handleRewardsChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        [field]: value
      }
    }));
  };

  const steps = [
    { id: 1, name: 'Basic Information', icon: '📝' },
    { id: 2, name: 'Requirements', icon: '🎯' },
    { id: 3, name: 'Rewards', icon: '🏆' },
    { id: 4, name: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                activeStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                <span className="text-sm font-medium">{step.icon}</span>
              </div>
              <span className={`ml-2 text-sm font-medium ${
                activeStep >= step.id ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  activeStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Information */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 ${activeStep === 1 ? 'block' : 'hidden'}`}>
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
              <p className="text-gray-600">Provide the essential details for your quest</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Quest Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter quest title..."
              />
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe what users need to do to complete this quest..."
              />
              {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                Quest Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="activity_based">Activity Based - Complete specific activities</option>
                <option value="early_adopter">Early Adopter - Join before a specific date</option>
                <option value="streak_based">Streak Based - Maintain a login streak</option>
                <option value="share_based">Share Based - Share content on Farcaster</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next: Requirements
            </button>
          </div>
        </div>

        {/* Step 2: Requirements */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 ${activeStep === 2 ? 'block' : 'hidden'}`}>
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Requirements</h3>
              <p className="text-gray-600">Set the conditions users must meet to complete this quest</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.type === 'streak_based' && (
              <div>
                <label htmlFor="streakDays" className="block text-sm font-semibold text-gray-700 mb-2">
                  Streak Days Required *
                </label>
                <input
                  type="number"
                  id="streakDays"
                  min="1"
                  value={formData.requirements.streakDays}
                  onChange={(e) => handleRequirementsChange('streakDays', parseInt(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.streakDays ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter number of streak days..."
                />
                {errors.streakDays && <p className="mt-2 text-sm text-red-600">{errors.streakDays}</p>}
              </div>
            )}

            {formData.type === 'early_adopter' && (
              <div>
                <label htmlFor="targetDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Date *
                </label>
                <input
                  type="date"
                  id="targetDate"
                  value={formData.requirements.targetDate}
                  onChange={(e) => handleRequirementsChange('targetDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.targetDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.targetDate && <p className="mt-2 text-sm text-red-600">{errors.targetDate}</p>}
              </div>
            )}

            {formData.type === 'activity_based' && (
              <div>
                <label htmlFor="activityCount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Activity Count Required *
                </label>
                <input
                  type="number"
                  id="activityCount"
                  min="1"
                  value={formData.requirements.activityCount}
                  onChange={(e) => handleRequirementsChange('activityCount', parseInt(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.activityCount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter number of activities..."
                />
                {errors.activityCount && <p className="mt-2 text-sm text-red-600">{errors.activityCount}</p>}
              </div>
            )}

            {formData.type === 'share_based' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="shareCount" className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Shares Required *
                  </label>
                  <input
                    type="number"
                    id="shareCount"
                    min="1"
                    value={formData.requirements.shareCount}
                    onChange={(e) => handleRequirementsChange('shareCount', parseInt(e.target.value))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.shareCount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter total number of shares needed..."
                  />
                  {errors.shareCount && <p className="mt-2 text-sm text-red-600">{errors.shareCount}</p>}
                </div>

                <div>
                  <label htmlFor="shareContent" className="block text-sm font-semibold text-gray-700 mb-2">
                    Share Content *
                  </label>
                  <textarea
                    id="shareContent"
                    rows={4}
                    value={formData.requirements.shareContent}
                    onChange={(e) => handleRequirementsChange('shareContent', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.shareContent ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter the content users will share on Farcaster..."
                  />
                  {errors.shareContent && <p className="mt-2 text-sm text-red-600">{errors.shareContent}</p>}
                  <p className="mt-2 text-sm text-gray-500">
                    This text will be pre-filled when users open the Farcaster composer. They can edit it before sharing.
                  </p>
                </div>

                <div>
                  <label htmlFor="dailyShareLimit" className="block text-sm font-semibold text-gray-700 mb-2">
                    Daily Share Limit
                  </label>
                  <input
                    type="number"
                    id="dailyShareLimit"
                    min="0"
                    value={formData.requirements.dailyShareLimit}
                    onChange={(e) => handleRequirementsChange('dailyShareLimit', parseInt(e.target.value))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.dailyShareLimit ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter max shares per day (0 = no limit)..."
                  />
                  {errors.dailyShareLimit && <p className="mt-2 text-sm text-red-600">{errors.dailyShareLimit}</p>}
                  <p className="mt-2 text-sm text-gray-500">
                    Set to 0 for no daily limit, or specify max shares per day (e.g., 1 = once per day, 3 = three times per day)
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next: Rewards
            </button>
          </div>
        </div>

        {/* Step 3: Rewards */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 ${activeStep === 3 ? 'block' : 'hidden'}`}>
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Rewards</h3>
              <p className="text-gray-600">Define what users will earn for completing this quest</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="points" className="block text-sm font-semibold text-gray-700 mb-2">
                Points Reward *
              </label>
              <input
                type="number"
                id="points"
                value={formData.rewards.points}
                onChange={(e) => handleRewardsChange('points', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter points reward..."
                min="1"
              />
              {errors.points && <p className="mt-2 text-sm text-red-600">{errors.points}</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next: Settings
            </button>
          </div>
        </div>

        {/* Step 4: Settings */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 ${activeStep === 4 ? 'block' : 'hidden'}`}>
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-gray-100 mr-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Settings</h3>
              <p className="text-gray-600">Configure when this quest will be available</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Active Quest</span>
            </label>
            <p className="mt-1 text-sm text-gray-500">Only active quests will be visible to users</p>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </div>
              ) : (
                quest ? 'Update Quest' : 'Create Quest'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Navigation */}
      <div className="mt-8 flex justify-center">
        <div className="flex space-x-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStep === step.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {step.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 