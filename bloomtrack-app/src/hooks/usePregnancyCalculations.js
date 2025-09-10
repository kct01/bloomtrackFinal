import { useMemo } from 'react';
import { differenceInWeeks, differenceInDays, addWeeks, format } from 'date-fns';

export function usePregnancyCalculations(dueDate, lastMenstrualPeriod) {
  const calculations = useMemo(() => {
    if (!dueDate) {
      return {
        currentWeek: 0,
        currentDay: 0,
        trimester: 1,
        daysUntilDue: 0,
        daysPregnant: 0,
        progressPercentage: 0,
        conceptionDate: null,
        isOverdue: false,
        estimatedDeliveryWindow: null
      };
    }

    const today = new Date();
    const due = new Date(dueDate);
    
    // Calculate conception date (approximately 2 weeks after LMP or 38 weeks before due date)
    const conceptionDate = lastMenstrualPeriod 
      ? addWeeks(new Date(lastMenstrualPeriod), 2)
      : addWeeks(due, -38);

    // Calculate current week and day
    const totalDaysPregnant = differenceInDays(today, conceptionDate);
    const currentWeek = Math.max(0, Math.min(40, Math.floor(totalDaysPregnant / 7)));
    const currentDay = Math.max(0, totalDaysPregnant % 7);

    // Calculate trimester
    const getTrimester = (week) => {
      if (week <= 13) return 1;
      if (week <= 27) return 2;
      return 3;
    };

    // Days until due date
    const daysUntilDue = differenceInDays(due, today);
    const isOverdue = daysUntilDue < 0;

    // Progress percentage
    const progressPercentage = Math.min(100, Math.max(0, (currentWeek / 40) * 100));

    // Estimated delivery window (37-42 weeks)
    const earlyDeliveryDate = addWeeks(conceptionDate, 37);
    const lateDeliveryDate = addWeeks(conceptionDate, 42);

    return {
      currentWeek,
      currentDay,
      trimester: getTrimester(currentWeek),
      daysUntilDue,
      daysPregnant: Math.max(0, totalDaysPregnant),
      progressPercentage,
      conceptionDate,
      isOverdue,
      estimatedDeliveryWindow: {
        early: earlyDeliveryDate,
        late: lateDeliveryDate,
        formatted: `${format(earlyDeliveryDate, 'MMM d')} - ${format(lateDeliveryDate, 'MMM d, yyyy')}`
      }
    };
  }, [dueDate, lastMenstrualPeriod]);

  return calculations;
}

export function calculateDueDateFromLMP(lastMenstrualPeriod) {
  if (!lastMenstrualPeriod) return null;
  
  const lmp = new Date(lastMenstrualPeriod);
  // Naegele's rule: Add 280 days (40 weeks) to LMP
  return addWeeks(lmp, 40);
}

export function calculateLMPFromDueDate(dueDate) {
  if (!dueDate) return null;
  
  const due = new Date(dueDate);
  // Subtract 280 days (40 weeks) from due date
  return addWeeks(due, -40);
}

export function formatPregnancyWeek(week, day) {
  if (week === 0) return 'Not started';
  if (week >= 40) return '40+ weeks';
  
  if (day === 0) {
    return `${week} weeks`;
  } else {
    return `${week} weeks, ${day} day${day > 1 ? 's' : ''}`;
  }
}

export function getPregnancyMilestones(currentWeek) {
  const milestones = [
    { week: 4, title: 'Missed Period', icon: '📅' },
    { week: 6, title: 'First Heartbeat', icon: '💓' },
    { week: 8, title: 'First Prenatal Visit', icon: '🏥' },
    { week: 12, title: 'End of First Trimester', icon: '🌟' },
    { week: 16, title: 'Gender Reveal Possible', icon: '👶' },
    { week: 18, title: 'Anatomy Scan', icon: '🔍' },
    { week: 20, title: 'Halfway Point!', icon: '🎉' },
    { week: 24, title: 'Viability Milestone', icon: '💪' },
    { week: 28, title: 'Third Trimester', icon: '🌈' },
    { week: 32, title: 'Baby Shower Time', icon: '🎈' },
    { week: 36, title: 'Full Term Soon', icon: '📅' },
    { week: 37, title: 'Full Term!', icon: '✨' }
  ];

  return {
    upcoming: milestones.filter(m => m.week > currentWeek).slice(0, 3),
    recent: milestones.filter(m => m.week <= currentWeek).slice(-2),
    all: milestones
  };
}

export function getBabySize(week) {
  const sizes = {
    4: { size: 'Poppy seed', length: '2mm' },
    5: { size: 'Sesame seed', length: '3mm' },
    6: { size: 'Lentil', length: '5mm' },
    7: { size: 'Blueberry', length: '10mm' },
    8: { size: 'Kidney bean', length: '16mm' },
    9: { size: 'Grape', length: '23mm' },
    10: { size: 'Kumquat', length: '31mm' },
    11: { size: 'Fig', length: '41mm' },
    12: { size: 'Lime', length: '54mm' },
    13: { size: 'Pea pod', length: '74mm' },
    14: { size: 'Lemon', length: '87mm' },
    15: { size: 'Apple', length: '10cm' },
    16: { size: 'Avocado', length: '11.5cm' },
    17: { size: 'Turnip', length: '13cm' },
    18: { size: 'Bell pepper', length: '14.2cm' },
    19: { size: 'Tomato', length: '15.3cm' },
    20: { size: 'Banana', length: '16.4cm' },
    21: { size: 'Carrot', length: '26.7cm' },
    22: { size: 'Spaghetti squash', length: '27.8cm' },
    23: { size: 'Large mango', length: '28.9cm' },
    24: { size: 'Corn', length: '30cm' },
    25: { size: 'Rutabaga', length: '34.6cm' },
    26: { size: 'Scallion', length: '35.6cm' },
    27: { size: 'Cauliflower', length: '36.6cm' },
    28: { size: 'Eggplant', length: '37.6cm' },
    29: { size: 'Butternut squash', length: '38.6cm' },
    30: { size: 'Cabbage', length: '39.9cm' },
    31: { size: 'Coconut', length: '41.1cm' },
    32: { size: 'Jicama', length: '42.4cm' },
    33: { size: 'Pineapple', length: '43.7cm' },
    34: { size: 'Cantaloupe', length: '45cm' },
    35: { size: 'Honeydew melon', length: '46.2cm' },
    36: { size: 'Romaine lettuce', length: '47.4cm' },
    37: { size: 'Swiss chard', length: '48.6cm' },
    38: { size: 'Leek', length: '49.8cm' },
    39: { size: 'Mini watermelon', length: '50.7cm' },
    40: { size: 'Small pumpkin', length: '51.2cm' }
  };

  return sizes[week] || { size: 'Growing beautifully!', length: '' };
}

export default usePregnancyCalculations;