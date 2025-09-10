import React, { useState } from 'react';
import { useFileUpload, useImagePreview } from '../../../hooks/useFileUpload';
import Button from '../Button';
import styles from './ProfilePhotoUpload.module.css';

function ProfilePhotoUpload({ currentPhoto, onPhotoChange, disabled = false }) {
  const [showPreview, setShowPreview] = useState(false);
  const { uploadFile, uploading, progress, error, reset } = useFileUpload({
    maxSize: 2 * 1024 * 1024, // 2MB limit
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  });
  const { generatePreview, clearPreviews } = useImagePreview();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      reset();
      
      // Generate preview
      const preview = await generatePreview(file);
      setShowPreview(true);
      
      // Upload file (this returns base64 data URL for local storage)
      const result = await uploadFile(file);
      
      // Call the parent component's callback with the uploaded photo data
      onPhotoChange({
        url: result.url,
        name: result.name,
        size: result.size,
        type: result.type,
        uploadedAt: new Date().toISOString()
      });
      
      setShowPreview(false);
      clearPreviews();
      
    } catch (err) {
      console.error('Photo upload error:', err);
      setShowPreview(false);
      clearPreviews();
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
    reset();
  };

  return (
    <div className={styles.profilePhotoUpload}>
      <div className={styles.photoContainer}>
        {currentPhoto ? (
          // Display current photo
          <div className={styles.currentPhoto}>
            <img 
              src={currentPhoto.url || currentPhoto} 
              alt="Profile" 
              className={styles.photoImage}
            />
            <div className={styles.photoOverlay}>
              <label htmlFor="photo-upload" className={styles.changeButton}>
                📸 Change
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={disabled || uploading}
                  style={{ display: 'none' }}
                />
              </label>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className={styles.removeButton}
                disabled={disabled}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ) : (
          // Upload placeholder
          <div className={styles.uploadPlaceholder}>
            <div className={styles.placeholderIcon}>👤</div>
            <p className={styles.placeholderText}>Add Profile Photo</p>
            <label htmlFor="photo-upload" className={styles.uploadButton}>
              📸 Choose Photo
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={disabled || uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className={styles.uploadProgress}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>{progress}%</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          ⚠️ {error}
        </div>
      )}

      {/* File Info */}
      <div className={styles.fileInfo}>
        <small className={styles.fileInfoText}>
          Supported formats: JPEG, PNG, WebP, GIF (max 2MB)
        </small>
      </div>
    </div>
  );
}

export default ProfilePhotoUpload;