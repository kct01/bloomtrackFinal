import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Star, Baby, Sparkles } from 'lucide-react';
import Button from '../Button';
import styles from './Modal.module.css';

const Modal = ({
  isOpen = false,
  onClose,
  title = '',
  subtitle = '',
  children,
  variant = 'default',
  size = 'medium',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer = null,
  icon = null,
  className = '',
  zIndex = 1000,
  ...props
}) => {
  
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store current active element
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Build CSS classes
  const modalClasses = [
    styles.modal,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  const backdropClasses = [
    styles.backdrop,
    styles[`backdrop_${variant}`]
  ].filter(Boolean).join(' ');

  const modalContent = (
    <div 
      className={backdropClasses}
      onClick={handleBackdropClick}
      style={{ zIndex }}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={subtitle ? 'modal-subtitle' : undefined}
        tabIndex={-1}
        {...props}
      >
        
        {/* Close Button */}
        {showCloseButton && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}

        {/* Header */}
        {(title || subtitle || icon) && (
          <div className={styles.header}>
            
            {/* Celebration Icons for Special Variants */}
            {variant === 'celebration' && (
              <div className={styles.celebrationIcons}>
                <Sparkles className={styles.sparkle1} size={24} />
                <Heart className={styles.sparkle2} size={20} />
                <Star className={styles.sparkle3} size={18} />
                <Sparkles className={styles.sparkle4} size={22} />
              </div>
            )}

            {/* Header Content */}
            <div className={styles.headerContent}>
              {icon && (
                <div className={styles.headerIcon}>
                  {icon}
                </div>
              )}
              
              <div className={styles.headerText}>
                {title && (
                  <h2 id="modal-title" className={styles.title}>
                    {title}
                  </h2>
                )}
                
                {subtitle && (
                  <p id="modal-subtitle" className={styles.subtitle}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
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
    </div>
  );

  // Render modal in portal
  return createPortal(modalContent, document.body);
};

// Pre-built Modal variants for common use cases

// Confirmation Modal
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'gentle',
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      size="small"
      footer={
        <div className={styles.confirmFooter}>
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      }
      {...props}
    >
      <p className={styles.confirmMessage}>{message}</p>
    </Modal>
  );
};

// Celebration Modal for Milestones
const CelebrationModal = ({
  isOpen,
  onClose,
  milestone,
  onAddPhoto,
  onAddNote,
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="celebration"
      size="large"
      title={`🎉 ${milestone?.title || 'Milestone Achieved'}!`}
      subtitle="Congratulations on reaching this special moment!"
      icon={<Baby size={32} />}
      footer={
        <div className={styles.celebrationFooter}>
          <Button variant="gentle" onClick={onAddPhoto}>
            📸 Add Photo
          </Button>
          <Button variant="gentle" onClick={onAddNote}>
            📝 Add Note
          </Button>
          <Button variant="celebration" onClick={onClose}>
            ✨ Continue Journey
          </Button>
        </div>
      }
      {...props}
    >
      <div className={styles.celebrationContent}>
        {milestone?.icon && (
          <div className={styles.milestoneIcon}>
            {milestone.icon}
          </div>
        )}
        
        <p className={styles.celebrationText}>
          {milestone?.celebrationMessage || 'You\'ve reached an amazing milestone in your pregnancy journey!'}
        </p>
        
        {milestone?.week && (
          <div className={styles.weekBadge}>
            Week {milestone.week}
          </div>
        )}
        
        <div className={styles.encouragement}>
          <Heart className={styles.heartIcon} size={16} />
          <span>You're doing amazingly! Keep celebrating these beautiful moments.</span>
        </div>
      </div>
    </Modal>
  );
};

// Form Modal for Inputs
const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText = 'Save',
  cancelText = 'Cancel',
  isSubmitting = false,
  children,
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="gentle"
      footer={
        <div className={styles.formFooter}>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            {cancelText}
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            form="modal-form"
            isLoading={isSubmitting}
          >
            {submitText}
          </Button>
        </div>
      }
      {...props}
    >
      <form id="modal-form" onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
};

export default Modal;
export { ConfirmModal, CelebrationModal, FormModal };