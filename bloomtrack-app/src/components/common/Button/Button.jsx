import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  
  // Build CSS classes
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <span className={styles.loadingSpinner}>
          <Loader2 size={16} className={styles.spinner} />
        </span>
      )}
      
      {/* Icon - Left Position */}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className={styles.iconLeft}>
          {icon}
        </span>
      )}
      
      {/* Button Content */}
      <span className={styles.content}>
        {children}
      </span>
      
      {/* Icon - Right Position */}
      {icon && iconPosition === 'right' && !isLoading && (
        <span className={styles.iconRight}>
          {icon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;