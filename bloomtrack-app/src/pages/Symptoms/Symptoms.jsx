import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSymptoms } from '../../context/SymptomsContext';
import Button from '../../components/common/Button';
import styles from './Symptoms.module.css';

function Symptoms() {
  const { user, pregnancyData } = useApp();
  const { 
    dailyEntries,
    getAllSymptoms,
    getRecentEntries,
    getSymptomsByCategory,
    getFavoriteSymptoms,
    getSymptomsStats,
    logSymptom,
    addDailyEntry,
    addToFavorites,
    removeFromFavorites,
    addCustomSymptom,
    SYMPTOM_CATEGORIES,
    SEVERITY_LEVELS,
    tracking
  } = useSymptoms();

  const [activeTab, setActiveTab] = useState('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState(3);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [symptomTime, setSymptomTime] = useState(new Date().toTimeString().slice(0, 5));

  // Custom symptom form state
  const [customSymptomName, setCustomSymptomName] = useState('');
  const [customSymptomCategory, setCustomSymptomCategory] = useState('physical');
  const [customSymptomIcon, setCustomSymptomIcon] = useState('🤕');
  const [customSymptomDescription, setCustomSymptomDescription] = useState('');

  const allSymptoms = getAllSymptoms();
  const recentEntries = getRecentEntries(7);
  const symptomsStats = getSymptomsStats();
  const favoriteSymptoms = getFavoriteSymptoms();
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = dailyEntries.find(entry => entry.date === today);

  const availableIcons = ['🤕', '😵', '🤢', '😴', '💭', '⚡', '🔥', '❄️', '💧', '🌪️', '⭐', '💎'];

  const handleQuickLog = (symptomName) => {
    setSelectedSymptoms([symptomName]);
    setShowAddModal(true);
  };

  const handleLogSymptom = () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }

    // Log each selected symptom
    selectedSymptoms.forEach(symptomName => {
      logSymptom(symptomName, selectedSeverity, symptomNotes, symptomTime);
      
      // Add to favorites if not already there
      if (!tracking.favoriteSymptoms.includes(symptomName)) {
        addToFavorites(symptomName);
      }
    });

    // Reset form
    setSelectedSymptoms([]);
    setSelectedSeverity(3);
    setSymptomNotes('');
    setSymptomTime(new Date().toTimeString().slice(0, 5));
    setShowAddModal(false);
  };

  const handleAddCustomSymptom = () => {
    if (!customSymptomName.trim()) {
      alert('Please enter a symptom name.');
      return;
    }

    const customSymptom = {
      label: customSymptomName,
      icon: customSymptomIcon,
      category: customSymptomCategory,
      description: customSymptomDescription,
      trimester: [1, 2, 3] // Available for all trimesters
    };

    addCustomSymptom(customSymptom);

    // Reset form
    setCustomSymptomName('');
    setCustomSymptomCategory('physical');
    setCustomSymptomIcon('🤕');
    setCustomSymptomDescription('');
    setShowCustomModal(false);
  };

  const getFilteredSymptoms = () => {
    const symptoms = Object.entries(allSymptoms);
    
    if (selectedCategory === 'all') {
      return symptoms;
    }
    
    if (selectedCategory === 'favorites') {
      return symptoms.filter(([key]) => tracking.favoriteSymptoms.includes(key));
    }
    
    return symptoms.filter(([key, symptom]) => symptom.category === selectedCategory);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getSeverityColor = (severity) => {
    return SEVERITY_LEVELS[severity]?.color || '#C8A8E9';
  };

  return (
    <div className={styles.symptomsPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.pageTitle}>🩺 Symptom Tracking</h1>
          <p className={styles.pageSubtitle}>
            Monitor your pregnancy symptoms and patterns, {user.name || 'Beautiful'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsOverview}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{symptomsStats.currentStreak}</span>
            <span className={styles.statLabel}>Day Streak</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{symptomsStats.totalEntries}</span>
            <span className={styles.statLabel}>Total Entries</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{symptomsStats.uniqueSymptoms}</span>
            <span className={styles.statLabel}>Unique Symptoms</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'today' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('today')}
        >
          📝 Today's Symptoms
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'log' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('log')}
        >
          📊 Symptom Library
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📈 History & Patterns
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'insights' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          💡 Insights
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>

        {/* Today's Symptoms Tab */}
        {activeTab === 'today' && (
          <div className={styles.todaySection}>
            
            {/* Current Day Overview */}
            <div className={styles.todayOverview}>
              <div className={styles.todayHeader}>
                <h3 className={styles.sectionTitle}>Today's Symptoms - {formatDate(today)}</h3>
                <div className={styles.todayMeta}>
                  <span className={styles.weekInfo}>Week {pregnancyData?.currentWeek || 1}</span>
                  <span className={styles.trimesterInfo}>
                    Trimester {pregnancyData?.currentTrimester || 1}
                  </span>
                </div>
              </div>

              {todayEntry && todayEntry.symptoms.length > 0 ? (
                <div className={styles.todaySymptoms}>
                  {todayEntry.symptoms.map((symptom, index) => {
                    const symptomData = allSymptoms[symptom.name];
                    return (
                      <div key={index} className={styles.symptomEntry}>
                        <div className={styles.symptomHeader}>
                          <span className={styles.symptomIcon}>
                            {symptomData?.icon || '🤕'}
                          </span>
                          <div className={styles.symptomInfo}>
                            <span className={styles.symptomName}>
                              {symptomData?.label || symptom.name}
                            </span>
                            <span className={styles.symptomTime}>
                              {symptom.time}
                            </span>
                          </div>
                          <div 
                            className={styles.severityBadge}
                            style={{ backgroundColor: getSeverityColor(symptom.severity) }}
                          >
                            {SEVERITY_LEVELS[symptom.severity]?.label}
                          </div>
                        </div>
                        {symptom.notes && (
                          <p className={styles.symptomNotes}>{symptom.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.noSymptomsToday}>
                  <div className={styles.emptyIcon}>✨</div>
                  <h4>No symptoms logged today</h4>
                  <p>Great! You're having a symptom-free day. Click below to log if anything comes up.</p>
                </div>
              )}

              <div className={styles.todayActions}>
                <Button 
                  variant="primary" 
                  onClick={() => setShowAddModal(true)}
                >
                  Log Symptom
                </Button>
              </div>
            </div>

            {/* Quick Log Favorites */}
            {favoriteSymptoms.length > 0 && (
              <div className={styles.favoritesSection}>
                <h4 className={styles.subsectionTitle}>⭐ Quick Log Favorites</h4>
                <div className={styles.favoritesGrid}>
                  {favoriteSymptoms.map((symptom, index) => (
                    <button
                      key={index}
                      className={styles.favoriteButton}
                      onClick={() => handleQuickLog(symptom.id || Object.keys(allSymptoms).find(key => allSymptoms[key] === symptom))}
                    >
                      <span className={styles.favoriteIcon}>{symptom.icon}</span>
                      <span className={styles.favoriteLabel}>{symptom.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Entries */}
            {recentEntries.length > 0 && (
              <div className={styles.recentSection}>
                <h4 className={styles.subsectionTitle}>📅 Recent Entries</h4>
                <div className={styles.recentEntries}>
                  {recentEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className={styles.recentEntry}>
                      <div className={styles.recentHeader}>
                        <span className={styles.recentDate}>
                          {formatDate(entry.date)}
                        </span>
                        <span className={styles.recentCount}>
                          {entry.symptoms.length} symptom{entry.symptoms.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className={styles.recentSymptoms}>
                        {entry.symptoms.slice(0, 3).map((symptom, index) => {
                          const symptomData = allSymptoms[symptom.name];
                          return (
                            <span key={index} className={styles.recentSymptom}>
                              {symptomData?.icon || '🤕'} {symptomData?.label || symptom.name}
                            </span>
                          );
                        })}
                        {entry.symptoms.length > 3 && (
                          <span className={styles.recentMore}>
                            +{entry.symptoms.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Symptom Library Tab */}
        {activeTab === 'log' && (
          <div className={styles.librarySection}>
            
            {/* Category Filter */}
            <div className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>Symptom Library</h3>
              <div className={styles.categoryFilter}>
                <button 
                  className={`${styles.filterButton} ${selectedCategory === 'all' ? styles.activeFilter : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Symptoms
                </button>
                <button 
                  className={`${styles.filterButton} ${selectedCategory === 'favorites' ? styles.activeFilter : ''}`}
                  onClick={() => setSelectedCategory('favorites')}
                >
                  ⭐ Favorites
                </button>
                {Object.entries(SYMPTOM_CATEGORIES).map(([key, category]) => (
                  <button 
                    key={key}
                    className={`${styles.filterButton} ${selectedCategory === key ? styles.activeFilter : ''}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    {category.icon} {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms Grid */}
            <div className={styles.symptomsGrid}>
              {getFilteredSymptoms().map(([key, symptom]) => {
                const isFavorite = tracking.favoriteSymptoms.includes(key);
                return (
                  <div key={key} className={styles.symptomCard}>
                    <div className={styles.symptomCardHeader}>
                      <span className={styles.symptomCardIcon}>{symptom.icon}</span>
                      <button
                        className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
                        onClick={() => isFavorite ? removeFromFavorites(key) : addToFavorites(key)}
                      >
                        {isFavorite ? '⭐' : '☆'}
                      </button>
                    </div>
                    <h4 className={styles.symptomCardTitle}>{symptom.label}</h4>
                    <p className={styles.symptomCardDescription}>{symptom.description}</p>
                    <div className={styles.symptomCardMeta}>
                      <span 
                        className={styles.categoryBadge}
                        style={{ backgroundColor: SYMPTOM_CATEGORIES[symptom.category]?.color }}
                      >
                        {SYMPTOM_CATEGORIES[symptom.category]?.label}
                      </span>
                    </div>
                    <Button 
                      variant="gentle" 
                      size="small"
                      onClick={() => handleQuickLog(key)}
                    >
                      Quick Log
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Symptom */}
            <div className={styles.customSymptomSection}>
              <Button 
                variant="secondary" 
                onClick={() => setShowCustomModal(true)}
              >
                + Add Custom Symptom
              </Button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className={styles.historySection}>
            <h3 className={styles.sectionTitle}>Symptom History</h3>
            
            {dailyEntries.length > 0 ? (
              <div className={styles.historyList}>
                {dailyEntries.map((entry) => (
                  <div key={entry.id} className={styles.historyEntry}>
                    <div className={styles.historyHeader}>
                      <span className={styles.historyDate}>
                        {formatDate(entry.date)}
                      </span>
                      <span className={styles.historyCount}>
                        {entry.symptoms.length} symptom{entry.symptoms.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className={styles.historySymptoms}>
                      {entry.symptoms.map((symptom, index) => {
                        const symptomData = allSymptoms[symptom.name];
                        return (
                          <div key={index} className={styles.historySymptom}>
                            <span className={styles.historySymptomIcon}>
                              {symptomData?.icon || '🤕'}
                            </span>
                            <span className={styles.historySymptomName}>
                              {symptomData?.label || symptom.name}
                            </span>
                            <span 
                              className={styles.historySymptomSeverity}
                              style={{ backgroundColor: getSeverityColor(symptom.severity) }}
                            >
                              {symptom.severity}/5
                            </span>
                            {symptom.time && (
                              <span className={styles.historySymptomTime}>
                                {symptom.time}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {entry.notes && (
                      <p className={styles.historyNotes}>{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noHistory}>
                <div className={styles.emptyIcon}>📈</div>
                <h4>No symptom history yet</h4>
                <p>Start logging symptoms to see patterns and trends over time.</p>
              </div>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className={styles.insightsSection}>
            <h3 className={styles.sectionTitle}>Symptom Insights</h3>
            
            <div className={styles.insightsGrid}>
              
              {/* Statistics Card */}
              <div className={styles.insightCard}>
                <h4 className={styles.insightTitle}>📊 Your Statistics</h4>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{symptomsStats.totalEntries}</span>
                    <span className={styles.statLabel}>Total entries</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{symptomsStats.totalSymptoms}</span>
                    <span className={styles.statLabel}>Symptoms logged</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{symptomsStats.averageSeverity}</span>
                    <span className={styles.statLabel}>Avg severity</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{symptomsStats.currentStreak}</span>
                    <span className={styles.statLabel}>Day streak</span>
                  </div>
                </div>
              </div>

              {/* Most Common Symptom */}
              {symptomsStats.mostCommonSymptom && (
                <div className={styles.insightCard}>
                  <h4 className={styles.insightTitle}>🔥 Most Common Symptom</h4>
                  <div className={styles.commonSymptom}>
                    <span className={styles.commonSymptomIcon}>
                      {allSymptoms[symptomsStats.mostCommonSymptom]?.icon || '🤕'}
                    </span>
                    <span className={styles.commonSymptomName}>
                      {allSymptoms[symptomsStats.mostCommonSymptom]?.label || symptomsStats.mostCommonSymptom}
                    </span>
                  </div>
                  <p className={styles.insightDescription}>
                    This has been your most frequently logged symptom.
                  </p>
                </div>
              )}

              {/* Tips Card */}
              <div className={styles.insightCard}>
                <h4 className={styles.insightTitle}>💡 Tracking Tips</h4>
                <ul className={styles.tipsList}>
                  <li>Log symptoms as they happen for better accuracy</li>
                  <li>Note the severity to track changes over time</li>
                  <li>Add notes about triggers or relief methods</li>
                  <li>Share patterns with your healthcare provider</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Symptom Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Log Symptom</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              
              {/* Symptom Selection */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Select Symptoms (multiple allowed)</label>
                <div className={styles.symptomSelector}>
                  {Object.entries(allSymptoms).map(([key, symptom]) => {
                    const isSelected = selectedSymptoms.includes(key);
                    return (
                      <button
                        key={key}
                        className={`${styles.symptomOption} ${isSelected ? styles.selectedSymptom : ''}`}
                        onClick={() => {
                          if (isSelected) {
                            // Remove from selection
                            setSelectedSymptoms(prev => prev.filter(s => s !== key));
                          } else {
                            // Add to selection
                            setSelectedSymptoms(prev => [...prev, key]);
                          }
                        }}
                      >
                        <span className={styles.optionIcon}>{symptom.icon}</span>
                        <span className={styles.optionLabel}>{symptom.label}</span>
                        {isSelected && <span className={styles.selectedIndicator}>✓</span>}
                      </button>
                    );
                  })}
                </div>
                {selectedSymptoms.length > 0 && (
                  <div className={styles.selectedSummary}>
                    Selected: {selectedSymptoms.map(key => allSymptoms[key]?.label).join(', ')}
                  </div>
                )}
              </div>

              {/* Severity Selection */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Severity Level</label>
                <div className={styles.severitySelector}>
                  {Object.entries(SEVERITY_LEVELS).map(([level, data]) => (
                    <button
                      key={level}
                      className={`${styles.severityOption} ${selectedSeverity === parseInt(level) ? styles.selectedSeverity : ''}`}
                      onClick={() => setSelectedSeverity(parseInt(level))}
                      style={{ borderColor: data.color }}
                    >
                      <span className={styles.severityNumber}>{level}</span>
                      <span className={styles.severityLabel}>{data.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Time</label>
                <input
                  type="time"
                  className={styles.formInput}
                  value={symptomTime}
                  onChange={(e) => setSymptomTime(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Notes (Optional)</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Any additional details, triggers, or relief methods..."
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  rows="3"
                />
              </div>

              <div className={styles.modalActions}>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleLogSymptom}
                  disabled={selectedSymptoms.length === 0}
                >
                  Log {selectedSymptoms.length > 1 ? 'Symptoms' : 'Symptom'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Symptom Modal */}
      {showCustomModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCustomModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add Custom Symptom</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCustomModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Symptom Name *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g., Hip pain, Restless legs"
                  value={customSymptomName}
                  onChange={(e) => setCustomSymptomName(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select 
                    className={styles.formInput}
                    value={customSymptomCategory}
                    onChange={(e) => setCustomSymptomCategory(e.target.value)}
                  >
                    {Object.entries(SYMPTOM_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Icon</label>
                  <div className={styles.iconSelector}>
                    {availableIcons.map((icon) => (
                      <button
                        key={icon}
                        className={`${styles.iconButton} ${customSymptomIcon === icon ? styles.selectedIcon : ''}`}
                        onClick={() => setCustomSymptomIcon(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description (Optional)</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Describe this symptom..."
                  value={customSymptomDescription}
                  onChange={(e) => setCustomSymptomDescription(e.target.value)}
                  rows="3"
                />
              </div>

              <div className={styles.modalActions}>
                <Button variant="secondary" onClick={() => setShowCustomModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleAddCustomSymptom}
                  disabled={!customSymptomName.trim()}
                >
                  Add Symptom
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Symptoms;