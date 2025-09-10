import { useCalendar as useCalendarContext } from '../context/CalendarContext';
import { useMemo, useState, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

export function useCalendar() {
  // Re-export the context hook for consistency
  return useCalendarContext();
}

export function useCalendarView(currentDate = new Date()) {
  const { events, appointments } = useCalendarContext();

  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });

    return days.map(day => {
      const dayEvents = events.filter(event => 
        isSameDay(new Date(event.date), day)
      );
      
      const dayAppointments = appointments.filter(appointment => 
        isSameDay(new Date(appointment.date), day)
      );

      return {
        date: day,
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday: isToday(day),
        events: dayEvents,
        appointments: dayAppointments,
        hasEvents: dayEvents.length > 0 || dayAppointments.length > 0,
        formattedDate: format(day, 'yyyy-MM-dd'),
        displayDate: format(day, 'd')
      };
    });
  }, [currentDate, events, appointments]);

  return calendarData;
}

export function useMonthNavigation(initialDate = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const goToMonth = useCallback((date) => {
    setCurrentMonth(new Date(date));
  }, []);

  return {
    currentMonth,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    goToMonth,
    monthName: format(currentMonth, 'MMMM yyyy')
  };
}

export function useEventFilters() {
  const { events, appointments } = useCalendarContext();
  const [filters, setFilters] = useState({
    eventTypes: [],
    appointmentTypes: [],
    dateRange: null,
    searchTerm: ''
  });

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (filters.eventTypes.length > 0) {
      filtered = filtered.filter(event => 
        filters.eventTypes.includes(event.type)
      );
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= start && eventDate <= end;
      });
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [events, filters]);

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    if (filters.appointmentTypes.length > 0) {
      filtered = filtered.filter(appointment => 
        filters.appointmentTypes.includes(appointment.type)
      );
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= start && appointmentDate <= end;
      });
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.title.toLowerCase().includes(term) ||
        appointment.location?.toLowerCase().includes(term) ||
        appointment.doctor?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [appointments, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      eventTypes: [],
      appointmentTypes: [],
      dateRange: null,
      searchTerm: ''
    });
  }, []);

  return {
    filters,
    filteredEvents,
    filteredAppointments,
    updateFilters,
    clearFilters
  };
}

export function useMoodStats(timeframe = '30days') {
  const { moodEntries } = useCalendarContext();

  const stats = useMemo(() => {
    let relevantEntries = [...moodEntries];

    // Filter by timeframe
    if (timeframe === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      relevantEntries = relevantEntries.filter(entry => 
        new Date(entry.date) >= sevenDaysAgo
      );
    } else if (timeframe === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      relevantEntries = relevantEntries.filter(entry => 
        new Date(entry.date) >= thirtyDaysAgo
      );
    }

    // Calculate mood distribution
    const moodCounts = relevantEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const total = relevantEntries.length;
    const moodPercentages = Object.keys(moodCounts).reduce((acc, mood) => {
      acc[mood] = Math.round((moodCounts[mood] / total) * 100);
      return acc;
    }, {});

    // Calculate average mood (numeric scale)
    const moodValues = {
      excellent: 5,
      good: 4,
      okay: 3,
      low: 2,
      difficult: 1
    };

    const averageMood = total > 0 
      ? relevantEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / total
      : 0;

    // Find most common symptoms
    const symptomCounts = relevantEntries.reduce((acc, entry) => {
      if (entry.symptoms) {
        entry.symptoms.forEach(symptom => {
          acc[symptom] = (acc[symptom] || 0) + 1;
        });
      }
      return acc;
    }, {});

    const topSymptoms = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, count }));

    return {
      totalEntries: total,
      moodCounts,
      moodPercentages,
      averageMood: Math.round(averageMood * 100) / 100,
      topSymptoms,
      timeframe
    };
  }, [moodEntries, timeframe]);

  return stats;
}

export function useUpcomingEvents(days = 7) {
  const { events, appointments } = useCalendarContext();

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    const upcoming = [
      ...events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= futureDate;
      }).map(event => ({ ...event, type: 'event' })),
      ...appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= now && appointmentDate <= futureDate;
      }).map(appointment => ({ ...appointment, type: 'appointment' }))
    ];

    return upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, appointments, days]);

  return upcomingEvents;
}

export default useCalendar;