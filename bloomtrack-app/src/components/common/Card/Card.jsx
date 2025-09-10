import { forwardRef } from 'react';
import styles from './Card.module.css';

const Card = forwardRef(({
  children,
  variant = 'default',
  size = 'medium',
  header = null,
  footer = null,
  title = null,
  subtitle = null,
  icon = null,
  className = '',
  hoverable = true,
  clickable = false,
  onClick,
  padding = 'normal',
  ...props
}, ref) => {
  
  // Build CSS classes
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[size],
    styles[padding],
    hoverable ? styles.hoverable : '',
    clickable ? styles.clickable : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  const hasHeader = header || title || subtitle || icon;

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {/* Custom Header */}
      {header && (
        <div className={styles.header}>
          {header}
        </div>
      )}

      {/* Auto-generated Header */}
      {hasHeader && !header && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {icon && (
              <div className={styles.headerIcon}>
                {icon}
              </div>
            )}
            <div className={styles.headerText}>
              {title && (
                <h3 className={styles.title}>{title}</h3>
              )}
              {subtitle && (
                <p className={styles.subtitle}>{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;