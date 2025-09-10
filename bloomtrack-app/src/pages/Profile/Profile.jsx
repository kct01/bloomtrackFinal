import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { usePregnancy } from '../../context/PregnancyContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeSelector from '../../components/common/ThemeSelector';
import Button from '../../components/common/Button';
import DatePicker from '../../components/common/DatePicker';
import ProfilePhotoUpload from '../../components/common/ProfilePhotoUpload';
import NotificationSettings from '../../components/common/NotificationSettings';
import DataExport from '../../components/common/DataExport';
import styles from './Profile.module.css';

function Profile() {
  const location = useLocation();
  const { user, pregnancyData, updateBabyDetails, updatePregnancyData, setDueDate, updateUser } = useApp();
  const { babyWeight, babyLength } = usePregnancy();
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name || '',
    email: user.email || ''
  });

  // Check if we should open the pregnancy tab (from Dashboard navigation)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Update edited user state when user data changes
  useEffect(() => {
    setEditedUser({
      name: user.name || '',
      email: user.email || ''
    });
  }, [user.name, user.email]);

  // Baby details form handlers
  const handleBabyDetailsChange = (field, value) => {
    updateBabyDetails({ [field]: value });
  };

  const handleGenderSelect = (selectedGender) => {
    updateBabyDetails({ gender: selectedGender });
  };

  const handleDueDateChange = (newDueDate) => {
    console.log('📅 Profile: Due date changed to:', newDueDate);
    setDueDate(newDueDate);
  };

  const handleSaveBabyDetails = () => {
    // The data is already being saved in real-time through the onChange handlers
    // This could show a success message or perform additional validation
    alert('Changes saved successfully! 💕');
  };

  // General information edit handlers
  const handleEditGeneral = () => {
    setEditedUser({
      name: user.name || '',
      email: user.email || ''
    });
    setIsEditingGeneral(true);
  };

  const handleSaveGeneral = () => {
    updateUser(editedUser);
    setIsEditingGeneral(false);
    alert('Personal information updated! 🎉');
  };

  const handleCancelEdit = () => {
    setEditedUser({
      name: user.name || '',
      email: user.email || ''
    });
    setIsEditingGeneral(false);
  };

  const handleUserFieldChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePhotoChange = (photoData) => {
    console.log('📸 Profile photo changed:', photoData);
    updateUser({ profilePicture: photoData });
  };

  return (
    <div className={styles.profilePage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.pageTitle}>👤 Your Profile</h1>
          <p className={styles.pageSubtitle}>
            Manage your account, preferences, and pregnancy information
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'general' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('general')}
        >
          ⚙️ General
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'theme' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          🎨 Theme
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'pregnancy' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('pregnancy')}
        >
          🤰 Pregnancy Info
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'privacy' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          🔒 Privacy
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className={styles.generalSection}>
            <div className={styles.settingsGrid}>
              
              <div className={styles.settingCard}>
                <h3>👋 Personal Information</h3>
                
                {/* Profile Photo Upload */}
                <ProfilePhotoUpload
                  currentPhoto={user.profilePicture}
                  onPhotoChange={handleProfilePhotoChange}
                  disabled={false}
                />
                
                {!isEditingGeneral ? (
                  // View Mode
                  <>
                    <div className={styles.infoGroup}>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Name:</span>
                        <span className={styles.value}>{user.name || 'Beautiful Mama'}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Email:</span>
                        <span className={styles.value}>{user.email || 'Not set'}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Due Date:</span>
                        <span className={styles.value}>
                          {pregnancyData.dueDate ? new Date(pregnancyData.dueDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'Not set'}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Current Week:</span>
                        <span className={styles.value}>Week {pregnancyData.currentWeek || 1}</span>
                      </div>
                    </div>
                    <Button variant="secondary" size="small" onClick={handleEditGeneral}>
                      ✏️ Edit Information
                    </Button>
                  </>
                ) : (
                  // Edit Mode
                  <>
                    <div className={styles.editForm}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Name</label>
                        <input 
                          type="text" 
                          className={styles.formInput}
                          placeholder="Enter your name..."
                          value={editedUser.name}
                          onChange={(e) => handleUserFieldChange('name', e.target.value)}
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input 
                          type="email" 
                          className={styles.formInput}
                          placeholder="Enter your email..."
                          value={editedUser.email}
                          onChange={(e) => handleUserFieldChange('email', e.target.value)}
                        />
                      </div>
                      
                      <div className={styles.infoGroup}>
                        <div className={styles.infoItem}>
                          <span className={styles.label}>Due Date:</span>
                          <span className={styles.value}>
                            {pregnancyData.dueDate ? new Date(pregnancyData.dueDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 'Not set'}
                          </span>
                          <span className={styles.editNote}>(Edit in Pregnancy Info tab)</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.label}>Current Week:</span>
                          <span className={styles.value}>Week {pregnancyData.currentWeek || 1}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.editActions}>
                      <Button variant="gentle" size="small" onClick={handleSaveGeneral}>
                        💾 Save Changes
                      </Button>
                      <Button variant="secondary" size="small" onClick={handleCancelEdit}>
                        ❌ Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.settingCard}>
                <NotificationSettings />
              </div>

              <div className={styles.settingCard}>
                <DataExport />
              </div>

            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className={styles.themeSection}>
            <div className={styles.currentThemeInfo}>
              <h3>Current Theme: {currentTheme.name}</h3>
              <div className={styles.themePreview}>
                <div 
                  className={styles.colorSwatch}
                  style={{ backgroundColor: currentTheme.colors.primary }}
                />
                <div 
                  className={styles.colorSwatch}
                  style={{ backgroundColor: currentTheme.colors.accent }}
                />
                <div 
                  className={styles.colorSwatch}
                  style={{ backgroundColor: currentTheme.colors.background }}
                />
              </div>
            </div>

            <ThemeSelector />
          </div>
        )}

        {/* Pregnancy Info Tab */}
        {activeTab === 'pregnancy' && (
          <div className={styles.pregnancySection}>
            
            {/* Pregnancy Details Card */}
            <div className={styles.settingCard}>
              <h3>🤰 Pregnancy Details</h3>
              <div className={styles.pregnancyInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Due Date:</span>
                  <span className={styles.value}>{pregnancyData.dueDate || 'Not set'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Current Week:</span>
                  <span className={styles.value}>Week {pregnancyData.currentWeek || 1}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Trimester:</span>
                  <span className={styles.value}>Trimester {pregnancyData.currentTrimester || 1}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Days Until Due:</span>
                  <span className={styles.value}>{pregnancyData.daysUntilDue || 'Calculating...'}</span>
                </div>
              </div>
              <Button variant="primary" size="small">
                Update Pregnancy Info
              </Button>
            </div>

            {/* Baby Details Card */}
            <div className={styles.settingCard}>
              <h3>👶 Baby Details</h3>
              <p className={styles.cardDescription}>Customize your baby's information</p>
              <div className={styles.babyDetailsForm}>
                
                {/* Baby Name */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Baby's Name</label>
                  <input 
                    type="text" 
                    className={styles.formInput}
                    placeholder="Choose a name..."
                    value={pregnancyData.babyDetails?.name || ''}
                    onChange={(e) => handleBabyDetailsChange('name', e.target.value)}
                  />
                </div>

                {/* Gender Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Gender</label>
                  <div className={styles.genderOptions}>
                    <button 
                      className={`${styles.genderButton} ${pregnancyData.babyDetails?.gender === 'boy' ? styles.active : ''}`}
                      onClick={() => handleGenderSelect('boy')}
                      type="button"
                    >
                      💙 Boy
                    </button>
                    <button 
                      className={`${styles.genderButton} ${pregnancyData.babyDetails?.gender === 'girl' ? styles.active : ''}`}
                      onClick={() => handleGenderSelect('girl')}
                      type="button"
                    >
                      💗 Girl
                    </button>
                    <button 
                      className={`${styles.genderButton} ${pregnancyData.babyDetails?.gender === 'surprise' ? styles.active : ''}`}
                      onClick={() => handleGenderSelect('surprise')}
                      type="button"
                    >
                      💛 Surprise
                    </button>
                  </div>
                </div>

                {/* Baby Stats */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Weight</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      placeholder="e.g., 5.2 lbs"
                      value={pregnancyData.babyDetails?.weight || babyWeight || ''}
                      onChange={(e) => handleBabyDetailsChange('weight', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Length</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      placeholder="e.g., 12.5 in"
                      value={pregnancyData.babyDetails?.length || babyLength || ''}
                      onChange={(e) => handleBabyDetailsChange('length', e.target.value)}
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div className={styles.formGroup}>
                  <DatePicker
                    label="Due Date"
                    value={pregnancyData.dueDate || ''}
                    onChange={handleDueDateChange}
                    placeholder="Select your due date..."
                    className="pregnancy-theme"
                    minDate={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 30 days ago (in case baby was born early)
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]} // 1 year from now as maximum
                  />
                </div>

                {/* Birth Date (if baby is born) */}
                {pregnancyData.babyDetails?.birthDate && (
                  <div className={styles.formGroup}>
                    <DatePicker
                      label="Birth Date"
                      value={pregnancyData.babyDetails?.birthDate || ''}
                      onChange={(date) => handleBabyDetailsChange('birthDate', date)}
                      placeholder="Baby's birth date..."
                      className="pregnancy-theme"
                      maxDate={new Date().toISOString().split('T')[0]} // Today as maximum
                    />
                  </div>
                )}

                {/* Add Birth Date Button (if not already added) */}
                {!pregnancyData.babyDetails?.birthDate && (
                  <div className={styles.formGroup}>
                    <Button 
                      variant="gentle" 
                      size="small"
                      onClick={() => handleBabyDetailsChange('birthDate', new Date().toISOString().split('T')[0])}
                    >
                      👶 Add Birth Date
                    </Button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className={styles.formActions}>
                  <Button 
                    variant="gentle" 
                    size="small" 
                    className={styles.saveButton}
                    onClick={handleSaveBabyDetails}
                  >
                    💾 Save Changes
                  </Button>
                  <Button variant="secondary" size="small" className={styles.photoButton}>
                    📸 Add Photo
                  </Button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className={styles.privacySection}>
            <div className={styles.settingCard}>
              <h3>🔒 Privacy & Security</h3>
              <p className={styles.cardDescription}>
                Your pregnancy data is stored locally on your device and never shared without your permission.
              </p>
              <div className={styles.privacyOptions}>
                <div className={styles.privacyItem}>
                  <span>📱 Local Storage Only</span>
                  <span className={styles.privacyStatus}>✅ Enabled</span>
                </div>
                <div className={styles.privacyItem}>
                  <span>🔐 No Cloud Sync</span>
                  <span className={styles.privacyStatus}>✅ Secure</span>
                </div>
                <div className={styles.privacyItem}>
                  <span>🚫 No Data Sharing</span>
                  <span className={styles.privacyStatus}>✅ Private</span>
                </div>
              </div>
              <Button variant="secondary" size="small">
                Clear All Data
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;
