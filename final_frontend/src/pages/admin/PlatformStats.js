import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, FiUsers, FiBookOpen, FiClipboard,
  FiCalendar, FiClock, FiDownload, FiFilter,
  FiBarChart2, FiPieChart, FiActivity
} from 'react-icons/fi';

const PlatformStats = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [stats, setStats] = useState({
    users: {},
    courses: {},
    assignments: {},
    activity: []
  });

  useEffect(() => {
    loadStats();
  }, [timeframe]);

  const loadStats = async () => {
    try {
      // Mock data
      setStats({
        users: {
          total: 1338,
          students: 1250,
          faculty: 85,
          admin: 3,
          active: 892,
          newThisMonth: 45,
          growth: 12.5
        },
        courses: {
          total: 42,
          active: 38,
          completed: 4,
          byDepartment: {
            CSE: 28,
            ECE: 8,
            ME: 4,
            CE: 2
          }
        },
        assignments: {
          total: 156,
          submitted: 234,
          pending: 89,
          graded: 145,
          averageScore: 78.5
        },
        activity: [
          { date: 'Mon', logins: 450, submissions: 120 },
          { date: 'Tue', logins: 520, submissions: 145 },
          { date: 'Wed', logins: 610, submissions: 180 },
          { date: 'Thu', logins: 580, submissions: 165 },
          { date: 'Fri', logins: 490, submissions: 135 },
          { date: 'Sat', logins: 210, submissions: 45 },
          { date: 'Sun', logins: 180, submissions: 30 }
        ],
        topCourses: [
          { name: 'Data Structures', students: 45, completion: 75 },
          { name: 'DBMS', students: 38, completion: 68 },
          { name: 'Computer Networks', students: 42, completion: 62 },
          { name: 'Operating Systems', students: 36, completion: 71 }
        ]
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Clean Blue Palette
  const colors = {
    primary: 'var(--accent-primary)',
    secondary: '#3b82f6',
    softBlue: '#60a5fa',
    lightBlue: '#93c5fd',
    background: 'var(--bg-primary)',
    cardBg: 'var(--bg-secondary)',
    text: 'var(--text-primary)',
    textLight: 'var(--text-secondary)',
    border: 'var(--border-color)',
    lightBg: 'var(--bg-tertiary)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

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
    timeframeSelector: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px'
    },
    timeframeBtn: {
      padding: '8px 20px',
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '30px',
      fontSize: '13px',
      color: colors.textLight,
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    activeTimeframe: {
      background: colors.primary,
      color: 'white',
      borderColor: colors.primary
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '32px'
    },
    statCard: {
      background: colors.cardBg,
      padding: '20px',
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px'
    },
    statInfo: {
      flex: 1
    },
    statValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: colors.text,
      marginBottom: '4px'
    },
    statLabel: {
      color: colors.textLight,
      fontSize: '14px'
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      marginBottom: '32px'
    },
    chartCard: {
      background: colors.cardBg,
      borderRadius: '24px',
      padding: '24px',
      border: `1px solid ${colors.border}`
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    chartTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: colors.text,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    activityChart: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: '200px',
      marginTop: '20px'
    },
    barGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '12%'
    },
    barContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px'
    },
    bar: {
      width: '30px',
      background: colors.primary,
      borderRadius: '6px 6px 0 0',
      transition: 'height 0.3s'
    },
    barLabel: {
      fontSize: '11px',
      color: colors.textLight,
      marginTop: '8px'
    },
    progressList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    progressItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
      color: colors.textLight
    },
    progressBar: {
      height: '8px',
      background: colors.border,
      borderRadius: '12px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: colors.primary,
      borderRadius: '12px'
    },
    tableCard: {
      background: colors.cardBg,
      borderRadius: '24px',
      padding: '24px',
      border: `1px solid ${colors.border}`,
      marginBottom: '24px'
    },
    table: {
      width: '100%',
      marginTop: '16px'
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      padding: '12px 0',
      borderBottom: `1px solid ${colors.border}`,
      fontSize: '14px'
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      padding: '12px 0',
      borderBottom: `1px solid ${colors.border}`,
      fontWeight: '600',
      color: colors.text,
      fontSize: '13px'
    },
    exportBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      background: colors.lightBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '10px',
      fontSize: '13px',
      color: colors.primary,
      cursor: 'pointer',
      marginLeft: 'auto'
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div>Loading statistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            <FiTrendingUp style={{ color: colors.primary }} />
            Platform Statistics
          </h1>
          <p style={styles.subtitle}>Analytics and insights for the entire platform</p>
        </div>

        {/* Timeframe Selector */}
        <div style={styles.timeframeSelector}>
          {['week', 'month', 'semester', 'year'].map(t => (
            <button
              key={t}
              style={{
                ...styles.timeframeBtn,
                ...(timeframe === t ? styles.activeTimeframe : {})
              }}
              onClick={() => setTimeframe(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <button style={styles.exportBtn}>
            <FiDownload /> Export Report
          </button>
        </div>

        {/* Key Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#dbeafe', color: colors.primary}}>
              <FiUsers />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.users.total}</div>
              <div style={styles.statLabel}>Total Users</div>
              <div style={{ fontSize: '11px', color: colors.success }}>+{stats.users.growth}%</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#d1fae5', color: colors.success}}>
              <FiActivity />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.users.active}</div>
              <div style={styles.statLabel}>Active Today</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#dbeafe', color: colors.secondary}}>
              <FiBookOpen />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.courses.total}</div>
              <div style={styles.statLabel}>Total Courses</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#fef3c7', color: colors.warning}}>
              <FiClipboard />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.assignments.total}</div>
              <div style={styles.statLabel}>Assignments</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={styles.chartsGrid}>
          {/* User Activity Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>
                <FiBarChart2 color={colors.primary} />
                User Activity (Last 7 Days)
              </h3>
            </div>
            <div style={styles.activityChart}>
              {stats.activity.map((day, index) => (
                <div key={index} style={styles.barGroup}>
                  <div style={styles.barContainer}>
                    <div 
                      style={{
                        ...styles.bar,
                        height: `${(day.logins / 700) * 150}px`,
                        background: colors.primary
                      }}
                    />
                    <div 
                      style={{
                        ...styles.bar,
                        height: `${(day.submissions / 200) * 150}px`,
                        background: colors.secondary
                      }}
                    />
                  </div>
                  <span style={styles.barLabel}>{day.date}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: colors.primary, borderRadius: '3px' }} />
                <span style={{ fontSize: '12px', color: colors.textLight }}>Logins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: colors.secondary, borderRadius: '3px' }} />
                <span style={{ fontSize: '12px', color: colors.textLight }}>Submissions</span>
              </div>
            </div>
          </div>

          {/* Course Distribution */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>
                <FiPieChart color={colors.primary} />
                Courses by Department
              </h3>
            </div>
            <div style={styles.progressList}>
              {Object.entries(stats.courses.byDepartment).map(([dept, count]) => (
                <div key={dept} style={styles.progressItem}>
                  <div style={styles.progressHeader}>
                    <span>{dept}</span>
                    <span>{count} courses</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${(count / stats.courses.total) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Courses */}
        <div style={styles.tableCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>
              <FiBookOpen color={colors.primary} />
              Top Performing Courses
            </h3>
          </div>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Course Name</span>
              <span>Students</span>
              <span>Completion Rate</span>
            </div>
            {stats.topCourses.map((course, index) => (
              <div key={index} style={styles.tableRow}>
                <span style={{ fontWeight: '500' }}>{course.name}</span>
                <span>{course.students}</span>
                <span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '6px', background: colors.border, borderRadius: '3px' }}>
                      <div 
                        style={{
                          width: `${course.completion}%`,
                          height: '100%',
                          background: colors.primary,
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                    <span>{course.completion}%</span>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>
                <FiUsers color={colors.primary} />
                User Breakdown
              </h3>
            </div>
            <div style={styles.progressList}>
              <div style={styles.progressItem}>
                <div style={styles.progressHeader}>
                  <span>Students</span>
                  <span>{stats.users.students}</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: '93%'}} />
                </div>
              </div>
              <div style={styles.progressItem}>
                <div style={styles.progressHeader}>
                  <span>Faculty</span>
                  <span>{stats.users.faculty}</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: '6%'}} />
                </div>
              </div>
              <div style={styles.progressItem}>
                <div style={styles.progressHeader}>
                  <span>Admin</span>
                  <span>{stats.users.admin}</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: '1%'}} />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>
                <FiClipboard color={colors.primary} />
                Assignment Stats
              </h3>
            </div>
            <div style={styles.progressList}>
              <div style={styles.progressItem}>
                <div style={styles.progressHeader}>
                  <span>Submitted</span>
                  <span>{stats.assignments.submitted}</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: '60%'}} />
                </div>
              </div>
              <div style={styles.progressItem}>
                <div style={styles.progressHeader}>
                  <span>Pending Grading</span>
                  <span>{stats.assignments.pending}</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: '23%', background: colors.warning}} />
                </div>
              </div>
              <div style={styles.progressItem}>
                <div style={styles.progressHeader}>
                  <span>Graded</span>
                  <span>{stats.assignments.graded}</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: '37%', background: colors.success}} />
                </div>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: colors.primary }}>
                  {stats.assignments.averageScore}%
                </span>
                <span style={{ fontSize: '13px', color: colors.textLight, marginLeft: '8px' }}>
                  Average Score
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;