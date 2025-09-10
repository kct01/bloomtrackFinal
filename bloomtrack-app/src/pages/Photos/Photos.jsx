import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import PhotoUpload from '../../components/milestones/PhotoUpload';
import styles from './Photos.module.css';

function Photos() {
  const { user, pregnancyData } = useApp();
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [photos, setPhotos] = useState([]);

  const [newPhotoData, setNewPhotoData] = useState({
    title: '',
    description: '',
    category: 'bump',
    week: pregnancyData.currentWeek || 1,
    date: new Date().toISOString().split('T')[0] // Today's date as default
  });

  const categories = {
    all: { label: 'All Photos', icon: '📷', color: '#F4A6CD' },
    bump: { label: 'Bump Photos', icon: '🤰', color: '#FFB5A7' },
    ultrasound: { label: 'Ultrasounds', icon: '🔬', color: '#C8A8E9' },
    maternity: { label: 'Maternity', icon: '👶', color: '#A8D8A8' },
    family: { label: 'Family', icon: '👨‍👩‍👧‍👦', color: '#F4A261' },
    nursery: { label: 'Nursery', icon: '🏠', color: '#E8B4B8' },
    custom: { label: 'Custom', icon: '⭐', color: '#F4A261' }
  };

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load photos from localStorage on component mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem('bloomtrack_photos');
    if (savedPhotos) {
      try {
        const parsedPhotos = JSON.parse(savedPhotos);
        setPhotos(parsedPhotos);
      } catch (error) {
        console.error('Error loading photos from localStorage:', error);
        // Initialize with sample photos if there's an error
        initializeSamplePhotos();
      }
    } else {
      // Initialize with sample photos for first-time users
      initializeSamplePhotos();
    }
  }, []);

  // Save photos to localStorage whenever photos array changes
  useEffect(() => {
    if (photos.length > 0) {
      try {
        localStorage.setItem('bloomtrack_photos', JSON.stringify(photos));
      } catch (error) {
        console.error('Error saving photos to localStorage:', error);
      }
    }
  }, [photos]);

  // Initialize sample photos for demo purposes
  const initializeSamplePhotos = () => {
    const samplePhotos = [
      {
        id: 1,
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjRBNkNEIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI0OCIgZmlsbD0iI0Y0QTZDRCI+🤰PC90ZXh0Pgo8dGV4dCB4PSIxNTAiIHk9IjI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NjY2NiI+V2VlayAxMiBCdW1wPC90ZXh0Pgo8L3N2Zz4K',
        title: 'Week 12 Bump',
        week: 12,
        date: '2025-01-15',
        description: 'First visible bump! So excited! 💕',
        category: 'bump'
      },
      {
        id: 2,
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjQzhBOEU5IiBmaWxsLW9wYWN0dHk9IjAuMSIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI0OCIgZmlsbD0iI0M4QThFOSI+🔬PC90ZXh0Pgo8dGV4dCB4PSIxNTAiIHk9IjI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NjY2NiI+VWx0cmFzb3VuZCBWaXNpdDwvdGV4dD4KPHN2Zz4K',
        title: 'Ultrasound Visit',
        week: 20,
        date: '2025-02-15',
        description: 'First clear ultrasound photo - baby is healthy!',
        category: 'ultrasound'
      },
      {
        id: 3,
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjQThEOEE4IiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI0OCIgZmlsbD0iI0E4RDhBOCI+👶PC90ZXh0Pgo8dGV4dCB4PSIxNTAiIHk9IjI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NjY2NiI+TWF0ZXJuaXR5IFBob3Rvc2hvb3Q8L3RleHQ+Cjwvc3ZnPgo=',
        title: 'Maternity Photoshoot',
        week: 34,
        date: '2025-04-15',
        description: 'Professional maternity photos with my partner',
        category: 'maternity'
      }
    ];
    setPhotos(samplePhotos);
  };

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const handlePhotoUpload = (uploadedPhotos) => {
    if (uploadedPhotos && uploadedPhotos.length > 0) {
      // Process each photo to convert to base64 for localStorage persistence
      const processPhotos = uploadedPhotos.map((photo, index) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: Date.now() + index,
              url: e.target.result, // base64 data URL
              title: newPhotoData.title || `Photo ${Date.now()}`,
              week: newPhotoData.week,
              date: newPhotoData.date,
              description: newPhotoData.description,
              category: newPhotoData.category
            });
          };
          reader.readAsDataURL(photo);
        });
      });

      Promise.all(processPhotos).then((newPhotos) => {
        setPhotos([...photos, ...newPhotos]);
        setShowUploadModal(false);
        setNewPhotoData({
          title: '',
          description: '',
          category: 'bump',
          week: pregnancyData.currentWeek || 1,
          date: new Date().toISOString().split('T')[0]
        });
      });
    }
  };

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const deletePhoto = (photoId) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
    setSelectedPhoto(null);
  };

  const openEditModal = (photo) => {
    setEditingPhoto({
      ...photo
    });
    setShowEditModal(true);
    setSelectedPhoto(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPhoto(null);
    setNewImageFile(null);
    setNewImagePreview(null);
  };

  const saveEditedPhoto = () => {
    if (editingPhoto) {
      if (newImageFile) {
        // If a new image was selected, process it
        const reader = new FileReader();
        reader.onload = (e) => {
          const updatedPhoto = {
            ...editingPhoto,
            url: e.target.result // Replace with new image
          };
          setPhotos(photos.map(photo => 
            photo.id === editingPhoto.id ? updatedPhoto : photo
          ));
          closeEditModal();
        };
        reader.readAsDataURL(newImageFile);
      } else {
        // No new image, just update metadata
        setPhotos(photos.map(photo => 
          photo.id === editingPhoto.id ? editingPhoto : photo
        ));
        closeEditModal();
      }
    }
  };

  const handleEditFieldChange = (field, value) => {
    setEditingPhoto(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openUploadModalWithCategory = (categoryKey) => {
    setNewPhotoData({
      ...newPhotoData,
      category: categoryKey
    });
    setShowUploadModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.photosPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.pageTitle}>📸 Your Photo Journey</h1>
          <p className={styles.pageSubtitle}>
            Capture and cherish every precious moment, {user.name || 'Beautiful'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{photos.length}</span>
            <span className={styles.statLabel}>Photos</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>Week {pregnancyData.currentWeek}</span>
            <span className={styles.statLabel}>Current</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'gallery' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          🖼️ Gallery
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'timeline' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          📅 Timeline
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'categories' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          🏷️ Categories
        </button>
      </div>

      {/* Upload Button */}
      <div className={styles.uploadSection}>
        <Button 
          variant="primary" 
          onClick={() => setShowUploadModal(true)}
          className={styles.uploadButton}
        >
          📸 Add New Photos
        </Button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        
        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className={styles.gallerySection}>
            
            {/* Category Filter */}
            <div className={styles.categoryFilter}>
              <div className={styles.categoryButtons}>
                {Object.entries(categories).map(([key, category]) => (
                  <button
                    key={key}
                    className={`${styles.categoryButton} ${selectedCategory === key ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    <span className={styles.categoryIcon}>{category.icon}</span>
                    <span className={styles.categoryLabel}>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Grid */}
            <div className={styles.photoGrid}>
              {filteredPhotos.length > 0 ? (
                filteredPhotos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className={styles.photoCard}
                    onClick={() => openPhotoModal(photo)}
                  >
                    <div className={styles.photoImageContainer}>
                      <img 
                        src={photo.url} 
                        alt={photo.title}
                        className={styles.photoImage}
                      />
                      <div className={styles.photoOverlay}>
                        <div className={styles.photoInfo}>
                          <span className={styles.photoWeek}>Week {photo.week}</span>
                          <span className={styles.photoCategory}>
                            {categories[photo.category]?.icon} {categories[photo.category]?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.photoDetails}>
                      <h4 className={styles.photoTitle}>{photo.title}</h4>
                      <p className={styles.photoDate}>{formatDate(photo.date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📷</div>
                  <h3>No photos yet</h3>
                  <p>Start capturing your pregnancy journey!</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowUploadModal(true)}
                  >
                    Add Your First Photo
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className={styles.timelineSection}>
            <div className={styles.timeline}>
              {photos
                .sort((a, b) => {
                  // First sort by date
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);
                  const dateDiff = dateA - dateB;
                  
                  // If dates are the same, sort by week number
                  if (dateDiff === 0) {
                    return a.week - b.week;
                  }
                  
                  return dateDiff;
                })
                .map((photo, index) => (
                <div key={photo.id} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>
                    <span className={styles.timelineWeek}>W{photo.week}</span>
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelinePhoto}>
                      <img 
                        src={photo.url} 
                        alt={photo.title}
                        onClick={() => openPhotoModal(photo)}
                      />
                    </div>
                    <div className={styles.timelineInfo}>
                      <h4>{photo.title}</h4>
                      <p className={styles.timelineDate}>{formatDate(photo.date)}</p>
                      <p className={styles.timelineDescription}>{photo.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className={styles.categoriesSection}>
            <div className={styles.categoryGrid}>
              {Object.entries(categories).filter(([key]) => key !== 'all').map(([key, category]) => {
                const categoryPhotos = photos.filter(photo => photo.category === key);
                return (
                  <div key={key} className={styles.categoryCard}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryCardIcon}>{category.icon}</span>
                      <h3 className={styles.categoryCardTitle}>{category.label}</h3>
                      <span className={styles.categoryCount}>{categoryPhotos.length}</span>
                    </div>
                    <div className={styles.categoryPreview}>
                      {categoryPhotos.slice(0, 4).map((photo) => (
                        <img 
                          key={photo.id}
                          src={photo.url}
                          alt={photo.title}
                          className={styles.categoryPreviewImage}
                          onClick={() => openPhotoModal(photo)}
                        />
                      ))}
                      {categoryPhotos.length === 0 && (
                        <div className={styles.categoryEmpty}>
                          <span>No photos yet</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.categoryActions}>
                      <Button 
                        variant="gentle" 
                        size="small"
                        className={styles.categoryAddButton}
                        onClick={() => openUploadModalWithCategory(key)}
                      >
                        📸 Add Photo
                      </Button>
                      {categoryPhotos.length > 0 && (
                        <span className={styles.categoryViewAll}>
                          View all {categoryPhotos.length} photos
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>📸 Add New Photos</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Photo Title</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g., Week 20 Bump Photo"
                  value={newPhotoData.title}
                  onChange={(e) => setNewPhotoData({
                    ...newPhotoData,
                    title: e.target.value
                  })}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select
                    className={styles.formSelect}
                    value={newPhotoData.category}
                    onChange={(e) => setNewPhotoData({
                      ...newPhotoData,
                      category: e.target.value
                    })}
                  >
                    {Object.entries(categories).filter(([key]) => key !== 'all').map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Week</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    className={styles.formInput}
                    value={newPhotoData.week}
                    onChange={(e) => setNewPhotoData({
                      ...newPhotoData,
                      week: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Photo Date</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={newPhotoData.date}
                  onChange={(e) => setNewPhotoData({
                    ...newPhotoData,
                    date: e.target.value
                  })}
                  max={new Date().toISOString().split('T')[0]} // Can't select future dates
                />
                <small className={styles.helpText}>When was this photo taken?</small>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description (Optional)</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Share your thoughts about this moment..."
                  value={newPhotoData.description}
                  onChange={(e) => setNewPhotoData({
                    ...newPhotoData,
                    description: e.target.value
                  })}
                  rows="3"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Select Photos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className={styles.formInput}
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    handlePhotoUpload(files);
                  }}
                />
                <small className={styles.helpText}>Select one or more image files</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className={styles.modalOverlay} onClick={closePhotoModal}>
          <div className={styles.photoModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.photoModalHeader}>
              <h3>{selectedPhoto.title}</h3>
              <button 
                className={styles.closeButton}
                onClick={closePhotoModal}
              >
                ×
              </button>
            </div>
            
            <div className={styles.photoModalContent}>
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title}
                className={styles.fullSizePhoto}
              />
              
              <div className={styles.photoModalInfo}>
                <div className={styles.photoModalMeta}>
                  <span className={styles.photoModalWeek}>Week {selectedPhoto.week}</span>
                  <span className={styles.photoModalDate}>{formatDate(selectedPhoto.date)}</span>
                  <span className={styles.photoModalCategory}>
                    {categories[selectedPhoto.category]?.icon} {categories[selectedPhoto.category]?.label}
                  </span>
                </div>
                
                {selectedPhoto.description && (
                  <p className={styles.photoModalDescription}>{selectedPhoto.description}</p>
                )}
                
                <div className={styles.photoModalActions}>
                  <Button 
                    variant="gentle" 
                    size="small"
                    onClick={() => openEditModal(selectedPhoto)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => deletePhoto(selectedPhoto.id)}
                  >
                    🗑️ Delete
                  </Button>
                  <Button 
                    variant="primary" 
                    size="small"
                    onClick={() => {
                      // Share functionality would go here
                      alert('Share functionality coming soon! 📱');
                    }}
                  >
                    📤 Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Photo Modal */}
      {showEditModal && editingPhoto && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>✏️ Edit Photo Details</h3>
              <button 
                className={styles.closeButton}
                onClick={closeEditModal}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              {/* Current Photo and Replacement */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Photo Image</label>
                <div className={styles.imageReplacement}>
                  <div className={styles.currentImageSection}>
                    <div className={styles.imageLabel}>Current Photo:</div>
                    <img 
                      src={editingPhoto.url} 
                      alt={editingPhoto.title}
                      className={styles.currentImagePreview}
                    />
                  </div>
                  
                  {newImagePreview && (
                    <div className={styles.newImageSection}>
                      <div className={styles.imageLabel}>New Photo:</div>
                      <img 
                        src={newImagePreview} 
                        alt="New preview"
                        className={styles.newImagePreview}
                      />
                    </div>
                  )}
                  
                  <div className={styles.imageUploadSection}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.hiddenFileInput}
                      onChange={handleNewImageSelect}
                      id="edit-image-input"
                    />
                    <label htmlFor="edit-image-input" className={styles.uploadLabel}>
                      📸 {newImageFile ? 'Change Photo Again' : 'Replace Photo'}
                    </label>
                    <small className={styles.helpText}>
                      {newImageFile ? 'New photo selected! Click Save to apply changes.' : 'Select a new image to replace the current photo'}
                    </small>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Photo Title</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g., Week 20 Bump Photo"
                  value={editingPhoto.title}
                  onChange={(e) => handleEditFieldChange('title', e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select
                    className={styles.formSelect}
                    value={editingPhoto.category}
                    onChange={(e) => handleEditFieldChange('category', e.target.value)}
                  >
                    {Object.entries(categories).filter(([key]) => key !== 'all').map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Week</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    className={styles.formInput}
                    value={editingPhoto.week}
                    onChange={(e) => handleEditFieldChange('week', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Photo Date</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={editingPhoto.date}
                  onChange={(e) => handleEditFieldChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                <small className={styles.helpText}>When was this photo taken?</small>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Share your thoughts about this moment..."
                  value={editingPhoto.description || ''}
                  onChange={(e) => handleEditFieldChange('description', e.target.value)}
                  rows="3"
                />
              </div>

              <div className={styles.editModalActions}>
                <Button 
                  variant="secondary" 
                  size="medium"
                  onClick={closeEditModal}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="medium"
                  onClick={saveEditedPhoto}
                >
                  💾 Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Photos;