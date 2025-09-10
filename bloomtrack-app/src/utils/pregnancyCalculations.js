/**
 * Pregnancy Calculation Utilities
 * Handles all pregnancy-related calculations including weeks, trimesters, and due dates
 */

// Standard pregnancy duration in weeks
export const PREGNANCY_DURATION_WEEKS = 40;
export const PREGNANCY_DURATION_DAYS = 280;

// Trimester boundaries
export const TRIMESTER_BOUNDARIES = {
  FIRST: { start: 1, end: 12 },
  SECOND: { start: 13, end: 27 },
  THIRD: { start: 28, end: 40 }
};

/**
 * Calculate current pregnancy week based on last menstrual period (LMP)
 * @param {Date} lmpDate - Last menstrual period date
 * @param {Date} currentDate - Current date (defaults to today)
 * @returns {number} Current pregnancy week (1-40+)
 */
export function calculateCurrentWeek(lmpDate, currentDate = new Date()) {
  if (!lmpDate || !(lmpDate instanceof Date)) {
    throw new Error('Valid LMP date is required');
  }

  const timeDiff = currentDate.getTime() - lmpDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  const weeks = Math.floor(daysDiff / 7) + 1; // +1 because pregnancy starts at week 1

  return Math.max(1, weeks);
}

/**
 * Calculate due date based on last menstrual period
 * @param {Date} lmpDate - Last menstrual period date
 * @returns {Date} Estimated due date
 */
export function calculateDueDate(lmpDate) {
  if (!lmpDate || !(lmpDate instanceof Date)) {
    throw new Error('Valid LMP date is required');
  }

  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + PREGNANCY_DURATION_DAYS);
  return dueDate;
}

/**
 * Calculate days remaining until due date
 * @param {Date} dueDate - Estimated due date
 * @param {Date} currentDate - Current date (defaults to today)
 * @returns {number} Days remaining (can be negative if overdue)
 */
export function calculateDaysRemaining(dueDate, currentDate = new Date()) {
  if (!dueDate || !(dueDate instanceof Date)) {
    throw new Error('Valid due date is required');
  }

  const timeDiff = dueDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Get current trimester based on pregnancy week
 * @param {number} week - Current pregnancy week
 * @returns {number} Trimester number (1, 2, or 3)
 */
export function getCurrentTrimester(week) {
  if (week < 1) return 1;
  if (week <= TRIMESTER_BOUNDARIES.FIRST.end) return 1;
  if (week <= TRIMESTER_BOUNDARIES.SECOND.end) return 2;
  return 3;
}

/**
 * Calculate pregnancy progress as percentage
 * @param {number} currentWeek - Current pregnancy week
 * @returns {number} Pregnancy progress percentage (0-100)
 */
export function calculatePregnancyProgress(currentWeek) {
  const progress = (currentWeek / PREGNANCY_DURATION_WEEKS) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Calculate trimester progress as percentage
 * @param {number} currentWeek - Current pregnancy week
 * @param {number} trimester - Trimester number (1, 2, or 3)
 * @returns {number} Trimester progress percentage (0-100)
 */
export function calculateTrimesterProgress(currentWeek, trimester) {
  let startWeek, endWeek;

  switch (trimester) {
    case 1:
      startWeek = TRIMESTER_BOUNDARIES.FIRST.start;
      endWeek = TRIMESTER_BOUNDARIES.FIRST.end;
      break;
    case 2:
      startWeek = TRIMESTER_BOUNDARIES.SECOND.start;
      endWeek = TRIMESTER_BOUNDARIES.SECOND.end;
      break;
    case 3:
      startWeek = TRIMESTER_BOUNDARIES.THIRD.start;
      endWeek = TRIMESTER_BOUNDARIES.THIRD.end;
      break;
    default:
      return 0;
  }

  // If before trimester starts
  if (currentWeek < startWeek) return 0;
  
  // If after trimester ends
  if (currentWeek > endWeek) return 100;

  // Calculate progress within trimester
  const weeksInTrimester = endWeek - startWeek + 1;
  const weeksPassed = currentWeek - startWeek + 1;
  return (weeksPassed / weeksInTrimester) * 100;
}

/**
 * Get trimester information
 * @param {number} trimester - Trimester number (1, 2, or 3)
 * @returns {Object} Trimester information
 */
export function getTrimesterInfo(trimester) {
  const trimesterData = {
    1: {
      name: 'First Trimester',
      description: 'Foundation & Early Development',
      weeks: `${TRIMESTER_BOUNDARIES.FIRST.start}-${TRIMESTER_BOUNDARIES.FIRST.end}`,
      keyDevelopments: [
        'Major organs begin to form',
        'Heart starts beating',
        'Brain and nervous system develop'
      ],
      commonSymptoms: [
        'Morning sickness',
        'Fatigue',
        'Breast tenderness',
        'Food aversions'
      ],
      color: '#FFB3BA', // Soft pink
      colorDark: '#FF8A95'
    },
    2: {
      name: 'Second Trimester',
      description: 'Growth & Development',
      weeks: `${TRIMESTER_BOUNDARIES.SECOND.start}-${TRIMESTER_BOUNDARIES.SECOND.end}`,
      keyDevelopments: [
        'Rapid growth period',
        'Baby movements felt',
        'Gender can be determined'
      ],
      commonSymptoms: [
        'Increased energy',
        'Growing belly',
        'Baby movements',
        'Skin changes'
      ],
      color: '#BAFFC9', // Soft green
      colorDark: '#90E39F'
    },
    3: {
      name: 'Third Trimester',
      description: 'Final Preparation',
      weeks: `${TRIMESTER_BOUNDARIES.THIRD.start}-${TRIMESTER_BOUNDARIES.THIRD.end}`,
      keyDevelopments: [
        'Rapid weight gain',
        'Lung development',
        'Preparing for birth'
      ],
      commonSymptoms: [
        'Increased fatigue',
        'Braxton Hicks contractions',
        'Shortness of breath',
        'Frequent urination'
      ],
      color: '#BAE1FF', // Soft blue
      colorDark: '#87CEEB'
    }
  };

  return trimesterData[trimester] || null;
}

/**
 * Format pregnancy week display
 * @param {number} week - Pregnancy week
 * @param {number} day - Day within the week (0-6)
 * @returns {string} Formatted week display
 */
export function formatPregnancyWeek(week, day = 0) {
  if (day === 0) {
    return `${week} weeks`;
  }
  return `${week} weeks, ${day} day${day === 1 ? '' : 's'}`;
}

/**
 * Calculate conception date from LMP
 * @param {Date} lmpDate - Last menstrual period date
 * @returns {Date} Estimated conception date
 */
export function calculateConceptionDate(lmpDate) {
  if (!lmpDate || !(lmpDate instanceof Date)) {
    throw new Error('Valid LMP date is required');
  }

  const conceptionDate = new Date(lmpDate);
  conceptionDate.setDate(conceptionDate.getDate() + 14); // Ovulation typically occurs 14 days after LMP
  return conceptionDate;
}

/**
 * Check if pregnancy is considered full-term
 * @param {number} week - Current pregnancy week
 * @returns {boolean} True if full-term (37+ weeks)
 */
export function isFullTerm(week) {
  return week >= 37;
}

/**
 * Check if pregnancy is overdue
 * @param {Date} dueDate - Due date
 * @param {Date} currentDate - Current date (defaults to today)
 * @returns {boolean} True if overdue
 */
export function isOverdue(dueDate, currentDate = new Date()) {
  return calculateDaysRemaining(dueDate, currentDate) < 0;
}

/**
 * Get pregnancy milestone weeks
 * @returns {Object} Object containing important milestone weeks
 */
export function getPregnancyMilestones() {
  return {
    firstTrimesterEnd: 12,
    secondTrimesterEnd: 27,
    viabilityThreshold: 24, // 50% survival rate
    fullTerm: 37,
    dueDate: 40,
    postTerm: 42
  };
}

/**
 * Calculate baby's estimated weight based on pregnancy week
 * @param {number} week - Current pregnancy week
 * @returns {string} Estimated weight with unit
 */
export function estimateBabyWeight(week) {
  // Simplified weight estimation - in real app, use more accurate formulas
  const weightData = {
    8: '0.003 lbs',
    12: '0.03 lbs',
    16: '0.22 lbs',
    20: '0.66 lbs',
    24: '1.3 lbs',
    28: '2.2 lbs',
    32: '3.7 lbs',
    36: '5.7 lbs',
    40: '7.5 lbs'
  };

  // Find closest week with data
  const weeks = Object.keys(weightData).map(Number).sort((a, b) => a - b);
  const closestWeek = weeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );

  return weightData[closestWeek] || 'Calculating...';
}

/**
 * Calculate baby's estimated length based on pregnancy week
 * @param {number} week - Current pregnancy week
 * @returns {string} Estimated length with unit
 */
export function estimateBabyLength(week) {
  // Simplified length estimation in inches
  const lengthData = {
    8: '0.6 in',
    12: '2.1 in',
    16: '4.6 in',
    20: '6.5 in',
    24: '8.3 in',
    28: '10.0 in',
    32: '11.4 in',
    36: '12.7 in',
    40: '14.0 in'
  };

  // Find closest week with data
  const weeks = Object.keys(lengthData).map(Number).sort((a, b) => a - b);
  const closestWeek = weeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );

  return lengthData[closestWeek] || 'Calculating...';
}

/**
 * Validate pregnancy data inputs
 * @param {Date} lmpDate - Last menstrual period date
 * @param {Date} currentDate - Current date
 * @returns {Object} Validation result with isValid and errors
 */
export function validatePregnancyData(lmpDate, currentDate = new Date()) {
  const errors = [];

  if (!lmpDate || !(lmpDate instanceof Date) || isNaN(lmpDate.getTime())) {
    errors.push('Valid LMP date is required');
  }

  if (lmpDate && lmpDate > currentDate) {
    errors.push('LMP date cannot be in the future');
  }

  // Check if pregnancy would be unreasonably long (over 45 weeks)
  if (lmpDate) {
    const currentWeek = calculateCurrentWeek(lmpDate, currentDate);
    if (currentWeek > 45) {
      errors.push('Pregnancy duration seems unreasonable. Please check LMP date');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}