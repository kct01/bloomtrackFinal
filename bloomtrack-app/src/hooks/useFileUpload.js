import { useState, useCallback } from 'react';

export function useFileUpload(options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/*'],
    multiple = false,
    onProgress = null,
    onError = null
  } = options;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    // Check file type
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType + '/');
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `File type must be one of: ${allowedTypes.join(', ')}`;
    }

    return null;
  }, [maxSize, allowedTypes]);

  const uploadFile = useCallback(async (file, uploadUrl = null) => {
    setError(null);
    setProgress(0);
    setUploading(true);

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // For demo purposes, simulate file upload with base64 encoding
      if (!uploadUrl) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentProgress = Math.round((event.loaded / event.total) * 100);
              setProgress(percentProgress);
              onProgress?.(percentProgress);
            }
          };

          reader.onload = (event) => {
            const result = {
              url: event.target.result,
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified
            };
            setProgress(100);
            setUploading(false);
            resolve(result);
          };

          reader.onerror = (event) => {
            const error = new Error('Failed to read file');
            setError(error.message);
            setUploading(false);
            onError?.(error);
            reject(error);
          };

          reader.readAsDataURL(file);
        });
      }

      // Real upload to server
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentProgress = Math.round((event.loaded / event.total) * 100);
            setProgress(percentProgress);
            onProgress?.(percentProgress);
          }
        };

        xhr.onload = () => {
          setUploading(false);
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              resolve({ url: xhr.responseText });
            }
          } else {
            const error = new Error(`Upload failed with status ${xhr.status}`);
            setError(error.message);
            onError?.(error);
            reject(error);
          }
        };

        xhr.onerror = () => {
          const error = new Error('Network error during upload');
          setError(error.message);
          setUploading(false);
          onError?.(error);
          reject(error);
        };

        xhr.open('POST', uploadUrl);
        xhr.send(formData);
      });

    } catch (err) {
      setError(err.message);
      setUploading(false);
      onError?.(err);
      throw err;
    }
  }, [validateFile, onProgress, onError]);

  const uploadMultiple = useCallback(async (files, uploadUrl = null) => {
    if (!multiple) {
      throw new Error('Multiple upload not enabled');
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFile(files[i], uploadUrl);
        results.push(result);
      } catch (error) {
        errors.push({ file: files[i], error });
      }
    }

    return { results, errors };
  }, [multiple, uploadFile]);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadMultiple,
    validateFile,
    reset
  };
}

export function useImagePreview() {
  const [previews, setPreviews] = useState([]);

  const generatePreview = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const preview = {
          id: Date.now().toString(),
          url: event.target.result,
          name: file.name,
          size: file.size,
          file
        };
        
        setPreviews(prev => [...prev, preview]);
        resolve(preview);
      };

      reader.onerror = () => {
        reject(new Error('Failed to generate preview'));
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const removePreview = useCallback((id) => {
    setPreviews(prev => prev.filter(preview => preview.id !== id));
  }, []);

  const clearPreviews = useCallback(() => {
    setPreviews([]);
  }, []);

  return {
    previews,
    generatePreview,
    removePreview,
    clearPreviews
  };
}

export function useDragAndDrop(onDrop, options = {}) {
  const { accept = [], multiple = false } = options;
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState(null);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
    setDragError(null);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Only set dragging to false if we're leaving the drop zone entirely
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setDragError(null);

    const { files } = event.dataTransfer;
    
    if (files.length === 0) {
      setDragError('No files detected');
      return;
    }

    if (!multiple && files.length > 1) {
      setDragError('Multiple files not allowed');
      return;
    }

    // Validate file types if specified
    if (accept.length > 0) {
      const invalidFiles = Array.from(files).filter(file => {
        return !accept.some(acceptedType => {
          if (acceptedType.endsWith('/*')) {
            const baseType = acceptedType.split('/')[0];
            return file.type.startsWith(baseType + '/');
          }
          return file.type === acceptedType;
        });
      });

      if (invalidFiles.length > 0) {
        setDragError(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}`);
        return;
      }
    }

    onDrop(Array.from(files));
  }, [onDrop, accept, multiple]);

  const dragProps = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop
  };

  return {
    isDragging,
    dragError,
    dragProps
  };
}

export default useFileUpload;