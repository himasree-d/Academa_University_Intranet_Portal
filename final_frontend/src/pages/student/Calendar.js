import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, FiChevronLeft, FiChevronRight, 
  FiClock, FiBookOpen, FiFileText, FiBell,
  FiCheckCircle, FiAlertCircle, FiMapPin
} from 'react-icons/fi';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API}/timetable`, { headers: h })
      .then(r => r.json())
      .then(d => {
        if (d.success) setTimetableEntries(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const colors = {
    primary: 'var(--accent-primary)',
    secondary: '#5e7a6d',
    softBlue: '#94b5a6',
    lightBlue: '#aec7bc',
    background: 'var(--bg-primary)',
    cardBg: 'var(--bg-secondary)',
    text: 'var(--text-primary)',
    textLight: 'var(--text-secondary)',
    border: 'var(--border-color)',
    lightBg: 'var(--bg-tertiary)',
    success: '#7ea191',
    warning: '#d4a373',
    error: '#b07d62',
    info: '#5e7a6d',
    lecture: 'var(--accent-primary)',
    lab: '#5e7a6d'
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayName = (dayIndex) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  };

  const getEventsForDate = (date) => {
    const dayName = getDayName(date.getDay());
    return timetableEntries.filter(entry => entry.day_of_week === dayName).map(entry => ({
      id: entry.id,
      title: entry.course_code,
      course: entry.course_name,
      type: entry.entry_type || 'lecture',
      time: `${entry.start_time.substring(0, 5)} - ${entry.end_time.substring(0, 5)}`,
      room: entry.room
    })).sort((a, b) => a.time.localeCompare(b.time));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.emptyDay}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <div 
          key={day} 
          style={{
            ...styles.dayCell,
            ...(isToday ? styles.todayCell : {}),
            ...(isSelected ? styles.selectedCell : {})
          }}
          onClick={() => setSelectedDate(date)}
        >
          <span style={{
            ...styles.dayNumber,
            ...(isToday ? styles.todayNumber : {}),
            ...(isSelected ? styles.selectedNumber : {})
          }}>{day}</span>
          {dayEvents.length > 0 && (
            <div style={styles.eventIndicators}>
              {dayEvents.slice(0, 3).map((event, idx) => (
                <div 
                  key={idx} 
                  style={{
                    ...styles.eventDot,
                    backgroundColor: event.type === 'lab' ? colors.lab : colors.lecture
                  }}
                  title={event.title}
                />
              ))}
              {dayEvents.length > 3 && (
                <span style={styles.moreEvents}>+{dayEvents.length - 3}</span>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const styles = {
    page: {
      backgroundColor: colors.background,
      minHeight: '100vh'
    },
    container: {
      padding: '32px',
      maxWidth: '1280px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px'
    },
    headerTitle: {
      fontSize: '28px',
      color: colors.text,
      marginBottom: '8px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    subtitle: {
      color: colors.textLight,
      fontSize: '15px'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '2.5fr 1.5fr',
      gap: '24px'
    },
    calendarSection: {
      background: colors.cardBg,
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: `1px solid ${colors.border}`
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    monthTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: colors.text
    },
    monthNav: {
      display: 'flex',
      gap: '8px'
    },
    navButton: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: colors.lightBg,
      border: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: colors.textLight,
      transition: 'all 0.2s'
    },
    weekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      marginBottom: '12px'
    },
    weekDay: {
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: '600',
      color: colors.textLight,
      padding: '8px'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px'
    },
    emptyDay: {
      aspectRatio: '1',
      padding: '8px'
    },
    dayCell: {
      aspectRatio: '1',
      padding: '8px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      border: '2px solid transparent'
    },
    todayCell: {
      background: colors.lightBg
    },
    selectedCell: {
      borderColor: colors.primary,
      background: colors.background
    },
    dayNumber: {
      fontSize: '14px',
      fontWeight: '500',
      color: colors.text,
      marginBottom: '4px'
    },
    todayNumber: {
      color: colors.primary,
      fontWeight: '600'
    },
    selectedNumber: {
      color: colors.primary,
      fontWeight: '600'
    },
    eventIndicators: {
      display: 'flex',
      gap: '3px',
      flexWrap: 'wrap',
      marginTop: '2px'
    },
    eventDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%'
    },
    moreEvents: {
      fontSize: '9px',
      color: colors.textLight,
      marginLeft: '2px'
    },
    eventsSection: {
      background: colors.cardBg,
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: `1px solid ${colors.border}`
    },
    eventsHeader: {
      marginBottom: '20px'
    },
    selectedDateTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '4px'
    },
    selectedDateText: {
      fontSize: '14px',
      color: colors.textLight
    },
    eventsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    eventCard: {
      padding: '16px',
      background: colors.lightBg,
      borderRadius: '16px',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    eventHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    },
    eventIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    eventTitle: {
      flex: 1,
      fontSize: '15px',
      fontWeight: '600',
      color: colors.text
    },
    eventCourse: {
      fontSize: '13px',
      color: colors.textLight,
      marginBottom: '8px',
      marginLeft: '42px'
    },
    eventTime: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: colors.textLight,
      marginLeft: '42px'
    },
    noEvents: {
      textAlign: 'center',
      padding: '40px 20px',
      color: colors.textLight
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            <FiCalendar style={{ color: colors.primary }} />
            Academic Calendar
          </h1>
          <p style={styles.subtitle}>Your dynamic class schedule</p>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.calendarSection}>
            <div style={styles.calendarHeader}>
              <h2 style={styles.monthTitle}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div style={styles.monthNav}>
                <button style={styles.navButton} onClick={prevMonth}><FiChevronLeft /></button>
                <button style={styles.navButton} onClick={nextMonth}><FiChevronRight /></button>
              </div>
            </div>

            <div style={styles.weekDays}>
              {dayNames.map(day => (
                <div key={day} style={styles.weekDay}>{day}</div>
              ))}
            </div>

            <div style={styles.calendarGrid}>
              {loading ? <div style={{gridColumn:'span 7',textAlign:'center',padding:'40px',color:colors.textLight}}>Loading Schedule...</div> : renderCalendar()}
            </div>
          </div>

          <div style={styles.eventsSection}>
            <div style={styles.eventsHeader}>
              <h2 style={styles.selectedDateTitle}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <p style={styles.selectedDateText}>
                {selectedDateEvents.length} class{selectedDateEvents.length !== 1 ? 'es' : ''} scheduled
              </p>
            </div>

            <div style={styles.eventsList}>
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} style={styles.eventCard}>
                    <div style={styles.eventHeader}>
                      <div style={{
                        ...styles.eventIcon,
                        background: `${event.type === 'lab' ? colors.lab : colors.lecture}20`,
                        color: event.type === 'lab' ? colors.lab : colors.lecture
                      }}>
                        {event.type === 'lab' ? <FiMapPin size={14} /> : <FiClock size={14} />}
                      </div>
                      <span style={styles.eventTitle}>{event.title} - {event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                    </div>
                    <div style={styles.eventCourse}>{event.course}</div>
                    <div style={styles.eventTime}>
                      <FiClock size={12} />
                      <span>{event.time} • {event.room}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noEvents}>
                  <FiCalendar size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <p>No classes scheduled for this day</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;