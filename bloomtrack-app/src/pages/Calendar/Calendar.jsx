import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useCalendar } from '../../context/CalendarContext';
import Button from '../../components/common/Button';
import styles from './Calendar.module.css';

function Calendar() {
  const { user, pregnancyData } = useApp();
  const { 
    view,
    getCalendarDays,
    navigateMonth,
    goToToday,
    setSelectedDate,
    getMoodForDate,
    getEventsForDate,
    setQuickMood,
    addAppointment,
    moodStats,
    MOOD_OPTIONS,
    ENERGY_LEVELS,
    COMMON_SYMPTOMS
  } = useCalendar();

  const [activeTab, setActiveTab] = useState('calendar');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState('okay');
  const [selectedEnergy, setSelectedEnergy] = useState('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [moodNotes, setMoodNotes] = useState('');
  
  // Appointment form state
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('checkup');
  const [appointmentLocation, setAppointmentLocation] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const calendarDays = getCalendarDays();
  const selectedDateData = getMoodForDate(view.selectedDate);
  const selectedDateEvents = getEventsForDate(view.selectedDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const appointmentTypes = {
    checkup: { label: 'Regular Checkup', icon: '🩺' },
    ultrasound: { label: 'Ultrasound', icon: '👶' },
    specialist: { label: 'Specialist Visit', icon: '👨‍⚕️' },
    class: { label: 'Class/Workshop', icon: '📚' },
    test: { label: 'Lab Test', icon: '🧪' },
    other: { label: 'Other', icon: '📅' }
  };

  const handleDayClick = (day) => {
    setSelectedDate(day.dateStr);
  };

  const handleMoodSubmit = () => {
    setQuickMood(selectedMood, selectedEnergy, selectedSymptoms, moodNotes);
    
    // Reset form
    setSelectedMood('okay');
    setSelectedEnergy('medium');
    setSelectedSymptoms([]);
    setMoodNotes('');
    setShowMoodModal(false);
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAppointmentSubmit = () => {
    if (!appointmentTitle.trim() || !appointmentDate || !appointmentTime) {
      alert('Please fill in all required fields.');
      return;
    }

    addAppointment({
      title: appointmentTitle,
      date: appointmentDate,
      time: appointmentTime,
      type: appointmentType,
      location: appointmentLocation,
      notes: appointmentNotes,
      week: pregnancyData.currentWeek
    });

    // Reset form
    setAppointmentTitle('');
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentType('checkup');
    setAppointmentLocation('');
    setAppointmentNotes('');
    setShowAppointmentModal(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className={styles.calendarPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.pageTitle}>📅 Your Calendar</h1>
          <p className={styles.pageSubtitle}>
            Track your mood, appointments, and pregnancy journey, {user.name || 'Beautiful'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsOverview}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{moodStats.currentStreak}</span>
            <span className={styles.statLabel}>Day Streak</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{selectedDateEvents.appointments.length}</span>
            <span className={styles.statLabel}>Appointments</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>Week {pregnancyData.currentWeek}</span>
            <span className={styles.statLabel}>Pregnancy</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'calendar' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'mood' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('mood')}
        >
          💭 Mood Tracking
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'appointments' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          🩺 Appointments
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        
        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className={styles.calendarSection}>
            
            {/* Calendar Header */}
            <div className={styles.calendarHeader}>
              <div className={styles.monthNavigation}>
                <button 
                  className={styles.navButton}
                  onClick={() => navigateMonth(-1)}
                >
                  ‹
                </button>
                <h2 className={styles.monthTitle}>
                  {monthNames[view.currentMonth]} {view.currentYear}
                </h2>
                <button 
                  className={styles.navButton}
                  onClick={() => navigateMonth(1)}
                >
                  ›
                </button>
              </div>
              
              <div className={styles.calendarActions}>
                <Button variant="secondary" size="small" onClick={goToToday}>
                  Today
                </Button>
                <Button 
                  variant="primary" 
                  size="small" 
                  onClick={() => setShowMoodModal(true)}
                >
                  Track Mood
                </Button>
                <Button 
                  variant="gentle" 
                  size="small" 
                  onClick={() => setShowAppointmentModal(true)}
                >
                  Add Appointment
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className={styles.calendarContainer}>
              
              {/* Week Days Header */}
              <div className={styles.weekDaysHeader}>
                {weekDays.map(day => (
                  <div key={day} className={styles.weekDay}>{day}</div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className={styles.calendarGrid}>
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`${styles.calendarDay} ${
                      day.isCurrentMonth ? styles.currentMonth : styles.otherMonth
                    } ${
                      day.isToday ? styles.today : ''
                    } ${
                      day.isSelected ? styles.selected : ''
                    }`}
                    onClick={() => handleDayClick(day)}
                    style={{
                      backgroundColor: day.moodColor ? `${day.moodColor}20` : undefined
                    }}
                  >
                    <span className={styles.dayNumber}>{day.date.getDate()}</span>
                    
                    {day.mood && (
                      <span className={styles.dayMood}>
                        {MOOD_OPTIONS[day.mood].emoji}
                      </span>
                    )}
                    
                    {day.hasEvents && (
                      <div className={styles.eventDots}>
                        {Array.from({length: Math.min(day.eventCount, 3)}).map((_, i) => (
                          <span key={i} className={styles.eventDot}></span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Date Details */}
            <div className={styles.selectedDatePanel}>
              <h3 className={styles.selectedDateTitle}>
                {formatDate(view.selectedDate)}
              </h3>
              
              <div className={styles.dayDetails}>
                
                {/* Mood for selected date */}
                {selectedDateData ? (
                  <div className={styles.dayMoodDetails}>
                    <h4>Mood & Energy</h4>
                    <div className={styles.moodDisplay}>
                      <span className={styles.moodEmoji}>
                        {MOOD_OPTIONS[selectedDateData.mood].emoji}
                      </span>
                      <div className={styles.moodInfo}>
                        <span className={styles.moodLabel}>
                          {MOOD_OPTIONS[selectedDateData.mood].label}
                        </span>
                        <span className={styles.energyLabel}>
                          {ENERGY_LEVELS[selectedDateData.energy]?.label || 'Medium Energy'}
                        </span>
                      </div>
                    </div>
                    
                    {selectedDateData.symptoms?.length > 0 && (
                      <div className={styles.symptomsList}>
                        <strong>Symptoms:</strong>
                        <div className={styles.symptoms}>
                          {selectedDateData.symptoms.map((symptom, index) => (
                            <span key={index} className={styles.symptomTag}>
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedDateData.notes && (
                      <div className={styles.dayNotes}>
                        <strong>Notes:</strong>
                        <p>{selectedDateData.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.noMoodData}>
                    <p>No mood data for this day</p>
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => setShowMoodModal(true)}
                    >
                      Track Mood
                    </Button>
                  </div>
                )}

                {/* Events for selected date */}
                {selectedDateEvents.appointments.length > 0 && (
                  <div className={styles.dayAppointments}>
                    <h4>Appointments</h4>
                    {selectedDateEvents.appointments.map((apt) => (
                      <div key={apt.id} className={styles.appointmentItem}>
                        <span className={styles.appointmentIcon}>
                          {appointmentTypes[apt.type]?.icon || '📅'}
                        </span>
                        <div className={styles.appointmentInfo}>
                          <span className={styles.appointmentTitle}>{apt.title}</span>
                          <span className={styles.appointmentTime}>{apt.time}</span>
                          {apt.location && (
                            <span className={styles.appointmentLocation}>{apt.location}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mood Tracking Tab */}
        {activeTab === 'mood' && (
          <div className={styles.moodSection}>
            <div className={styles.moodCard}>
              <h3 className={styles.sectionTitle}>How are you feeling today?</h3>
              
              {/* Quick Mood Selection */}
              <div className={styles.quickMoodSelector}>
                {Object.entries(MOOD_OPTIONS).map(([key, mood]) => (
                  <button
                    key={key}
                    className={`${styles.quickMoodButton} ${selectedMood === key ? styles.selectedQuickMood : ''}`}
                    onClick={() => setSelectedMood(key)}
                  >
                    <span className={styles.quickMoodEmoji}>{mood.emoji}</span>
                    <span className={styles.quickMoodLabel}>{mood.label}</span>
                  </button>
                ))}
              </div>

              {/* Energy Level */}
              <div className={styles.energySection}>
                <h4>Energy Level</h4>
                <div className={styles.energySelector}>
                  {Object.entries(ENERGY_LEVELS).map(([key, energy]) => (
                    <button
                      key={key}
                      className={`${styles.energyButton} ${selectedEnergy === key ? styles.selectedEnergy : ''}`}
                      onClick={() => setSelectedEnergy(key)}
                    >
                      <span className={styles.energyEmoji}>{energy.emoji}</span>
                      <span className={styles.energyLabel}>{energy.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div className={styles.symptomsSection}>
                <h4>Any symptoms today? (Optional)</h4>
                <div className={styles.symptomsGrid}>
                  {COMMON_SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      className={`${styles.symptomButton} ${
                        selectedSymptoms.includes(symptom) ? styles.selectedSymptom : ''
                      }`}
                      onClick={() => handleSymptomToggle(symptom)}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className={styles.notesSection}>
                <h4>Additional thoughts (Optional)</h4>
                <textarea
                  className={styles.moodNotesTextarea}
                  placeholder="Anything else about how you're feeling today..."
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  rows="3"
                />
              </div>

              {/* Save Button */}
              <div className={styles.saveMoodSection}>
                <Button 
                  variant="primary" 
                  size="large"
                  onClick={handleMoodSubmit}
                >
                  Save Mood Entry 💕
                </Button>
              </div>
            </div>

            {/* Mood Statistics */}
            <div className={styles.moodStatsCard}>
              <h3 className={styles.sectionTitle}>Your Mood Journey</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{moodStats.currentStreak}</span>
                  <span className={styles.statLabel}>Day streak</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{moodStats.totalEntries}</span>
                  <span className={styles.statLabel}>Total entries</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>
                    {moodStats.mostCommonMood ? MOOD_OPTIONS[moodStats.mostCommonMood].emoji : '😊'}
                  </span>
                  <span className={styles.statLabel}>Most common</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className={styles.appointmentsSection}>
            <div className={styles.appointmentCard}>
              <div className={styles.appointmentHeader}>
                <h3 className={styles.sectionTitle}>Schedule Appointment</h3>
                <p className={styles.sectionSubtitle}>Keep track of your prenatal care visits</p>
              </div>

              {/* Appointment Form */}
              <div className={styles.appointmentForm}>
                
                {/* Title */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Appointment Title *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g., 20-week checkup, ultrasound appointment"
                    value={appointmentTitle}
                    onChange={(e) => setAppointmentTitle(e.target.value)}
                  />
                </div>

                {/* Type */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Type</label>
                  <div className={styles.appointmentTypes}>
                    {Object.entries(appointmentTypes).map(([key, type]) => (
                      <button
                        key={key}
                        className={`${styles.typeButton} ${appointmentType === key ? styles.selectedType : ''}`}
                        onClick={() => setAppointmentType(key)}
                      >
                        <span className={styles.typeIcon}>{type.icon}</span>
                        <span className={styles.typeLabel}>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date and Time */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Date *</label>
                    <input
                      type="date"
                      className={styles.formInput}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time *</label>
                    <input
                      type="time"
                      className={styles.formInput}
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Location (Optional)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g., Dr. Smith's Office, City Hospital"
                    value={appointmentLocation}
                    onChange={(e) => setAppointmentLocation(e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Notes (Optional)</label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Any additional information or reminders..."
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    rows="3"
                  />
                </div>

                {/* Save Button */}
                <div className={styles.saveAppointmentSection}>
                  <Button 
                    variant="primary" 
                    size="large"
                    onClick={handleAppointmentSubmit}
                    disabled={!appointmentTitle.trim() || !appointmentDate || !appointmentTime}
                  >
                    Schedule Appointment 📅
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mood Modal */}
      {showMoodModal && (
        <div className={styles.modalOverlay} onClick={() => setShowMoodModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Track Your Mood</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowMoodModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <p>How are you feeling right now?</p>
              <div className={styles.modalMoodSelector}>
                {Object.entries(MOOD_OPTIONS).map(([key, mood]) => (
                  <button
                    key={key}
                    className={`${styles.modalMoodButton} ${selectedMood === key ? styles.selectedModalMood : ''}`}
                    onClick={() => setSelectedMood(key)}
                  >
                    <span className={styles.modalMoodEmoji}>{mood.emoji}</span>
                    <span className={styles.modalMoodLabel}>{mood.label}</span>
                  </button>
                ))}
              </div>
              <div className={styles.modalActions}>
                <Button variant="secondary" onClick={() => setShowMoodModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleMoodSubmit}>
                  Save Mood
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAppointmentModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add Appointment</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAppointmentModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Appointment Title</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g., 20-week checkup"
                  value={appointmentTitle}
                  onChange={(e) => setAppointmentTitle(e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Time</label>
                  <input
                    type="time"
                    className={styles.formInput}
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleAppointmentSubmit}
                  disabled={!appointmentTitle.trim() || !appointmentDate || !appointmentTime}
                >
                  Add Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;