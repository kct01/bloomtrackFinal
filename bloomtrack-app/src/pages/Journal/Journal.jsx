import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useJournal } from '../../context/JournalContext';
import Button from '../../components/common/Button';
import RichTextEditor from '../../components/common/RichTextEditor';
import styles from './Journal.module.css';

function Journal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, pregnancyData } = useApp();
  const { 
    addDailyEntry, 
    addGratitudeEntry, 
    addLetterToBaby, 
    getRecentEntries, 
    getDailyPrompt,
    hasWrittenToday,
    getWritingStats,
    deleteEntry,
    updateEntry,
    searchEntries,
    setSearchFilters,
    clearSearch,
    search,
    ENTRY_TYPES
  } = useJournal();

  const [activeTab, setActiveTab] = useState('write');
  const [selectedEntryType, setSelectedEntryType] = useState('daily');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('okay');
  const [gratitudeItems, setGratitudeItems] = useState(['', '', '']);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood] = useState('okay');
  const [editGratitudeItems, setEditGratitudeItems] = useState(['', '', '']);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setLocalSearchFilters] = useState({
    dateRange: 'all',
    entryType: 'all',
    mood: 'all'
  });

  const recentEntries = getRecentEntries(5);
  const writingStats = getWritingStats();
  const hasWritten = hasWrittenToday();

  // Check if we should open the insights tab (from Dashboard navigation)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // Get entries based on search or recent
  const displayEntries = search.query || Object.values(searchFilters).some(f => f !== 'all') 
    ? search.results 
    : recentEntries;

  const moodEmojis = {
    excellent: '😊',
    good: '🙂',
    okay: '😐',
    low: '😔',
    difficult: '😰'
  };

  const handleGetPrompt = () => {
    const prompt = getDailyPrompt();
    setCurrentPrompt(prompt);
    setShowPrompt(true);
    setEntryTitle(`Daily Reflection - Week ${pregnancyData.currentWeek}`);
  };

  const handleUsePrompt = () => {
    setEntryContent(`<p>${currentPrompt}</p><p><br></p>`);
    setShowPrompt(false);
  };

  // Helper function to extract plain text from HTML and count words
  const getWordCount = (htmlContent) => {
    if (!htmlContent) return 0;
    // Create a temporary div to extract text content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    return plainText.split(/\s+/).filter(word => word.trim()).length;
  };

  // Helper function to safely truncate HTML content while preserving images
  const truncateHtmlContent = (htmlContent, maxLength = 200) => {
    if (!htmlContent) return '';
    
    // Extract plain text for length checking (but preserve images)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    if (plainText.length <= maxLength) {
      return htmlContent;
    }
    
    // If too long, preserve images but truncate text
    const images = htmlContent.match(/<img[^>]*>/gi) || [];
    const textOnly = htmlContent.replace(/<img[^>]*>/gi, '');
    const tempTextDiv = document.createElement('div');
    tempTextDiv.innerHTML = textOnly;
    const plainTextOnly = tempTextDiv.textContent || tempTextDiv.innerText || '';
    
    if (plainTextOnly.length <= maxLength) {
      return htmlContent;
    }
    
    const truncatedText = plainTextOnly.substring(0, maxLength);
    return `${images.join('')}<p>${truncatedText}...</p>`;
  };

  // Helper function to check if entry contains images
  const hasImages = (htmlContent) => {
    return htmlContent && htmlContent.includes('<img');
  };

  // Helper function to extract first image for preview
  const getFirstImage = (htmlContent) => {
    if (!htmlContent) return null;
    const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    return imgMatch ? imgMatch[1] : null;
  };

  // Handle entry deletion with confirmation
  const handleDeleteEntry = (entryId, entryType, entryTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${entryTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmDelete) {
      deleteEntry(entryId, entryType);
    }
  };

  // Handle entry editing
  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setEditMood(entry.mood || 'okay');
    
    // Handle gratitude items if it's a gratitude entry
    if (entry.type === 'gratitude' && entry.gratitudeItems) {
      const items = [...entry.gratitudeItems];
      while (items.length < 3) items.push(''); // Ensure we have 3 items
      setEditGratitudeItems(items.slice(0, 3)); // Take only first 3
    } else {
      setEditGratitudeItems(['', '', '']);
    }
    
    setIsEditModalOpen(true);
  };

  // Handle saving edited entry
  const handleSaveEdit = () => {
    const plainTextContent = editContent.replace(/<[^>]*>/g, '').trim();
    if (!editTitle.trim() || !plainTextContent) {
      alert('Please add both a title and content for your entry.');
      return;
    }

    const updates = {
      title: editTitle,
      content: editContent,
      mood: editMood,
      updatedAt: new Date().toISOString()
    };

    // Add gratitude items if it's a gratitude entry
    if (editingEntry.type === 'gratitude') {
      const validGratitudeItems = editGratitudeItems.filter(item => item.trim());
      if (validGratitudeItems.length === 0) {
        alert('Please add at least one gratitude item.');
        return;
      }
      updates.gratitudeItems = validGratitudeItems;
    }

    updateEntry(editingEntry.id, editingEntry.type, updates);
    
    // Close modal and reset state
    setIsEditModalOpen(false);
    setEditingEntry(null);
    setEditTitle('');
    setEditContent('');
    setEditMood('okay');
    setEditGratitudeItems(['', '', '']);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingEntry(null);
    setEditTitle('');
    setEditContent('');
    setEditMood('okay');
    setEditGratitudeItems(['', '', '']);
  };

  // Search handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchEntries(query);
    } else {
      clearSearch();
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...searchFilters, [filterType]: value };
    setLocalSearchFilters(newFilters);
    setSearchFilters(newFilters);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setLocalSearchFilters({ dateRange: 'all', entryType: 'all', mood: 'all' });
    clearSearch();
  };

  const hasActiveFilters = searchQuery || Object.values(searchFilters).some(f => f !== 'all');

  const handleSaveEntry = () => {
    const plainTextContent = entryContent.replace(/<[^>]*>/g, '').trim();
    if (!entryTitle.trim() || !plainTextContent) {
      alert('Please add both a title and content for your entry.');
      return;
    }

    // Calculate word count for achievements
    const wordCount = getWordCount(entryContent);

    switch (selectedEntryType) {
      case 'daily':
        addDailyEntry(entryTitle, entryContent, selectedMood);
        break;
      case 'gratitude':
        const validGratitudeItems = gratitudeItems.filter(item => item.trim());
        if (validGratitudeItems.length === 0) {
          alert('Please add at least one gratitude item.');
          return;
        }
        addGratitudeEntry(validGratitudeItems, entryContent);
        break;
      case 'letters':
        addLetterToBaby(entryTitle, entryContent);
        break;
      default:
        addDailyEntry(entryTitle, entryContent, selectedMood);
    }

    // Track achievement with word count (disabled)
    // trackJournalEntry(wordCount);

    // Reset form
    setEntryTitle('');
    setEntryContent('');
    setGratitudeItems(['', '', '']);
    setSelectedMood('okay');
    setShowPrompt(false);
    setCurrentPrompt('');

    // Switch to recent entries to show the new entry
    setActiveTab('recent');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return formatDate(dateString);
  };

  return (
    <div className={styles.journalPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.pageTitle}>📝 Your Pregnancy Journal</h1>
          <p className={styles.pageSubtitle}>
            Document your beautiful journey, {user.name || 'Beautiful'}
          </p>
          
          {hasWritten && (
            <div className={styles.todaysBadge}>
              ✨ You've written today - keep up the amazing work!
            </div>
          )}
          
        </div>

        {/* Stats Overview */}
        <div className={styles.statsOverview}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{writingStats.totalEntries}</span>
            <span className={styles.statLabel}>Total Entries</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{writingStats.streak}</span>
            <span className={styles.statLabel}>Day Streak</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {writingStats.totalWords >= 1000 
                ? `${Math.floor(writingStats.totalWords / 1000)}k` 
                : writingStats.totalWords}
            </span>
            <span className={styles.statLabel}>Words Written</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'write' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('write')}
        >
          ✍️ Write
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'recent' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          📖 {hasActiveFilters ? 'Search Results' : 'Recent Entries'}
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'insights' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          📊 Insights
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        
        {/* Write Tab */}
        {activeTab === 'write' && (
          <div className={styles.writeSection}>
            
            {/* Entry Type Selection */}
            <div className={styles.entryTypeSelector}>
              <h3 className={styles.sectionTitle}>What would you like to write about?</h3>
              <div className={styles.entryTypes}>
                {Object.entries(ENTRY_TYPES).map(([key, type]) => {
                  if (key === 'weekly' || key === 'milestone') return null; // Skip these for now
                  return (
                    <button
                      key={key}
                      className={`${styles.entryTypeCard} ${selectedEntryType === key ? styles.selectedType : ''}`}
                      onClick={() => setSelectedEntryType(key)}
                    >
                      <span className={styles.entryTypeIcon}>{type.icon}</span>
                      <div className={styles.entryTypeInfo}>
                        <span className={styles.entryTypeLabel}>{type.label}</span>
                        <span className={styles.entryTypeDesc}>{type.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Writing Prompt */}
            <div className={styles.promptSection}>
              <div className={styles.promptHeader}>
                <h3 className={styles.sectionTitle}>Need inspiration?</h3>
                <Button 
                  variant="gentle" 
                  size="small"
                  onClick={handleGetPrompt}
                >
                  Get Writing Prompt
                </Button>
              </div>
              
              {showPrompt && (
                <div className={styles.promptCard}>
                  <p className={styles.promptText}>"{currentPrompt}"</p>
                  <div className={styles.promptActions}>
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={handleUsePrompt}
                    >
                      Use This Prompt
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => setShowPrompt(false)}
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Entry Form */}
            <div className={styles.entryForm}>
              
              {/* Title Input */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Entry Title</label>
                <input
                  type="text"
                  className={styles.titleInput}
                  placeholder={`My ${ENTRY_TYPES[selectedEntryType].label.toLowerCase()} for ${new Date().toLocaleDateString()}`}
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                />
              </div>

              {/* Gratitude Items (only for gratitude entries) */}
              {selectedEntryType === 'gratitude' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Things I'm grateful for today:</label>
                  {gratitudeItems.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      className={styles.gratitudeInput}
                      placeholder={`Gratitude ${index + 1}...`}
                      value={item}
                      onChange={(e) => {
                        const newItems = [...gratitudeItems];
                        newItems[index] = e.target.value;
                        setGratitudeItems(newItems);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Mood Selection */}
              {selectedEntryType !== 'letters' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>How are you feeling?</label>
                  <div className={styles.moodSelector}>
                    {Object.entries(moodEmojis).map(([mood, emoji]) => (
                      <button
                        key={mood}
                        className={`${styles.moodButton} ${selectedMood === mood ? styles.selectedMood : ''}`}
                        onClick={() => setSelectedMood(mood)}
                      >
                        <span className={styles.moodEmoji}>{emoji}</span>
                        <span className={styles.moodLabel}>{mood}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rich Text Editor */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {selectedEntryType === 'gratitude' ? 'Additional thoughts (optional)' : 'Your thoughts'}
                </label>
                <RichTextEditor
                  value={entryContent}
                  onChange={setEntryContent}
                  placeholder={
                    selectedEntryType === 'letters' 
                      ? "Dear little one..." 
                      : selectedEntryType === 'gratitude'
                        ? "Any other thoughts about your gratitude today..."
                        : "Share what's on your mind and heart..."
                  }
                  minHeight="180px"
                />
                <div className={styles.wordCount}>
                  {getWordCount(entryContent)} words
                </div>
              </div>

              {/* Save Button */}
              <div className={styles.saveSection}>
                <Button 
                  variant="primary" 
                  size="large"
                  onClick={handleSaveEntry}
                  disabled={!entryTitle.trim() || !entryContent.replace(/<[^>]*>/g, '').trim()}
                >
                  Save Entry 💕
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Entries Tab */}
        {activeTab === 'recent' && (
          <div className={styles.recentSection}>
            <div className={styles.searchHeader}>
              <h3 className={styles.sectionTitle}>
                {hasActiveFilters ? 'Search Results' : 'Your Recent Entries'}
              </h3>
              
              {/* Search Bar */}
              <div className={styles.searchBar}>
                <div className={styles.searchInput}>
                  <input
                    type="text"
                    placeholder="Search your entries..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={styles.searchField}
                  />
                  <button
                    className={styles.filterToggle}
                    onClick={() => setShowFilters(!showFilters)}
                    title="Show filters"
                  >
                    🔍
                  </button>
                  {hasActiveFilters && (
                    <button
                      className={styles.clearSearch}
                      onClick={handleClearSearch}
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Filters */}
            {showFilters && (
              <div className={styles.searchFilters}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Date Range:</label>
                  <select
                    value={searchFilters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="trimester">This Trimester</option>
                  </select>
                </div>
                
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Entry Type:</label>
                  <select
                    value={searchFilters.entryType}
                    onChange={(e) => handleFilterChange('entryType', e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Types</option>
                    {Object.entries(ENTRY_TYPES).map(([key, type]) => (
                      <option key={key} value={key}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Mood:</label>
                  <select
                    value={searchFilters.mood}
                    onChange={(e) => handleFilterChange('mood', e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Moods</option>
                    <option value="excellent">😊 Excellent</option>
                    <option value="good">🙂 Good</option>
                    <option value="okay">😐 Okay</option>
                    <option value="low">😔 Low</option>
                    <option value="difficult">😰 Difficult</option>
                  </select>
                </div>
              </div>
            )}
            
            {displayEntries.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <h4>No entries yet</h4>
                <p>Start documenting your pregnancy journey by writing your first entry!</p>
                <Button 
                  variant="primary" 
                  onClick={() => setActiveTab('write')}
                >
                  Write Your First Entry
                </Button>
              </div>
            ) : (
              <div className={styles.entriesList}>
                {hasActiveFilters && (
                  <div className={styles.searchSummary}>
                    Found {displayEntries.length} {displayEntries.length === 1 ? 'entry' : 'entries'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </div>
                )}
                
                {displayEntries.map((entry) => (
                  <div key={entry.id} className={styles.entryCard}>
                    <div className={styles.entryHeader}>
                      <div className={styles.entryMeta}>
                        <span className={styles.entryType}>
                          {ENTRY_TYPES[entry.type]?.icon} {ENTRY_TYPES[entry.type]?.label}
                        </span>
                        <span className={styles.entryDate}>{getTimeAgo(entry.createdAt)}</span>
                      </div>
                      <div className={styles.entryActions}>
                        {entry.mood && (
                          <span className={styles.entryMood}>{moodEmojis[entry.mood]}</span>
                        )}
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditEntry(entry)}
                          title="Edit entry"
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteEntry(entry.id, entry.type, entry.title)}
                          title="Delete entry"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <h4 className={styles.entryTitle}>{entry.title}</h4>
                    
                    <div className={styles.entryContent}>
                      {entry.gratitudeItems && (
                        <div className={styles.gratitudeList}>
                          {entry.gratitudeItems.map((item, index) => (
                            <div key={index} className={styles.gratitudeItem}>
                              🙏 {item}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Full Entry Content with Images */}
                      <div 
                        className={styles.entryText}
                        dangerouslySetInnerHTML={{
                          __html: truncateHtmlContent(entry.content, 200)
                        }}
                      />
                      
                      {/* Fallback Image Preview - only show if no images in main content */}
                      {hasImages(entry.content) && !truncateHtmlContent(entry.content, 200).includes('<img') && (
                        <div className={styles.entryImagePreview}>
                          <img 
                            src={getFirstImage(entry.content)} 
                            alt="Entry image preview" 
                            className={styles.previewImg}
                            onError={(e) => {
                              console.log('Image load error:', e.target.src);
                              e.target.style.display = 'none';
                            }}
                          />
                          {entry.content.split('<img').length - 1 > 1 && (
                            <div className={styles.imageCount}>
                              +{entry.content.split('<img').length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.entryFooter}>
                      <span className={styles.entryStats}>
                        {entry.wordCount} words · Week {entry.week}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className={styles.insightsSection}>
            <h3 className={styles.sectionTitle}>Your Writing Journey</h3>
            
            <div className={styles.insightsGrid}>
              
              
              {/* Writing Statistics */}
              <div className={styles.insightCard}>
                <h4 className={styles.insightTitle}>📈 Writing Statistics</h4>
                <div className={styles.statsList}>
                  <div className={styles.statsRow}>
                    <span>Total entries:</span>
                    <span>{writingStats.totalEntries}</span>
                  </div>
                  <div className={styles.statsRow}>
                    <span>Total words:</span>
                    <span>{writingStats.totalWords?.toLocaleString()}</span>
                  </div>
                  <div className={styles.statsRow}>
                    <span>Average per entry:</span>
                    <span>{writingStats.averageWordsPerEntry} words</span>
                  </div>
                  <div className={styles.statsRow}>
                    <span>This week:</span>
                    <span>{writingStats.entriesThisWeek} entries</span>
                  </div>
                  <div className={styles.statsRow}>
                    <span>Current streak:</span>
                    <span>{writingStats.streak} days</span>
                  </div>
                </div>
              </div>

              {/* Pregnancy Progress */}
              <div className={styles.insightCard}>
                <h4 className={styles.insightTitle}>🤰 Pregnancy Milestones</h4>
                <div className={styles.pregnancyInfo}>
                  <p>You're currently in <strong>week {pregnancyData.currentWeek}</strong> of your pregnancy journey.</p>
                  <p>You've documented <strong>{writingStats.totalEntries}</strong> moments along the way.</p>
                  <p>Keep writing to create beautiful memories for you and your baby! 💕</p>
                </div>
              </div>

              {/* Encouragement */}
              <div className={styles.insightCard}>
                <h4 className={styles.insightTitle}>✨ Keep Going!</h4>
                <div className={styles.encouragement}>
                  {writingStats.streak > 0 ? (
                    <p>Amazing! You've written for <strong>{writingStats.streak} day{writingStats.streak > 1 ? 's' : ''}</strong> in a row. Keep up this wonderful habit!</p>
                  ) : (
                    <p>Every entry is a precious memory. Start your writing streak today!</p>
                  )}
                  
                  {writingStats.totalEntries >= 10 && (
                    <p>🎉 You've written {writingStats.totalEntries} entries! Your future self and your baby will treasure these memories.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Entry</h3>
              <button
                className={styles.closeButton}
                onClick={handleCancelEdit}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Title Input */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Entry Title</label>
                <input
                  type="text"
                  className={styles.titleInput}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              {/* Gratitude Items (only for gratitude entries) */}
              {editingEntry?.type === 'gratitude' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Things I'm grateful for:</label>
                  {editGratitudeItems.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      className={styles.gratitudeInput}
                      placeholder={`Gratitude ${index + 1}...`}
                      value={item}
                      onChange={(e) => {
                        const newItems = [...editGratitudeItems];
                        newItems[index] = e.target.value;
                        setEditGratitudeItems(newItems);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Mood Selection */}
              {editingEntry?.type !== 'letters' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>How are you feeling?</label>
                  <div className={styles.moodSelector}>
                    {Object.entries(moodEmojis).map(([mood, emoji]) => (
                      <button
                        key={mood}
                        className={`${styles.moodButton} ${editMood === mood ? styles.selectedMood : ''}`}
                        onClick={() => setEditMood(mood)}
                      >
                        <span className={styles.moodEmoji}>{emoji}</span>
                        <span className={styles.moodLabel}>{mood}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rich Text Editor */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {editingEntry?.type === 'gratitude' ? 'Additional thoughts (optional)' : 'Your thoughts'}
                </label>
                <RichTextEditor
                  value={editContent}
                  onChange={setEditContent}
                  placeholder={
                    editingEntry?.type === 'letters' 
                      ? "Dear little one..." 
                      : editingEntry?.type === 'gratitude'
                        ? "Any other thoughts about your gratitude today..."
                        : "Share what's on your mind and heart..."
                  }
                  minHeight="180px"
                />
                <div className={styles.wordCount}>
                  {getWordCount(editContent)} words
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button 
                variant="secondary" 
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveEdit}
                disabled={!editTitle.trim() || !editContent.replace(/<[^>]*>/g, '').trim()}
              >
                Save Changes 💕
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Journal;