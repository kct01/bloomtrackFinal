import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Calendar, Clock } from 'lucide-react';
import styles from './Input.module.css';

const Input = forwardRef(({
  type = 'text',
  label = '',
  placeholder = '',
  value = '',
  onChange,
  onBlur,
  onFocus,
  error = '',
  success = '',
  helpText = '',
  disabled = false,
  required = false,
  variant = 'default',
  size = 'medium',
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  autoComplete = 'off',
  maxLength,
  pattern,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;
  
  // Build CSS classes
  const containerClasses = [
    styles.container,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    error ? styles.error : '',
    success ? styles.success : '',
    isFocused ? styles.focused : '',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    styles.input,
    icon && iconPosition === 'left' ? styles.hasIconLeft : '',
    icon && iconPosition === 'right' ? styles.hasIconRight : '',
    isPassword ? styles.hasPasswordToggle : ''
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={containerClasses}>
      
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className={styles.inputContainer}>
        
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className={styles.iconLeft}>
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          pattern={pattern}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            [
              error ? `${inputId}-error` : '',
              success ? `${inputId}-success` : '',
              helpText ? `${inputId}-help` : ''
            ].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && !isPassword && (
          <div className={styles.iconRight}>
            {icon}
          </div>
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Status Icons */}
        {error && (
          <div className={styles.statusIcon}>
            <AlertCircle size={18} />
          </div>
        )}

        {success && !error && (
          <div className={styles.statusIcon}>
            <CheckCircle size={18} />
          </div>
        )}
      </div>

      {/* Help Text */}
      {helpText && !error && !success && (
        <p id={`${inputId}-help`} className={styles.helpText}>
          {helpText}
        </p>
      )}

      {/* Success Message */}
      {success && (
        <p id={`${inputId}-success`} className={styles.successText}>
          {success}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p id={`${inputId}-error`} className={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
const Textarea = forwardRef(({
  label = '',
  placeholder = '',
  value = '',
  onChange,
  onBlur,
  onFocus,
  error = '',
  success = '',
  helpText = '',
  disabled = false,
  required = false,
  variant = 'default',
  size = 'medium',
  rows = 4,
  fullWidth = false,
  maxLength,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value.length);

  // Generate unique ID if not provided
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  // Build CSS classes
  const containerClasses = [
    styles.container,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    error ? styles.error : '',
    success ? styles.success : '',
    isFocused ? styles.focused : '',
    className
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    onChange?.(e);
  };

  return (
    <div className={containerClasses}>
      
      {/* Label */}
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* Textarea Container */}
      <div className={styles.inputContainer}>
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={`${styles.input} ${styles.textarea}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            [
              error ? `${textareaId}-error` : '',
              success ? `${textareaId}-success` : '',
              helpText ? `${textareaId}-help` : ''
            ].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />

        {/* Status Icons */}
        {error && (
          <div className={`${styles.statusIcon} ${styles.textareaStatusIcon}`}>
            <AlertCircle size={18} />
          </div>
        )}

        {success && !error && (
          <div className={`${styles.statusIcon} ${styles.textareaStatusIcon}`}>
            <CheckCircle size={18} />
          </div>
        )}
      </div>

      {/* Character Count */}
      {maxLength && (
        <div className={styles.charCount}>
          {charCount}/{maxLength}
        </div>
      )}

      {/* Help Text */}
      {helpText && !error && !success && (
        <p id={`${textareaId}-help`} className={styles.helpText}>
          {helpText}
        </p>
      )}

      {/* Success Message */}
      {success && (
        <p id={`${textareaId}-success`} className={styles.successText}>
          {success}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p id={`${textareaId}-error`} className={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Export both components
export default Input;
export { Textarea };