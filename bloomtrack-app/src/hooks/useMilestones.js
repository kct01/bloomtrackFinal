import { useMilestones as useMilestonesContext } from '../context/MilestoneContext';
import { useMemo, useCallback, useState } from 'react';
import { differenceInDays, format, isAfter, isBefore, addDays } from 'date-fns';

export function useMilestones() {
  // Re-export the context hook for consistency
  return useMilestonesContext();
}

export function useMilestoneProgress(currentWeek) {
  const { milestones } = useMilestonesContext();

  const progress = useMemo(() => {
    const completed = milestones.filter(m => m.completed && m.week <= currentWeek);
    const upcoming = milestones.filter(m => !m.completed && m.week > currentWeek);
    const overdue = milestones.filter(m => !m.completed && m.week <= currentWeek);
    
    const total = milestones.length;
    const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;

    // Group by trimester
    const byTrimester = {
      1: milestones.filter(m => m.week <= 13),
      2: milestones.filter(m => m.week > 13 && m.week <= 27),
      3: milestones.filter(m => m.week > 27)
    };

    const trimesterProgress = Object.keys(byTrimester).reduce((acc, trimester) => {
      const trimesterMilestones = byTrimester[trimester];
      const trimesterCompleted = trimesterMilestones.filter(m => m.completed);
      acc[trimester] = {
        total: trimesterMilestones.length,
        completed: trimesterCompleted.length,
        percentage: trimesterMilestones.length > 0 
          ? Math.round((trimesterCompleted.length / trimesterMilestones.length) * 100)
          : 0
      };
      return acc;
    }, {});

    return {
      total,
      completed: completed.length,
      upcoming: upcoming.length,
      overdue: overdue.length,
      completionRate,
      trimesterProgress,
      recentlyCompleted: completed
        .filter(m => m.completedAt && differenceInDays(new Date(), new Date(m.completedAt)) <= 7)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    };
  }, [milestones, currentWeek]);

  return progress;
}

export function useMilestoneCategories() {
  const { milestones } = useMilestonesContext();

  const categories = useMemo(() => {
    const categoryMap = {};
    
    milestones.forEach(milestone => {
      const category = milestone.category || 'general';
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(milestone);
    });

    // Sort milestones within each category by week
    Object.keys(categoryMap).forEach(category => {
      categoryMap[category].sort((a, b) => a.week - b.week);
    });

    return categoryMap;
  }, [milestones]);

  const getCategoryStats = useCallback((category) => {
    const categoryMilestones = categories[category] || [];
    const completed = categoryMilestones.filter(m => m.completed);
    
    return {
      total: categoryMilestones.length,
      completed: completed.length,
      percentage: categoryMilestones.length > 0 
        ? Math.round((completed.length / categoryMilestones.length) * 100)
        : 0,
      milestones: categoryMilestones
    };
  }, [categories]);

  return {
    categories,
    categoryNames: Object.keys(categories),
    getCategoryStats
  };
}

export function useMilestoneTemplates() {
  const templates = useMemo(() => ({
    medical: [
      { title: 'First Prenatal Visit', week: 8, category: 'medical', icon: '🏥' },
      { title: 'First Ultrasound', week: 8, category: 'medical', icon: '📸' },
      { title: 'NT Scan', week: 12, category: 'medical', icon: '🔍' },
      { title: 'Anatomy Scan', week: 20, category: 'medical', icon: '👶' },
      { title: 'Glucose Test', week: 24, category: 'medical', icon: '🩸' },
      { title: 'Group B Strep Test', week: 36, category: 'medical', icon: '🧪' }
    ],
    physical: [
      { title: 'First Heartbeat', week: 6, category: 'physical', icon: '💓' },
      { title: 'Morning Sickness Starts', week: 6, category: 'physical', icon: '🤢' },
      { title: 'Baby Bump Showing', week: 16, category: 'physical', icon: '🤰' },
      { title: 'First Movement', week: 18, category: 'physical', icon: '👶' },
      { title: 'First Kick', week: 20, category: 'physical', icon: '🦵' },
      { title: 'Braxton Hicks', week: 28, category: 'physical', icon: '💪' }
    ],
    emotional: [
      { title: 'Pregnancy Announcement', week: 12, category: 'emotional', icon: '📢' },
      { title: 'Gender Reveal', week: 16, category: 'emotional', icon: '🎉' },
      { title: 'Choose Baby Name', week: 20, category: 'emotional', icon: '📝' },
      { title: 'Nesting Instinct', week: 32, category: 'emotional', icon: '🏡' },
      { title: 'Hospital Bag Packed', week: 35, category: 'emotional', icon: '👜' }
    ],
    preparation: [
      { title: 'Start Prenatal Vitamins', week: 4, category: 'preparation', icon: '💊' },
      { title: 'Research Birth Classes', week: 16, category: 'preparation', icon: '📚' },
      { title: 'Create Birth Plan', week: 28, category: 'preparation', icon: '📋' },
      { title: 'Install Car Seat', week: 35, category: 'preparation', icon: '🚗' },
      { title: 'Finish Nursery', week: 36, category: 'preparation', icon: '🛏️' }
    ]
  }), []);

  const getAllTemplates = useCallback(() => {
    return Object.values(templates).flat();
  }, [templates]);

  const getTemplatesByCategory = useCallback((category) => {
    return templates[category] || [];
  }, [templates]);

  const getTemplatesByWeek = useCallback((week) => {
    return getAllTemplates().filter(template => template.week === week);
  }, [getAllTemplates]);

  return {
    templates,
    getAllTemplates,
    getTemplatesByCategory,
    getTemplatesByWeek,
    categories: Object.keys(templates)
  };
}

export function useMilestoneSharing() {
  const generateShareData = useCallback((milestone) => {
    const shareText = `Pregnancy Milestone: ${milestone.title} at ${milestone.week} weeks! ${milestone.description || ''} #BloomTrack #PregnancyJourney`;
    
    return {
      title: `Pregnancy Milestone: ${milestone.title}`,
      text: shareText,
      url: window.location.origin + `/milestones/${milestone.id}`,
      hashtags: ['BloomTrack', 'PregnancyJourney', `Week${milestone.week}`]
    };
  }, []);

  const shareToSocialMedia = useCallback((milestone, platform) => {
    const shareData = generateShareData(milestone);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareData.url)}&description=${encodeURIComponent(shareData.text)}`,
      instagram: null // Instagram doesn't support direct URL sharing
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'noopener,noreferrer');
      return true;
    }
    
    return false;
  }, [generateShareData]);

  return {
    generateShareData,
    shareToSocialMedia
  };
}

export function useMilestoneCelebrations() {
  const [celebrations, setCelebrations] = useState([]);

  const triggerCelebration = useCallback((milestone) => {
    const celebration = {
      id: Date.now().toString(),
      milestoneId: milestone.id,
      milestone,
      triggeredAt: new Date().toISOString(),
      viewed: false
    };
    
    setCelebrations(prev => [celebration, ...prev]);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      setCelebrations(prev => prev.filter(c => c.id !== celebration.id));
    }, 10000);
    
    return celebration.id;
  }, []);

  const markCelebrationViewed = useCallback((celebrationId) => {
    setCelebrations(prev => prev.map(celebration => 
      celebration.id === celebrationId 
        ? { ...celebration, viewed: true }
        : celebration
    ));
  }, []);

  const dismissCelebration = useCallback((celebrationId) => {
    setCelebrations(prev => prev.filter(c => c.id !== celebrationId));
  }, []);

  const activeCelebrations = useMemo(() => {
    return celebrations.filter(c => !c.viewed);
  }, [celebrations]);

  return {
    celebrations,
    activeCelebrations,
    triggerCelebration,
    markCelebrationViewed,
    dismissCelebration
  };
}

export default useMilestones;