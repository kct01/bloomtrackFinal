import React, { useState, useRef, useEffect } from 'react';
import styles from './RichTextEditor.module.css';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing...',
  minHeight = '150px'
}) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageAlt, setImageAlt] = useState('');
  const [imageAlignment, setImageAlignment] = useState('left');

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Execute formatting commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  // Check if command is active
  const isCommandActive = (command) => {
    return document.queryCommandState(command);
  };

  // Handle special formatting
  const handleHeading = (level) => {
    execCommand('formatBlock', `h${level}`);
  };

  const handleList = (type) => {
    if (type === 'bullet') {
      execCommand('insertUnorderedList');
    } else {
      execCommand('insertOrderedList');
    }
  };

  const handleLink = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const selectedText = selection.toString();
      if (selectedText) {
        setLinkText(selectedText);
        setShowLinkDialog(true);
      } else {
        // No text selected, prompt for both text and URL
        setLinkText('');
        setShowLinkDialog(true);
      }
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      if (linkText) {
        // Insert new link
        execCommand('insertHTML', `<a href="${linkUrl}" target="_blank">${linkText}</a>`);
      } else {
        // Wrap selected text
        execCommand('createLink', linkUrl);
      }
    }
    setShowLinkDialog(false);
    setLinkText('');
    setLinkUrl('');
  };

  // Handle image upload
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (limit to 5MB for performance)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB. Please choose a smaller image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setImageAlt(`Image uploaded on ${new Date().toLocaleDateString()}`);
        setShowImageDialog(true);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (JPG, PNG, GIF, etc.).');
    }
    // Reset file input
    event.target.value = '';
  };

  const insertImage = () => {
    if (imagePreview) {
      const imgId = `img-${Date.now()}`;
      const alignClass = imageAlignment === 'center' ? 'center' : 
                        imageAlignment === 'right' ? 'right' : 'left';
      
      const imageHTML = `
        <div class="image-container image-${alignClass}" style="text-align: ${imageAlignment}; margin: 16px 0;">
          <img 
            id="${imgId}"
            src="${imagePreview}" 
            alt="${imageAlt}" 
            style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" 
          />
          ${imageAlt ? `<div style="font-size: 14px; color: #666; margin-top: 8px; font-style: italic;">${imageAlt}</div>` : ''}
        </div>
      `;
      
      execCommand('insertHTML', imageHTML);
    }
    
    // Reset state
    setShowImageDialog(false);
    setImagePreview(null);
    setImageAlt('');
    setImageAlignment('left');
  };

  const cancelImageInsert = () => {
    setShowImageDialog(false);
    setImagePreview(null);
    setImageAlt('');
    setImageAlignment('left');
  };

  const formatButtons = [
    {
      command: 'bold',
      icon: '𝐁',
      title: 'Bold (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    {
      command: 'italic',
      icon: '𝐼',
      title: 'Italic (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    {
      command: 'underline',
      icon: '𝐔',
      title: 'Underline (Ctrl+U)',
      shortcut: 'Ctrl+U'
    }
  ];

  const structureButtons = [
    {
      action: () => handleHeading(1),
      icon: 'H1',
      title: 'Heading 1',
      type: 'heading'
    },
    {
      action: () => handleHeading(2),
      icon: 'H2',
      title: 'Heading 2',
      type: 'heading'
    },
    {
      action: () => handleList('bullet'),
      icon: '•',
      title: 'Bullet List',
      type: 'list'
    },
    {
      action: () => handleList('number'),
      icon: '1.',
      title: 'Numbered List',
      type: 'list'
    }
  ];

  const utilityButtons = [
    {
      action: handleLink,
      icon: '🔗',
      title: 'Insert Link',
      type: 'utility'
    },
    {
      action: handleImageUpload,
      icon: '🖼️',
      title: 'Insert Image',
      type: 'utility'
    },
    {
      command: 'justifyLeft',
      icon: '⬅',
      title: 'Align Left',
      type: 'align'
    },
    {
      command: 'justifyCenter',
      icon: '⬢',
      title: 'Align Center',
      type: 'align'
    },
    {
      command: 'justifyRight',
      icon: '➡',
      title: 'Align Right',
      type: 'align'
    }
  ];

  return (
    <div className={styles.richTextEditor}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        
        {/* Basic Formatting */}
        <div className={styles.buttonGroup}>
          {formatButtons.map(button => (
            <button
              key={button.command}
              type="button"
              className={`${styles.toolbarButton} ${
                isCommandActive(button.command) ? styles.active : ''
              }`}
              onClick={() => execCommand(button.command)}
              title={button.title}
            >
              {button.icon}
            </button>
          ))}
        </div>

        <div className={styles.separator} />

        {/* Structure Buttons */}
        <div className={styles.buttonGroup}>
          {structureButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className={styles.toolbarButton}
              onClick={button.action}
              title={button.title}
            >
              {button.icon}
            </button>
          ))}
        </div>

        <div className={styles.separator} />

        {/* Utility Buttons */}
        <div className={styles.buttonGroup}>
          {utilityButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.toolbarButton} ${
                button.command && isCommandActive(button.command) ? styles.active : ''
              }`}
              onClick={button.action || (() => execCommand(button.command))}
              title={button.title}
            >
              {button.icon}
            </button>
          ))}
        </div>

        <div className={styles.separator} />

        {/* Clear Formatting */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => execCommand('removeFormat')}
            title="Clear Formatting"
          >
            ✨
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        className={styles.editorContent}
        contentEditable={true}
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        suppressContentEditableWarning={true}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        capture="environment" // Allows camera access on mobile
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className={styles.linkDialog}>
          <div className={styles.dialogContent}>
            <h4>Insert Link</h4>
            <div className={styles.dialogForm}>
              <input
                type="text"
                placeholder="Link text (optional)"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className={styles.linkInput}
              />
              <input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className={styles.linkInput}
              />
              <div className={styles.dialogActions}>
                <button
                  type="button"
                  onClick={() => setShowLinkDialog(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  className={styles.insertButton}
                  disabled={!linkUrl}
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className={styles.linkDialog}>
          <div className={styles.dialogContent}>
            <h4>Insert Image</h4>
            <div className={styles.dialogForm}>
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className={styles.previewImage}
                  />
                </div>
              )}
              
              <input
                type="text"
                placeholder="Image description (optional)"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className={styles.linkInput}
              />
              
              <div className={styles.alignmentSelector}>
                <label className={styles.alignmentLabel}>Image Alignment:</label>
                <div className={styles.alignmentButtons}>
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      type="button"
                      className={`${styles.alignmentButton} ${imageAlignment === align ? styles.active : ''}`}
                      onClick={() => setImageAlignment(align)}
                    >
                      {align === 'left' && '⬅'}
                      {align === 'center' && '⬢'}
                      {align === 'right' && '➡'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.dialogActions}>
                <button
                  type="button"
                  onClick={cancelImageInsert}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertImage}
                  className={styles.insertButton}
                  disabled={!imagePreview}
                >
                  Insert Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;