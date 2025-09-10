import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../Button';
import styles from './ThemeSelector.module.css';

function ThemeSelector({ onClose }) {
  const { 
    currentTheme, 
    isCustomTheme, 
    PRESET_THEMES, 
    setPresetTheme, 
    setCustomTheme,
    resetToDefault 
  } = useTheme();

  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#F4A6CD');

  const handlePresetThemeSelect = (themeId) => {
    setPresetTheme(themeId);
    if (onClose) onClose();
  };

  const handleCustomColorApply = () => {
    setCustomTheme(customColor);
    setShowCustomPicker(false);
    if (onClose) onClose();
  };

  const presetThemesList = Object.values(PRESET_THEMES);

  return (
    <div className={styles.themeSelector}>
      <div className={styles.header}>
        <h3 className={styles.title}>🎨 Choose Your Theme</h3>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
      </div>

      <div className={styles.content}>
        
        {/* Current Theme Display */}
        <div className={styles.currentTheme}>
          <h4>Current Theme</h4>
          <div className={styles.currentThemeDisplay}>
            <div 
              className={styles.colorPreview}
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <span className={styles.themeName}>{currentTheme.name}</span>
            {isCustomTheme && (
              <span className={styles.customBadge}>Custom</span>
            )}
          </div>
        </div>

        {/* Preset Themes */}
        <div className={styles.presetThemes}>
          <h4>Preset Themes</h4>
          <div className={styles.themeGrid}>
            {presetThemesList.map((theme) => (
              <button
                key={theme.id}
                className={`${styles.themeOption} ${
                  currentTheme.id === theme.id && !isCustomTheme ? styles.selected : ''
                }`}
                onClick={() => handlePresetThemeSelect(theme.id)}
              >
                <div className={styles.themePreview}>
                  <div 
                    className={styles.primaryColor}
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className={styles.accentColor}
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <div 
                    className={styles.backgroundSample}
                    style={{ backgroundColor: theme.colors.background }}
                  />
                </div>
                <span className={styles.themeLabel}>{theme.name}</span>
                {currentTheme.id === theme.id && !isCustomTheme && (
                  <div className={styles.selectedIndicator}>✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div className={styles.customSection}>
          <h4>Create Custom Theme</h4>
          
          {!showCustomPicker ? (
            <Button 
              variant="secondary" 
              onClick={() => setShowCustomPicker(true)}
            >
              🎨 Custom Color Picker
            </Button>
          ) : (
            <div className={styles.customPicker}>
              <div className={styles.colorInputGroup}>
                <label htmlFor="customColor">Choose Primary Color:</label>
                <div className={styles.colorInputWrapper}>
                  <input
                    id="customColor"
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className={styles.colorInput}
                  />
                  <span className={styles.colorValue}>{customColor}</span>
                </div>
              </div>
              
              <div className={styles.customPreview}>
                <div className={styles.previewText}>Preview:</div>
                <div className={styles.previewSwatch}>
                  <div 
                    className={styles.previewColor}
                    style={{ backgroundColor: customColor }}
                  />
                  <div 
                    className={styles.previewAccent}
                    style={{ backgroundColor: customColor + '80' }}
                  />
                </div>
              </div>

              <div className={styles.customActions}>
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={() => setShowCustomPicker(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={handleCustomColorApply}
                >
                  Apply Custom Theme
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Reset Option */}
        <div className={styles.resetSection}>
          <Button 
            variant="gentle" 
            size="small"
            onClick={resetToDefault}
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;