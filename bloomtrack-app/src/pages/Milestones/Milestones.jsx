import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useMilestones } from '../../context/MilestoneContext';
import Button from '../../components/common/Button';
import PhotoUpload from '../../components/milestones/PhotoUpload';
import styles from './Milestones.module.css';

function Milestones() {
  const { user, pregnancyData } = useApp();
  const { 
    getAllMilestones,
    getUpcomingMilestones,
    getRecentAchievements,
    getAchievementsChronological,
    getAchievementStats,
    isMilestoneAchieved,
    achieveMilestone,
    achieveWithPhoto,
    addCustomMilestone,
    deleteMilestone,
    undoAchievement,
    progress,
    MILESTONE_CATEGORIES
  } = useMilestones();

  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAchieveModal, setShowAchieveModal] = useState(false);
  const [showEditAchievementModal, setShowEditAchievementModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Create milestone form state
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDescription, setNewMilestoneDescription] = useState('');
  const [newMilestoneWeek, setNewMilestoneWeek] = useState(pregnancyData.currentWeek || 1);
  const [newMilestoneCategory, setNewMilestoneCategory] = useState('custom');
  const [newMilestoneIcon, setNewMilestoneIcon] = useState('⭐');

  // Achievement form state
  const [achievementNotes, setAchievementNotes] = useState('');
  const [achievementPhotos, setAchievementPhotos] = useState([]);
  const [achievementDate, setAchievementDate] = useState(new Date().toISOString().split('T')[0]);
  const photoInputRef = useRef(null);

  // Edit achievement form state
  const [editAchievementNotes, setEditAchievementNotes] = useState('');
  const [editAchievementDate, setEditAchievementDate] = useState('');
  const [editAchievementPhotos, setEditAchievementPhotos] = useState([]);

  const allMilestones = getAllMilestones();
  const upcomingMilestones = getUpcomingMilestones(6);
  const recentAchievements = getRecentAchievements(5);
  const allAchievements = getAchievementsChronological();
  const achievementStats = getAchievementStats();

  const filteredMilestones = selectedCategory === 'all' 
    ? allMilestones 
    : allMilestones.filter(m => m.category === selectedCategory);

  const milestoneIcons = ['⭐', '🌟', '💫', '🎯', '🏆', '🎉', '💕', '👶', '🤰', '💝', '🎊', '✨'];

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleCreateMilestone = () => {
    if (!newMilestoneTitle.trim() || !newMilestoneDescription.trim()) {
      alert('Please fill in the title and description.');
      return;
    }

    const milestoneData = {
      title: newMilestoneTitle,
      description: newMilestoneDescription,
      week: parseInt(newMilestoneWeek),
      trimester: Math.ceil(newMilestoneWeek / 13.33),
      icon: newMilestoneIcon,
      color: MILESTONE_CATEGORIES[newMilestoneCategory]?.color || '#F4A261',
      celebrationMessage: `You achieved: ${newMilestoneTitle}! 🎉`,
      importance: 'medium',
      isAutoDetectable: false
    };

    addCustomMilestone(milestoneData);

    // Reset form
    setNewMilestoneTitle('');
    setNewMilestoneDescription('');
    setNewMilestoneWeek(pregnancyData.currentWeek || 1);
    setNewMilestoneCategory('custom');
    setNewMilestoneIcon('⭐');
    setShowCreateModal(false);
  };

  const handleAchieveMilestone = async () => {
    if (!selectedMilestone) return;

    // Create milestone data with custom date
    const milestoneData = {
      ...selectedMilestone,
      achievedAt: new Date(achievementDate).toISOString()
    };

    if (achievementPhotos && achievementPhotos.length > 0) {
      try {
        // Convert photo files to base64
        const photoObjects = await Promise.all(
          achievementPhotos.map(async (photoFile) => ({
            url: await fileToBase64(photoFile),
            fileName: photoFile.name,
            fileSize: photoFile.size,
            milestoneId: milestoneData.id,
            type: 'base64'
          }))
        );
        
        achieveMilestone(milestoneData, photoObjects, achievementNotes, 'excellent');
      } catch (error) {
        console.error('Error converting photos to base64:', error);
        // Fall back to achieving without photos
        achieveMilestone(milestoneData, [], achievementNotes, 'excellent');
      }
    } else {
      achieveMilestone(milestoneData, [], achievementNotes, 'excellent');
    }

    // Reset form
    setAchievementNotes('');
    setAchievementPhotos([]);
    setAchievementDate(new Date().toISOString().split('T')[0]);
    setSelectedMilestone(null);
    setShowAchieveModal(false);
  };

  const openAchieveModal = (milestone) => {
    setSelectedMilestone(milestone);
    setShowAchieveModal(true);
  };

  const openEditAchievementModal = (achievement) => {
    setSelectedAchievement(achievement);
    setEditAchievementNotes(achievement.notes || '');
    setEditAchievementDate(achievement.achievedAt ? achievement.achievedAt.split('T')[0] : '');
    setEditAchievementPhotos(achievement.photos || []);
    setShowEditAchievementModal(true);
  };

  const handleUpdateAchievement = async () => {
    if (!selectedAchievement) return;

    let photoObjects = editAchievementPhotos;

    // If there are new photo files, convert them to base64
    if (editAchievementPhotos && editAchievementPhotos.length > 0 
        && editAchievementPhotos[0] instanceof File) {
      try {
        photoObjects = await Promise.all(
          editAchievementPhotos.map(async (photoFile) => ({
            url: await fileToBase64(photoFile),
            fileName: photoFile.name,
            fileSize: photoFile.size,
            milestoneId: selectedAchievement.id,
            type: 'base64'
          }))
        );
      } catch (error) {
        console.error('Error converting photos to base64:', error);
        photoObjects = [];
      }
    }

    // Delete and re-add since there's no update function
    undoAchievement(selectedAchievement.id);
    
    const updatedMilestone = {
      ...selectedAchievement,
      achievedAt: new Date(editAchievementDate).toISOString()
    };
    
    achieveMilestone(updatedMilestone, photoObjects, editAchievementNotes, selectedAchievement.mood);

    // Reset and close
    setEditAchievementNotes('');
    setEditAchievementDate('');
    setEditAchievementPhotos([]);
    setSelectedAchievement(null);
    setShowEditAchievementModal(false);
  };

  const handleDeleteAchievement = () => {
    if (selectedAchievement) {
      undoAchievement(selectedAchievement.id);
      setSelectedAchievement(null);
      setShowEditAchievementModal(false);
    }
  };

  const handleDeleteClick = (milestone) => {
    setSelectedMilestone(milestone);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMilestone) {
      // Try to determine the milestone type - check both custom and preset collections
      let milestoneType = 'custom'; // Default to custom
      
      // Check if it's in preset milestones
      const allMilestones = getAllMilestones();
      const isInPreset = allMilestones.some(m => m.id === selectedMilestone.id && !m.isCustom);
      
      if (isInPreset) {
        milestoneType = 'preset';
      }
      
      deleteMilestone(selectedMilestone.id, milestoneType);
      
      setSelectedMilestone(null);
      setShowDeleteConfirm(false);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return '#A8D8A8';
    if (percentage >= 50) return '#FFB5A7';
    if (percentage >= 25) return '#C8A8E9';
    return '#F4A6CD';
  };

  return (
    <div className={styles.milestonesPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.pageTitle}>🎯 Your Milestones</h1>
          <p className={styles.pageSubtitle}>
            Celebrate every special moment, {user.name || 'Beautiful'}
          </p>
        </div>

        {/* Progress Overview */}
        <div className={styles.progressOverview}>
          <div className={styles.progressCircle}>
            <svg className={styles.progressSvg} viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#E5E5E5"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={getProgressColor(progress.completionPercentage)}
                strokeWidth="8"
                strokeDasharray={`${progress.completionPercentage * 2.51} 251.2`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className={styles.progressText}>
              <span className={styles.progressNumber}>
                {Math.round(progress.completionPercentage)}%
              </span>
              <span className={styles.progressLabel}>Complete</span>
            </div>
          </div>
          
          <div className={styles.progressStats}>
            <div className={styles.progressStatItem}>
              <span className={styles.statNumber}>{progress.achievedCount}</span>
              <span className={styles.statLabel}>Achieved</span>
            </div>
            <div className={styles.progressStatItem}>
              <span className={styles.statNumber}>{progress.upcomingCount}</span>
              <span className={styles.statLabel}>Remaining</span>
            </div>
            <div className={styles.progressStatItem}>
              <span className={styles.statNumber}>{achievementStats.thisWeek}</span>
              <span className={styles.statLabel}>This Week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          ⏰ Upcoming
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'achieved' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('achieved')}
        >
          🏆 Achieved
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📋 All Milestones
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.overviewSection}>
            
            {/* Quick Stats */}
            <div className={styles.quickStatsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statIcon}>🎯</span>
                  <span className={styles.statTitle}>Next Milestone</span>
                </div>
                {upcomingMilestones.length > 0 ? (
                  <div className={styles.nextMilestone}>
                    <span className={styles.nextMilestoneTitle}>
                      {upcomingMilestones[0].title}
                    </span>
                    <span className={styles.nextMilestoneWeek}>
                      Week {upcomingMilestones[0].week}
                    </span>
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => openAchieveModal(upcomingMilestones[0])}
                      disabled={pregnancyData.currentWeek < upcomingMilestones[0].week}
                    >
                      {pregnancyData.currentWeek >= upcomingMilestones[0].week ? 'Achieve Now' : `Week ${upcomingMilestones[0].week}`}
                    </Button>
                  </div>
                ) : (
                  <p className={styles.noMilestones}>All caught up! 🎉</p>
                )}
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statIcon}>📈</span>
                  <span className={styles.statTitle}>Progress This Week</span>
                </div>
                <div className={styles.weekProgress}>
                  <span className={styles.weekNumber}>{achievementStats.thisWeek}</span>
                  <span className={styles.weekLabel}>milestones achieved</span>
                  {achievementStats.thisWeek > 0 && (
                    <span className={styles.encouragement}>Great job! 🌟</span>
                  )}
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statIcon}>🏆</span>
                  <span className={styles.statTitle}>Achievement Rate</span>
                </div>
                <div className={styles.achievementRate}>
                  <span className={styles.ratePercentage}>
                    {Math.round(progress.completionPercentage)}%
                  </span>
                  <span className={styles.rateLabel}>of milestones complete</span>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            {recentAchievements.length > 0 && (
              <div className={styles.recentAchievementsSection}>
                <h3 className={styles.sectionTitle}>🎉 Recent Achievements</h3>
                <div className={styles.achievementsList}>
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className={styles.achievementCard}>
                      <div className={styles.achievementHeader}>
                        <span 
                          className={styles.achievementIcon}
                          style={{ color: achievement.color }}
                        >
                          {achievement.icon}
                        </span>
                        <div className={styles.achievementInfo}>
                          <span className={styles.achievementTitle}>{achievement.title}</span>
                          <span className={styles.achievementDate}>
                            {formatDate(achievement.achievedAt)}
                          </span>
                        </div>
                        <button 
                          className={styles.editAchievementButton}
                          onClick={() => openEditAchievementModal(achievement)}
                          title="Edit achievement"
                        >
                          ✏️
                        </button>
                        <div className={styles.achievementCategory}>
                          <span className={styles.categoryBadge}>
                            {MILESTONE_CATEGORIES[achievement.category]?.label}
                          </span>
                        </div>
                      </div>
                      
                      {achievement.notes && (
                        <p className={styles.achievementNotes}>{achievement.notes}</p>
                      )}
                      
                      {achievement.photos && achievement.photos.length > 0 && (
                        <div className={styles.achievementPhotos}>
                          {achievement.photos.map((photo, index) => (
                            <img 
                              key={index}
                              src={photo.url} 
                              alt="Milestone memory"
                              className={styles.achievementPhoto}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Tab */}
        {activeTab === 'upcoming' && (
          <div className={styles.upcomingSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>⏰ Upcoming Milestones</h3>
              <Button 
                variant="gentle" 
                size="small"
                onClick={() => setShowCreateModal(true)}
              >
                Create Custom
              </Button>
            </div>

            {upcomingMilestones.length > 0 ? (
              <div className={styles.milestonesList}>
                {upcomingMilestones.map((milestone, index) => {
                  const isFeatured = index === 0;
                  const isGenderReveal = milestone.id === 'milestone-gender-reveal';
                  
                  let cardStyle = {};
                  if (isFeatured) {
                    cardStyle = {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '2rem',
                      background: 'linear-gradient(135deg, #fef7f0, #fdf4f4, rgba(244, 166, 205, 0.15))',
                      border: '3px solid #F4A6CD',
                      minHeight: '120px'
                    };
                  } else if (isGenderReveal) {
                    cardStyle = {
                      background: 'linear-gradient(135deg, #f0f0f0, #e8e8e8, rgba(200, 168, 233, 0.2))',
                      border: '2px solid #C8A8E9',
                      display: 'block'
                    };
                  }
                  
                  return (
                  <div 
                    key={milestone.id} 
                    className={`${styles.milestoneCard} ${isFeatured ? styles.milestoneCardFeatured : ''}`}
                    data-category={milestone.category}
                    style={cardStyle}
                  >
                    <div className={styles.milestoneHeader}>
                      <div className={styles.milestoneIconWrapper}>
                        <span 
                          className={styles.milestoneIcon}
                          style={{ color: milestone.color }}
                        >
                          {milestone.icon}
                        </span>
                      </div>
                      <div className={styles.milestoneInfo}>
                        <h4 className={styles.milestoneTitle}>{milestone.title}</h4>
                        <p className={styles.milestoneDescription}>{milestone.description}</p>
                        <div className={styles.milestoneMeta}>
                          <span className={styles.milestoneWeek}>Week {milestone.week}</span>
                          <span className={styles.milestoneTrimester}>
                            Trimester {milestone.trimester}
                          </span>
                          <span className={styles.milestoneCategory}>
                            {MILESTONE_CATEGORIES[milestone.category]?.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {milestone.tips && (
                      <div className={styles.milestoneTips}>
                        <h5>💡 Tips:</h5>
                        <ul>
                          {milestone.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className={styles.milestoneActions}>
                      <div className={styles.primaryActions}>
                        {pregnancyData.currentWeek >= milestone.week ? (
                          <Button 
                            variant="primary" 
                            onClick={() => openAchieveModal(milestone)}
                          >
                            Achieve Milestone
                          </Button>
                        ) : (
                          <div className={styles.waitingForWeek}>
                            <span>Available in Week {milestone.week}</span>
                            <span className={styles.weeksRemaining}>
                              ({milestone.week - pregnancyData.currentWeek} weeks to go)
                            </span>
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleDeleteClick(milestone)}
                        className={styles.deleteButton}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎉</div>
                <h4>All caught up!</h4>
                <p>You've achieved all available milestones for your current week.</p>
                <Button 
                  variant="primary" 
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Custom Milestone
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Achieved Tab */}
        {activeTab === 'achieved' && (
          <div className={styles.achievedSection}>
            <h3 className={styles.sectionTitle}>🏆 Your Achievements</h3>
            
            {allAchievements.length > 0 ? (
              <div className={styles.achievedGrid}>
                {allAchievements.map((achievement) => (
                  <div key={achievement.id} className={styles.achievedCard}>
                    <div className={styles.achievedHeader}>
                      <span 
                        className={styles.achievedIcon}
                        style={{ color: achievement.color }}
                      >
                        {achievement.icon}
                      </span>
                      <button 
                        className={styles.editButton}
                        onClick={() => openEditAchievementModal(achievement)}
                        title="Edit achievement"
                      >
                        ✏️
                      </button>
                    </div>

                    <div className={styles.achievedContent}>
                      <h4 className={styles.achievedTitle}>{achievement.title}</h4>
                      <p className={styles.achievedDate}>
                        {formatDate(achievement.achievedAt)}
                      </p>
                      
                      {achievement.notes && (
                        <p className={styles.achievedNotes}>{achievement.notes}</p>
                      )}

                      {achievement.photos && achievement.photos.length > 0 && (
                        <div className={styles.achievedPhotos}>
                          {achievement.photos.map((photo, index) => (
                            <img 
                              key={index}
                              src={photo.url} 
                              alt="Achievement memory"
                              className={styles.achievedPhoto}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎯</div>
                <h4>No achievements yet</h4>
                <p>Start achieving milestones to see them here!</p>
                <Button 
                  variant="primary" 
                  onClick={() => setActiveTab('upcoming')}
                >
                  View Upcoming Milestones
                </Button>
              </div>
            )}
          </div>
        )}

        {/* All Milestones Tab */}
        {activeTab === 'all' && (
          <div className={styles.allMilestonesSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>📋 All Milestones</h3>
              
              {/* Category Filter */}
              <div className={styles.categoryFilter}>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.categorySelect}
                >
                  <option value="all">All Categories</option>
                  {Object.entries(MILESTONE_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.allMilestonesList}>
              {filteredMilestones.map((milestone) => {
                const isAchieved = isMilestoneAchieved(milestone.id);
                const canAchieve = pregnancyData.currentWeek >= milestone.week;
                
                return (
                  <div 
                    key={milestone.id} 
                    className={`${styles.allMilestoneCard} ${
                      isAchieved ? styles.achieved : ''
                    }`}
                    data-category={milestone.category}
                  >
                    <div className={styles.allMilestoneContent}>
                      <div className={styles.milestoneStatus}>
                        {isAchieved ? (
                          <span className={styles.achievedBadge}>✓</span>
                        ) : canAchieve ? (
                          <span className={styles.availableBadge}>○</span>
                        ) : (
                          <span className={styles.futureBadge}>⏰</span>
                        )}
                      </div>

                      <div className={styles.allMilestoneInfo}>
                        <div className={styles.allMilestoneHeader}>
                          <span 
                            className={styles.allMilestoneIcon}
                            style={{ color: milestone.color }}
                          >
                            {milestone.icon}
                          </span>
                          <h4 className={styles.allMilestoneTitle}>{milestone.title}</h4>
                        </div>

                        <p className={styles.allMilestoneDescription}>
                          {milestone.description}
                        </p>

                        <div className={styles.allMilestoneMeta}>
                          <span className={styles.allMilestoneWeek}>Week {milestone.week}</span>
                          <span className={styles.allMilestoneCategory}>
                            {MILESTONE_CATEGORIES[milestone.category]?.label}
                          </span>
                        </div>
                      </div>

                      <div className={styles.allMilestoneActions}>
                        <div className={styles.primaryActions}>
                          {isAchieved ? (
                            <span className={styles.achievedLabel}>Achieved! 🎉</span>
                          ) : canAchieve ? (
                            <Button 
                              variant="primary" 
                              size="small"
                              onClick={() => openAchieveModal(milestone)}
                            >
                              Achieve
                            </Button>
                          ) : (
                            <span className={styles.futureLabel}>
                              Week {milestone.week}
                            </span>
                          )}
                        </div>
                        <Button 
                          variant="secondary" 
                          size="small"
                          onClick={() => handleDeleteClick(milestone)}
                          className={styles.deleteButton}
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create Milestone Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Create Custom Milestone</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g., First baby clothes shopping"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description *</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Describe what makes this milestone special..."
                  value={newMilestoneDescription}
                  onChange={(e) => setNewMilestoneDescription(e.target.value)}
                  rows="3"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Target Week</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    className={styles.formInput}
                    value={newMilestoneWeek}
                    onChange={(e) => setNewMilestoneWeek(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Icon</label>
                  <div className={styles.iconSelector}>
                    {milestoneIcons.map((icon) => (
                      <button
                        key={icon}
                        className={`${styles.iconButton} ${
                          newMilestoneIcon === icon ? styles.selectedIcon : ''
                        }`}
                        onClick={() => setNewMilestoneIcon(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleCreateMilestone}
                  disabled={!newMilestoneTitle.trim() || !newMilestoneDescription.trim()}
                >
                  Create Milestone
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {showAchieveModal && selectedMilestone && (
        <div className={styles.modalOverlay} onClick={() => setShowAchieveModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>🎉 Achieve Milestone</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAchieveModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.milestonePreview}>
                <span 
                  className={styles.previewIcon}
                  style={{ color: selectedMilestone.color }}
                >
                  {selectedMilestone.icon}
                </span>
                <h4 className={styles.previewTitle}>{selectedMilestone.title}</h4>
                <p className={styles.previewDescription}>{selectedMilestone.description}</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Add Photos (Optional)</label>
                <PhotoUpload
                  onPhotosSelected={setAchievementPhotos}
                  maxFiles={5}
                  multiple={true}
                  label="Add milestone photos"
                  showPreview={true}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Achievement Date</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={achievementDate}
                  onChange={(e) => setAchievementDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                <small className={styles.helpText}>
                  When did you achieve this milestone? (defaults to today)
                </small>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Notes (Optional)</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Share your thoughts about this milestone..."
                  value={achievementNotes}
                  onChange={(e) => setAchievementNotes(e.target.value)}
                  rows="3"
                />
              </div>

              <div className={styles.modalActions}>
                <Button variant="secondary" onClick={() => setShowAchieveModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleAchieveMilestone}>
                  Achieve Milestone! 🎉
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Achievement Modal */}
      {showEditAchievementModal && selectedAchievement && (
        <div className={styles.modalOverlay} onClick={() => setShowEditAchievementModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>✏️ Edit Achievement</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowEditAchievementModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.milestonePreview}>
                <span 
                  className={styles.previewIcon}
                  style={{ color: selectedAchievement.color }}
                >
                  {selectedAchievement.icon}
                </span>
                <h4 className={styles.previewTitle}>{selectedAchievement.title}</h4>
                <p className={styles.previewDescription}>{selectedAchievement.description}</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Achievement Date</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={editAchievementDate}
                  onChange={(e) => setEditAchievementDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Notes</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Share your thoughts about this milestone..."
                  value={editAchievementNotes}
                  onChange={(e) => setEditAchievementNotes(e.target.value)}
                  rows="3"
                />
              </div>

              <div className={styles.modalActions}>
                <Button 
                  variant="secondary" 
                  onClick={handleDeleteAchievement}
                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                >
                  🗑️ Delete
                </Button>
                <Button variant="secondary" onClick={() => setShowEditAchievementModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateAchievement}>
                  ✏️ Update Achievement
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedMilestone && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteConfirm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Delete Milestone</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowDeleteConfirm(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.confirmationMessage}>
                <div className={styles.warningIcon}>⚠️</div>
                <p>
                  Are you sure you want to delete the milestone 
                  <strong> "{selectedMilestone.title}"</strong>?
                </p>
                <p className={styles.warningText}>
                  This action cannot be undone. Any associated achievements and memories will also be removed.
                </p>
              </div>

              <div className={styles.modalActions}>
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirmDelete} style={{ backgroundColor: '#ef4444' }}>
                  🗑️ Delete Milestone
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Milestones;