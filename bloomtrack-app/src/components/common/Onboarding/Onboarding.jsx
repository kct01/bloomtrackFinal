import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Button from '../Button';
import Input from '../Input';
import Card from '../Card';
import styles from './Onboarding.module.css';

function Onboarding({ onComplete }) {
  const { updateUser, updatePregnancyData } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dueDate: '',
    lastMenstrualPeriod: '',
    babyName: '',
    isFirstTime: true
  });

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateCurrentWeek = (lmpDate) => {
    const lmp = new Date(lmpDate);
    const today = new Date();
    const diffTime = Math.abs(today - lmp);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  };

  const calculateTrimester = (week) => {
    if (week <= 12) return 1;
    if (week <= 27) return 2;
    return 3;
  };

  const handleComplete = () => {
    // Calculate current week and trimester
    const currentWeek = formData.lastMenstrualPeriod ? 
      calculateCurrentWeek(formData.lastMenstrualPeriod) : 1;
    const trimester = calculateTrimester(currentWeek);

    // Update user data
    updateUser({
      name: formData.name,
      email: formData.email,
      isOnboarded: true
    });

    // Update pregnancy data
    updatePregnancyData({
      dueDate: formData.dueDate,
      lastMenstrualPeriod: formData.lastMenstrualPeriod,
      currentWeek: currentWeek,
      trimester: trimester,
      babyName: formData.babyName,
      isFirstTime: formData.isFirstTime
    });

    onComplete?.();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}>🌸</span>
              <h2>Welcome to BloomTrack!</h2>
              <p>Let's get to know you and set up your pregnancy journey.</p>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>What's your name?</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email (optional)</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={styles.input}
              />
              <span className={styles.helper}>We'll use this for appointment reminders</span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}>📅</span>
              <h2>Pregnancy Timeline</h2>
              <p>Help us track your journey with some important dates.</p>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>When was your last menstrual period?</label>
              <Input
                type="date"
                value={formData.lastMenstrualPeriod}
                onChange={(e) => handleInputChange('lastMenstrualPeriod', e.target.value)}
                className={styles.input}
              />
              <span className={styles.helper}>This helps us calculate your current week</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>What's your due date? (if known)</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={styles.input}
              />
              <span className={styles.helper}>We can calculate this if you don't know</span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}>👶</span>
              <h2>About Your Baby</h2>
              <p>Tell us about your little one (all optional).</p>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Baby's name or nickname</label>
              <Input
                type="text"
                placeholder="e.g., Little One, Peanut, etc."
                value={formData.babyName}
                onChange={(e) => handleInputChange('babyName', e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.isFirstTime}
                  onChange={(e) => handleInputChange('isFirstTime', e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkmark}></span>
                This is my first pregnancy
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}>✨</span>
              <h2>You're All Set!</h2>
              <p>Your personalized pregnancy tracking is ready to begin.</p>
            </div>
            
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Name:</span>
                <span className={styles.summaryValue}>{formData.name || 'Beautiful'}</span>
              </div>
              
              {formData.lastMenstrualPeriod && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Current Week:</span>
                  <span className={styles.summaryValue}>
                    Week {calculateCurrentWeek(formData.lastMenstrualPeriod)}
                  </span>
                </div>
              )}
              
              {formData.babyName && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Baby:</span>
                  <span className={styles.summaryValue}>{formData.babyName}</span>
                </div>
              )}
            </div>

            <div className={styles.features}>
              <h3>What you can do with BloomTrack:</h3>
              <div className={styles.featuresList}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📈</span>
                  <span>Track your pregnancy progress</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📝</span>
                  <span>Keep a pregnancy journal</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🎯</span>
                  <span>Celebrate milestones</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📅</span>
                  <span>Schedule appointments</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.onboarding}>
      <div className={styles.container}>
        <Card className={styles.card}>
          {/* Progress Indicator */}
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className={styles.navigation}>
            {currentStep > 1 && (
              <Button 
                variant="secondary" 
                onClick={prevStep}
                className={styles.prevButton}
              >
                Previous
              </Button>
            )}
            
            <div className={styles.spacer}></div>
            
            {currentStep < totalSteps ? (
              <Button 
                variant="primary" 
                onClick={nextStep}
                disabled={currentStep === 1 && !formData.name.trim()}
                className={styles.nextButton}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="celebration" 
                onClick={handleComplete}
                className={styles.completeButton}
              >
                Start My Journey! 🌸
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Onboarding;