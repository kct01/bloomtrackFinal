import { useJournal as useJournalContext } from '../context/JournalContext';
import { useMemo, useCallback, useState } from 'react';
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

export function useJournal() {
  // Re-export the context hook for consistency
  return useJournalContext();
}

export function useJournalStats(timeframe = 'all') {
  const { entries } = useJournalContext();

  const stats = useMemo(() => {
    let relevantEntries = [...entries];

    // Filter by timeframe
    const now = new Date();
    if (timeframe === 'week') {
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      relevantEntries = entries.filter(entry => 
        isWithinInterval(parseISO(entry.date), { start: weekStart, end: weekEnd })
      );
    } else if (timeframe === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      relevantEntries = entries.filter(entry => 
        isWithinInterval(parseISO(entry.date), { start: monthStart, end: monthEnd })
      );
    }

    // Calculate entry type distribution
    const typeCounts = relevantEntries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    }, {});

    // Calculate mood distribution
    const moodCounts = relevantEntries.reduce((acc, entry) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      }
      return acc;
    }, {});

    // Calculate average word count
    const wordCounts = relevantEntries.map(entry => 
      entry.content ? entry.content.split(/\s+/).filter(word => word.length > 0).length : 0
    );
    const averageWordCount = wordCounts.length > 0 
      ? Math.round(wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length)
      : 0;

    // Find longest streak
    const sortedEntries = relevantEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate = null;

    sortedEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (lastDate && (entryDate - lastDate) === 86400000) { // 1 day difference
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
      lastDate = entryDate;
    });

    // Calculate writing frequency
    const totalDays = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
    const writingFrequency = Math.round((relevantEntries.length / totalDays) * 100);

    return {
      totalEntries: relevantEntries.length,
      typeCounts,
      moodCounts,
      averageWordCount,
      longestStreak,
      writingFrequency,
      timeframe
    };
  }, [entries, timeframe]);

  return stats;
}

export function useJournalSearch(query = '', filters = {}) {
  const { entries } = useJournalContext();

  const searchResults = useMemo(() => {
    if (!query.trim() && Object.keys(filters).length === 0) {
      return entries;
    }

    let filtered = [...entries];

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title?.toLowerCase().includes(searchTerm) ||
        entry.content?.toLowerCase().includes(searchTerm) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by type
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(entry => filters.types.includes(entry.type));
    }

    // Filter by mood
    if (filters.moods && filters.moods.length > 0) {
      filtered = filtered.filter(entry => entry.mood && filters.moods.includes(entry.mood));
    }

    // Filter by date range
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      });
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(entry => 
        entry.tags && filters.tags.some(tag => entry.tags.includes(tag))
      );
    }

    // Sort results by relevance (date desc by default)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, query, filters]);

  return searchResults;
}

export function useJournalPrompts() {
  const prompts = useMemo(() => ({
    daily: [
      "How are you feeling physically today?",
      "What emotions are you experiencing right now?",
      "What is your baby doing today that you can feel?",
      "What are you grateful for in this moment?",
      "What hopes do you have for today?",
      "What would you like to remember about today?",
      "How has your body changed recently?",
      "What are you looking forward to this week?",
      "What support do you need right now?",
      "What small joy did you experience today?"
    ],
    weekly: [
      "How has this week been different from last week?",
      "What pregnancy milestone are you approaching?",
      "What preparations have you made for the baby?",
      "How are you taking care of yourself?",
      "What questions do you have for your next appointment?",
      "What has surprised you about pregnancy this week?",
      "How is your relationship with your partner evolving?",
      "What fears or anxieties are you working through?",
      "What are you most excited about right now?",
      "How are you connecting with your baby?"
    ],
    letterToBaby: [
      "What do you want your baby to know about this time?",
      "What hopes and dreams do you have for your child?",
      "What values do you want to share with your baby?",
      "What is happening in the world right now that you want to remember?",
      "What traditions do you want to pass on?",
      "What do you love most about being pregnant?",
      "What kind of parent do you hope to be?",
      "What do you want your baby to know about their family?",
      "What advice would you give your child?",
      "What song or story do you want to share?"
    ],
    gratitude: [
      "What about your pregnancy are you most thankful for?",
      "Who in your support system are you grateful for today?",
      "What ability of your body amazes you right now?",
      "What small moment brought you joy today?",
      "What aspect of your healthcare are you thankful for?",
      "What preparation or plan are you grateful to have in place?",
      "What unexpected gift has pregnancy brought you?",
      "What strength have you discovered in yourself?",
      "What comfort or luxury are you appreciating today?",
      "What future moment are you most grateful to anticipate?"
    ],
    reflection: [
      "How have you grown since becoming pregnant?",
      "What has been the most challenging aspect of pregnancy so far?",
      "What has been the most beautiful part of this journey?",
      "How has your perspective on life changed?",
      "What have you learned about yourself?",
      "How has your relationship with your body evolved?",
      "What support systems have you built or strengthened?",
      "What fears have you faced and overcome?",
      "What traditions or rituals have become meaningful?",
      "How do you want to remember this time in your life?"
    ]
  }), []);

  const getRandomPrompt = useCallback((type = 'daily') => {
    const categoryPrompts = prompts[type] || prompts.daily;
    return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
  }, [prompts]);

  const getPromptsForType = useCallback((type) => {
    return prompts[type] || [];
  }, [prompts]);

  return {
    prompts,
    getRandomPrompt,
    getPromptsForType,
    categories: Object.keys(prompts)
  };
}

export function useJournalTags() {
  const { entries } = useJournalContext();

  const allTags = useMemo(() => {
    const tagCounts = {};
    
    entries.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([tag, count]) => ({ tag, count }));
  }, [entries]);

  const popularTags = useMemo(() => 
    allTags.slice(0, 10)
  , [allTags]);

  const getTagSuggestions = useCallback((input) => {
    const lowerInput = input.toLowerCase();
    return allTags
      .filter(({ tag }) => tag.toLowerCase().includes(lowerInput))
      .slice(0, 5)
      .map(({ tag }) => tag);
  }, [allTags]);

  return {
    allTags,
    popularTags,
    getTagSuggestions,
    totalTags: allTags.length
  };
}

export function useJournalReminders() {
  const [reminders, setReminders] = useState([]);

  const addReminder = useCallback((reminder) => {
    const newReminder = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      active: true,
      ...reminder
    };
    
    setReminders(prev => [...prev, newReminder]);
    return newReminder.id;
  }, []);

  const updateReminder = useCallback((id, updates) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, ...updates } : reminder
    ));
  }, []);

  const deleteReminder = useCallback((id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  }, []);

  const getActiveReminders = useCallback(() => {
    return reminders.filter(reminder => reminder.active);
  }, [reminders]);

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getActiveReminders
  };
}

export default useJournal;