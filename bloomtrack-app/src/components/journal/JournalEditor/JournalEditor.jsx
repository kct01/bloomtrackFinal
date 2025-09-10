import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournal } from '../../../hooks/useJournal';
import { useAchievements } from '../../../context/AchievementsContext';
import Button from '../../common/Button';
import Input from '../../common/Input';
import MoodTracker from '../MoodTracker';
import styles from './JournalEditor.module.css';

const JournalEditor = ({ 
  entryId = null, 
  onSave, 
  onCancel,
  className = '' 
}) => {
  const { addEntry, updateEntry, getEntry } = useJournal();
  const { trackJournalEntry, hasNewAwards, newAwards } = useAchievements();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: [],
    isPrivate: false
  });
  
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Load existing entry for editing
  useEffect(() => {
    if (entryId) {
      const entry = getEntry(entryId);
      if (entry) {
        setFormData({
          title: entry.title || '',
          content: entry.content || '',
          mood: entry.mood || 'neutral',
          tags: entry.tags || [],
          isPrivate: entry.isPrivate || false
        });
      }
    }
  }, [entryId, getEntry]);

  // Update word and character counts
  const updateCounts = useCallback((text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    setWordCount(words);
    setCharacterCount(characters);
  }, []);

  // Handle content change
  const handleContentChange = (e) => {
    const content = e.target.value;
    setFormData(prev => ({ ...prev, content }));
    updateCounts(content);
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle tag management
  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle save
  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSaving(true);
    
    try {
      const entryData = {
        ...formData,
        wordCount,
        characterCount,
        createdAt: entryId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let savedEntry;
      if (entryId) {
        savedEntry = await updateEntry(entryId, entryData);
      } else {
        savedEntry = await addEntry(entryData);
        // Track achievement for new entries only
        trackJournalEntry(wordCount);
      }

      // Check for new achievements and show them
      if (hasNewAwards) {
        setShowAchievements(true);
        setTimeout(() => setShowAchievements(false), 3000);
      }

      if (onSave) {
        onSave(savedEntry);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Reset form
      setFormData({
        title: '',
        content: '',
        mood: 'neutral',
        tags: [],
        isPrivate: false
      });
      setWordCount(0);
      setCharacterCount(0);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const achievementVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: -50,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`${styles.editorContainer} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Achievement Notifications */}
      <AnimatePresence>
        {showAchievements && newAwards.length > 0 && (
          <motion.div
            className={styles.achievementNotification}
            variants={achievementVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.achievementContent}>
              <h3>🎉 New Achievement!</h3>
              {newAwards.slice(0, 2).map(award => (
                <div key={award.id} className={styles.achievementItem}>
                  <span className={styles.achievementIcon}>{award.icon}</span>
                  <div>
                    <strong>{award.title}</strong>
                    <p>{award.description}</p>
                  </div>
                </div>
              ))}
              {newAwards.length > 2 && (
                <p className={styles.moreAchievements}>
                  +{newAwards.length - 2} more achievements!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Header */}
      <motion.div className={styles.editorHeader} variants={itemVariants}>
        <h2>{entryId ? 'Edit Entry' : 'New Journal Entry'}</h2>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <strong>{wordCount}</strong> words
          </span>
          <span className={styles.statItem}>
            <strong>{characterCount}</strong> characters
          </span>
        </div>
      </motion.div>

      {/* Title Input */}
      <motion.div className={styles.formGroup} variants={itemVariants}>
        <Input
          label="Entry Title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="What's on your mind today?"
          className={styles.titleInput}
          required
        />
      </motion.div>

      {/* Mood Tracker */}
      <motion.div className={styles.formGroup} variants={itemVariants}>
        <MoodTracker
          currentMood={formData.mood}
          onMoodChange={(mood) => handleInputChange('mood', mood)}
          showLabel={true}
        />
      </motion.div>

      {/* Content Editor */}
      <motion.div className={styles.formGroup} variants={itemVariants}>
        <label className={styles.label}>
          Your Thoughts
          <span className={styles.wordProgress}>
            {wordCount >= 100 && <span className={styles.milestone}><� 100+ words!</span>}
            {wordCount >= 250 && <span className={styles.milestone}>P 250+ words!</span>}
            {wordCount >= 500 && <span className={styles.milestone}><� 500+ words!</span>}
          </span>
        </label>
        <textarea
          className={styles.contentEditor}
          value={formData.content}
          onChange={handleContentChange}
          placeholder="Write about your pregnancy journey, how you're feeling, your hopes and dreams..."
          rows={12}
          required
        />
      </motion.div>

      {/* Tags */}
      <motion.div className={styles.formGroup} variants={itemVariants}>
        <label className={styles.label}>Tags (Optional)</label>
        <div className={styles.tagContainer}>
          {formData.tags.map(tag => (
            <span key={tag} className={styles.tag}>
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className={styles.removeTag}
                aria-label={`Remove tag ${tag}`}
              >
                �
              </button>
            </span>
          ))}
          <input
            type="text"
            className={styles.tagInput}
            placeholder="Add a tag..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                addTag(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
        </div>
      </motion.div>

      {/* Privacy Toggle */}
      <motion.div className={styles.formGroup} variants={itemVariants}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>
            Keep this entry private
          </span>
        </label>
      </motion.div>

      {/* Action Buttons */}
      <motion.div className={styles.actionButtons} variants={itemVariants}>
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving || !formData.title.trim() || !formData.content.trim()}
          loading={isSaving}
        >
          {entryId ? 'Update Entry' : 'Save Entry'}
        </Button>
      </motion.div>

      {/* Writing Tips */}
      {!entryId && wordCount < 50 && (
        <motion.div className={styles.writingTips} variants={itemVariants}>
          <h4> Writing Tips</h4>
          <ul>
            <li>Write about how you're feeling physically and emotionally</li>
            <li>Share your hopes and dreams for your baby</li>
            <li>Record memorable moments from your pregnancy journey</li>
            <li>Note any symptoms or changes you're experiencing</li>
            <li>Aim for 100+ words to unlock special achievements! <�</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JournalEditor;