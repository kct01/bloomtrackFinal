import React, { useState, useRef, useEffect } from 'react';
import styles from './DatePicker.module.css';

function DatePicker({ 
  value = '', 
  onChange, 
  placeholder = 'Select date',
  label = '',
  minDate = '',
  maxDate = '',
  className = '',
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(value);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Update display value when value prop changes
  useEffect(() => {
    console.log('📅 DatePicker: Value prop changed to:', value);
    if (value) {
      const date = new Date(value);
      setDisplayValue(formatDisplayDate(date));
      setSelectedDate(value);
      setCurrentMonth(date);
    } else {
      setDisplayValue('');
      setSelectedDate('');
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatInputDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (date) => {
    const dateStr = formatInputDate(date);
    setSelectedDate(dateStr);
    setDisplayValue(formatDisplayDate(date));
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const dateStr = e.target.value;
    console.log('📅 DatePicker: Input changed to:', dateStr);
    console.log('📅 DatePicker: onChange function is:', typeof onChange);
    setSelectedDate(dateStr);
    if (dateStr) {
      const date = new Date(dateStr);
      setDisplayValue(formatDisplayDate(date));
      setCurrentMonth(date);
    } else {
      setDisplayValue('');
    }
    console.log('📅 DatePicker: Calling onChange with:', dateStr);
    if (typeof onChange === 'function') {
      onChange(dateStr);
    } else {
      console.error('📅 DatePicker: onChange is not a function!');
    }
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    // Generate 6 weeks of days
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const isDateInRange = (date) => {
    if (minDate && date < new Date(minDate)) return false;
    if (maxDate && date > new Date(maxDate)) return false;
    return true;
  };

  const isSelectedDate = (date) => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    return date.toDateString() === selected.toDateString();
  };

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const calendarDays = generateCalendar();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Detect if user is on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`${styles.datePickerContainer} ${className}`} ref={dropdownRef}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.inputWrapper}>
        {/* Clickable date display */}
        <div 
          onClick={() => {
            console.log('📅 Date field clicked, opening date picker');
            if (inputRef.current) {
              inputRef.current.focus();
              inputRef.current.showPicker?.();
            }
          }}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #F4A6CD',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '16px',
            color: '#333',
            transition: 'border-color 0.2s ease',
            minHeight: '48px',
            boxSizing: 'border-box'
          }}
          onMouseOver={(e) => e.target.style.borderColor = '#E91E63'}
          onMouseOut={(e) => e.target.style.borderColor = '#F4A6CD'}
        >
          <span>
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : placeholder}
          </span>
          <span style={{fontSize: '20px', color: '#F4A6CD'}}>📅</span>
        </div>
        
        {/* Hidden native date input */}
        <input
          ref={inputRef}
          type="date"
          value={selectedDate}
          onChange={handleInputChange}
          min={minDate}
          max={maxDate}
          disabled={disabled}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            width: '1px',
            height: '1px',
            overflow: 'hidden'
          }}
        />
        
        {/* Custom display button for desktop - temporarily disabled to use native input */}
        {false && !isMobile && (
          <button
            type="button"
            className={styles.displayButton}
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <span className={styles.displayText}>
              {displayValue || placeholder}
            </span>
            <span className={styles.calendarIcon}>📅</span>
          </button>
        )}
      </div>

      {/* Custom calendar dropdown for desktop - temporarily disabled */}
      {false && !isMobile && isOpen && (
        <div className={styles.calendarDropdown}>
          <div className={styles.calendarHeader}>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => navigateMonth(-1)}
            >
              ◀
            </button>
            <span className={styles.monthYear}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => navigateMonth(1)}
            >
              ▶
            </button>
          </div>
          
          <div className={styles.calendarGrid}>
            <div className={styles.weekHeaders}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={styles.weekHeader}>{day}</div>
              ))}
            </div>
            
            <div className={styles.daysGrid}>
              {calendarDays.map((date, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.dayButton} ${
                    !isCurrentMonth(date) ? styles.otherMonth : ''
                  } ${
                    isSelectedDate(date) ? styles.selected : ''
                  } ${
                    isToday(date) ? styles.today : ''
                  } ${
                    !isDateInRange(date) ? styles.disabled : ''
                  }`}
                  onClick={() => isDateInRange(date) && handleDateSelect(date)}
                  disabled={!isDateInRange(date)}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.calendarFooter}>
            <button
              type="button"
              className={styles.todayButton}
              onClick={() => handleDateSelect(new Date())}
            >
              Today
            </button>
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setSelectedDate('');
                setDisplayValue('');
                onChange('');
                setIsOpen(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;