import React, { useState, useRef } from 'react';
import Button from '../../common/Button';
import styles from './PhotoUpload.module.css';

function PhotoUpload({ 
  onPhotosSelected, 
  maxFiles = 5, 
  acceptedTypes = "image/*",
  disabled = false,
  showPreview = true,
  multiple = true,
  label = "Add Photos"
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push(`${file.name}: Not a valid image file`);
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`${file.name}: File too large (max 5MB)`);
    }
    
    return errors;
  };

  const processFiles = (files) => {
    const fileArray = Array.from(files);
    const allErrors = [];
    const validFiles = [];
    const newPreviews = [];

    // Validate files
    fileArray.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        allErrors.push(...fileErrors);
      } else {
        validFiles.push(file);
      }
    });

    // Check total file count
    const totalFiles = selectedFiles.length + validFiles.length;
    if (totalFiles > maxFiles) {
      allErrors.push(`Maximum ${maxFiles} files allowed. Please remove some files first.`);
      setErrors(allErrors);
      return;
    }

    // Create previews for valid files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = {
          id: `${file.name}-${Date.now()}`,
          file,
          url: e.target.result,
          name: file.name,
          size: file.size
        };
        newPreviews.push(preview);
        
        if (newPreviews.length === validFiles.length) {
          const updatedFiles = [...selectedFiles, ...validFiles];
          const updatedPreviews = [...previews, ...newPreviews];
          
          setSelectedFiles(updatedFiles);
          setPreviews(updatedPreviews);
          setErrors(allErrors);
          
          // Notify parent component
          if (onPhotosSelected) {
            onPhotosSelected(updatedFiles);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length === 0 && allErrors.length > 0) {
      setErrors(allErrors);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removePhoto = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
    
    if (onPhotosSelected) {
      onPhotosSelected(updatedFiles);
    }
    
    // Clear input value to allow re-selecting same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onPhotosSelected) {
      onPhotosSelected([]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.photoUpload}>
      
      {/* Upload Area */}
      <div
        className={`${styles.uploadArea} ${
          dragActive ? styles.dragActive : ''
        } ${disabled ? styles.disabled : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleFileSelect}
          className={styles.fileInput}
          disabled={disabled}
        />
        
        <div className={styles.uploadContent}>
          <div className={styles.uploadIcon}>📸</div>
          <div className={styles.uploadText}>
            <p className={styles.uploadTitle}>{label}</p>
            <p className={styles.uploadSubtitle}>
              Drag & drop photos here or click to browse
            </p>
            <p className={styles.uploadHint}>
              {multiple ? `Up to ${maxFiles} photos` : '1 photo'} " Max 5MB each " JPG, PNG, GIF
            </p>
          </div>
        </div>
        
        {dragActive && (
          <div className={styles.dragOverlay}>
            <div className={styles.dragMessage}>Drop photos here</div>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className={styles.errorMessages}>
          {errors.map((error, index) => (
            <div key={index} className={styles.errorMessage}>
              � {error}
            </div>
          ))}
        </div>
      )}

      {/* File Counter */}
      {selectedFiles.length > 0 && (
        <div className={styles.fileCounter}>
          {selectedFiles.length} of {maxFiles} photos selected
          {selectedFiles.length > 0 && (
            <button
              className={styles.clearAllBtn}
              onClick={clearAll}
              title="Remove all photos"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Photo Previews */}
      {showPreview && previews.length > 0 && (
        <div className={styles.previewContainer}>
          <h4 className={styles.previewTitle}>Photo Preview</h4>
          <div className={styles.previewGrid}>
            {previews.map((preview, index) => (
              <div key={preview.id} className={styles.previewItem}>
                <div className={styles.previewImageContainer}>
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className={styles.previewImage}
                  />
                  <button
                    className={styles.removeButton}
                    onClick={() => removePhoto(index)}
                    title="Remove photo"
                  >
                    
                  </button>
                </div>
                <div className={styles.previewInfo}>
                  <p className={styles.previewName}>{preview.name}</p>
                  <p className={styles.previewSize}>{formatFileSize(preview.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress (if needed for future implementation) */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className={styles.progressContainer}>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className={styles.progressItem}>
              <span className={styles.progressFileName}>{fileName}</span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={styles.progressPercent}>{progress}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;