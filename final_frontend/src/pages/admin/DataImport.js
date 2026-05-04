import React, { useState, useEffect } from 'react';
import {
  FiUpload, FiUsers, FiBookOpen, FiUserCheck,
  FiDownload, FiCheckCircle, FiAlertCircle, FiInfo,
  FiRefreshCw, FiDatabase
} from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const DataImport = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [bulkForm, setBulkForm] = useState({ batch: '', department: '', course_ids: [] });
  const [courses, setCourses] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchStats(); fetchCourses(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/import/stats`, { headers });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API}/courses`, { headers });
      const data = await res.json();
      if (data.success) setCourses(data.data);
    } catch (e) { console.error(e); }
  };

  const handleUpload = async (type) => {
    const input = document.getElementById(`csv-${type}`);
    const file = input?.files?.[0];
    if (!file) return alert('Please select a CSV file first');

    setUploading(true);
    setResult(null);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch(`${API}/import/${type}`, { method: 'POST', headers, body: form });
      const data = await res.json();
      setResult(data);
      fetchStats();
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setUploading(false);
      input.value = '';
    }
  };

  const handleBulkEnroll = async () => {
    if (!bulkForm.batch || !bulkForm.department || !bulkForm.course_ids.length)
      return alert('Please fill all fields and select at least one course');

    setUploading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/import/bulk-enroll`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkForm)
      });
      const data = await res.json();
      setResult(data);
      fetchStats();
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setUploading(false);
    }
  };

  const toggleCourse = (id) => {
    setBulkForm(prev => ({
      ...prev,
      course_ids: prev.course_ids.includes(id)
        ? prev.course_ids.filter(c => c !== id)
        : [...prev.course_ids, id]
    }));
  };

  const downloadTemplate = (type) => {
    const templates = {
      students: 'name,email,enrollment_id,department,batch,password\nArjun Kumar,arjun@uni.edu,2023CS001,CSE,2023,\n',
      faculty: 'name,email,department,designation,password\nProf. Example,prof@uni.edu,CSE,Professor,\n',
      courses: 'code,name,description,credits,department,semester,schedule,room,faculty_email\nCS201,Data Structures,Description,4,CSE,Spring 2024,Mon/Wed 09:00,ELT-1,prof@uni.edu\n',
      enrollments: 'enrollment_id,course_code\n2023CS001,CS201\n2023CS001,CS301\n'
    };
    const blob = new Blob([templates[type]], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${type}_template.csv`; a.click();
  };

  const colors = {
    primary: 'var(--accent-primary)', bg: 'var(--bg-primary)', card: 'var(--bg-secondary)',
    text: 'var(--text-primary)', light: 'var(--text-secondary)', border: 'var(--border-color)', lightBg: 'var(--bg-tertiary)',
    success: '#10b981', error: '#ef4444', warning: '#f59e0b'
  };

  const tabs = [
    { id: 'students',    label: 'Import Students',    icon: <FiUsers /> },
    { id: 'faculty',     label: 'Import Faculty',     icon: <FiUserCheck /> },
    { id: 'courses',     label: 'Import Courses',     icon: <FiBookOpen /> },
    { id: 'enrollments', label: 'Import Enrollments', icon: <FiDatabase /> },
    { id: 'bulk',        label: 'Bulk Enroll',        icon: <FiRefreshCw /> },
  ];

  const s = {
    page: { backgroundColor: colors.bg, minHeight: '100vh', padding: '32px' },
    container: { maxWidth: '1100px', margin: '0 auto' },
    title: { fontSize: '28px', fontWeight: '600', color: colors.text, marginBottom: '6px' },
    sub: { color: colors.light, fontSize: '15px', marginBottom: '32px' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '32px' },
    statCard: { background: colors.card, borderRadius: '16px', padding: '20px', border: `1px solid ${colors.border}`, textAlign: 'center' },
    statVal: { fontSize: '32px', fontWeight: '700', color: colors.primary },
    statLbl: { fontSize: '13px', color: colors.light, marginTop: '4px' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    tab: { padding: '10px 20px', border: `1px solid ${colors.border}`, borderRadius: '30px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: colors.card, color: colors.light, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' },
    activeTab: { background: colors.primary, color: 'white', borderColor: colors.primary },
    card: { background: colors.card, borderRadius: '20px', padding: '28px', border: `1px solid ${colors.border}` },
    cardTitle: { fontSize: '18px', fontWeight: '600', color: colors.text, marginBottom: '8px' },
    cardSub: { color: colors.light, fontSize: '14px', marginBottom: '24px' },
    uploadBox: { border: `2px dashed ${colors.border}`, borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '20px' },
    fileInput: { display: 'none' },
    uploadLabel: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: colors.lightBg, border: `1px solid ${colors.border}`, borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: colors.text },
    btnRow: { display: 'flex', gap: '12px', alignItems: 'center' },
    btn: { padding: '12px 24px', background: colors.primary, color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    outlineBtn: { padding: '12px 24px', background: 'transparent', color: colors.primary, border: `1px solid ${colors.primary}`, borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    resultBox: { marginTop: '20px', padding: '16px', borderRadius: '12px' },
    successBox: { background: '#f0fdf4', border: '1px solid #bbf7d0' },
    errorBox: { background: '#fef2f2', border: '1px solid #fecaca' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' },
    input: { width: '100%', padding: '12px 16px', border: `1px solid ${colors.border}`, borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' },
    courseGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '20px' },
    courseChip: { padding: '10px 16px', borderRadius: '10px', border: `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s' },
    note: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px 18px', fontSize: '13px', color: '#1d4ed8', display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '20px' }
  };

  const userStats = stats?.users || [];
  const studentCount = userStats.find(u => u.role === 'student')?.count || 0;
  const facultyCount = userStats.find(u => u.role === 'faculty')?.count || 0;

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.title}>Data Import & Management</h1>
        <p style={s.sub}>Import students, faculty, courses and manage enrollments</p>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { val: studentCount,              lbl: 'Total Students' },
            { val: facultyCount,              lbl: 'Total Faculty' },
            { val: stats?.totalCourses || 0,  lbl: 'Total Courses' },
            { val: stats?.totalEnrollments||0,lbl: 'Enrollments' }
          ].map((s2, i) => (
            <div key={i} style={s.statCard}>
              <div style={s.statVal}>{s2.val}</div>
              <div style={s.statLbl}>{s2.lbl}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          {tabs.map(t => (
            <button key={t.id} style={{ ...s.tab, ...(activeTab === t.id ? s.activeTab : {}) }}
              onClick={() => { setActiveTab(t.id); setResult(null); }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* CSV Import Panels */}
        {['students', 'faculty', 'courses', 'enrollments'].includes(activeTab) && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>
              {activeTab === 'students'    && 'Import Students from CSV'}
              {activeTab === 'faculty'     && 'Import Faculty from CSV'}
              {activeTab === 'courses'     && 'Import Courses from CSV'}
              {activeTab === 'enrollments' && 'Import Enrollments from CSV'}
            </h2>
            <p style={s.cardSub}>
              Upload a CSV file with the required columns. Download the template below to get started.
            </p>

            <div style={s.note}>
              <FiInfo size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                {activeTab === 'students'    && <><strong>Required columns:</strong> name, email, enrollment_id, department, batch | <strong>Password</strong> defaults to enrollment_id if left empty</>}
                {activeTab === 'faculty'     && <><strong>Required columns:</strong> name, email, department, designation | <strong>Password</strong> defaults to Faculty@123 if left empty</>}
                {activeTab === 'courses'     && <><strong>Required columns:</strong> code, name, credits, department, semester | faculty_email must match an existing faculty account</>}
                {activeTab === 'enrollments' && <><strong>Required columns:</strong> enrollment_id, course_code | Both must already exist in the system</>}
              </div>
            </div>

            <div style={s.uploadBox}>
              <FiUpload size={32} style={{ color: colors.primary, marginBottom: '12px' }} />
              <div style={{ fontSize: '15px', color: colors.text, marginBottom: '8px' }}>Click to select CSV file</div>
              <div style={{ fontSize: '13px', color: colors.light, marginBottom: '16px' }}>Max 5MB</div>
              <input type="file" accept=".csv" id={`csv-${activeTab}`} style={s.fileInput}
                onChange={(e) => {
                  const name = e.target.files?.[0]?.name;
                  if (name) document.getElementById(`csv-label-${activeTab}`).textContent = name;
                }} />
              <label htmlFor={`csv-${activeTab}`} style={s.uploadLabel} id={`csv-label-${activeTab}`}>
                <FiUpload /> Choose CSV File
              </label>
            </div>

            <div style={s.btnRow}>
              <button style={s.btn} disabled={uploading} onClick={() => handleUpload(activeTab)}>
                <FiUpload /> {uploading ? 'Importing...' : 'Import Now'}
              </button>
              <button style={s.outlineBtn} onClick={() => downloadTemplate(activeTab)}>
                <FiDownload /> Download Template
              </button>
            </div>

            {result && (
              <div style={{ ...s.resultBox, ...(result.success ? s.successBox : s.errorBox) }}>
                {result.success ? <FiCheckCircle color={colors.success} /> : <FiAlertCircle color={colors.error} />}
                <strong style={{ marginLeft: '8px' }}>{result.message}</strong>
                {result.data && (
                  <div style={{ marginTop: '10px', fontSize: '14px' }}>
                    ✅ Created: <strong>{result.data.created}</strong> &nbsp;
                    ⏭ Skipped: <strong>{result.data.skipped}</strong>
                    {result.data.errors?.length > 0 && (
                      <ul style={{ marginTop: '8px', color: colors.error }}>
                        {result.data.errors.map((e, i) => <li key={i}>{e}</li>)}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bulk Enroll Panel */}
        {activeTab === 'bulk' && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Bulk Enroll Students</h2>
            <p style={s.cardSub}>Enroll all students of a specific batch and branch into selected courses at once.</p>

            <div style={s.note}>
              <FiInfo size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>All active students matching the batch and department will be enrolled in the selected courses.</span>
            </div>

            <label style={s.label}>Batch (e.g. 2023)</label>
            <input style={s.input} placeholder="2023" value={bulkForm.batch}
              onChange={e => setBulkForm(p => ({ ...p, batch: e.target.value }))} />

            <label style={s.label}>Department (e.g. CSE)</label>
            <input style={s.input} placeholder="CSE" value={bulkForm.department}
              onChange={e => setBulkForm(p => ({ ...p, department: e.target.value }))} />

            <label style={s.label}>Select Courses to Enroll Into</label>
            <div style={s.courseGrid}>
              {courses.map(c => (
                <div key={c.id}
                  style={{ ...s.courseChip, background: bulkForm.course_ids.includes(c.id) ? '#dbeafe' : colors.lightBg, borderColor: bulkForm.course_ids.includes(c.id) ? colors.primary : colors.border, color: bulkForm.course_ids.includes(c.id) ? colors.primary : colors.text }}
                  onClick={() => toggleCourse(c.id)}>
                  <strong>{c.code}</strong> — {c.name}
                </div>
              ))}
            </div>

            <button style={s.btn} disabled={uploading} onClick={handleBulkEnroll}>
              <FiRefreshCw /> {uploading ? 'Enrolling...' : 'Bulk Enroll Now'}
            </button>

            {result && (
              <div style={{ ...s.resultBox, ...(result.success ? s.successBox : s.errorBox) }}>
                {result.success ? <FiCheckCircle color={colors.success} /> : <FiAlertCircle color={colors.error} />}
                <strong style={{ marginLeft: '8px' }}>{result.message}</strong>
                {result.data && (
                  <div style={{ marginTop: '8px', fontSize: '14px' }}>
                    👥 Students found: <strong>{result.data.students}</strong> &nbsp;
                    ✅ Enrolled: <strong>{result.data.enrolled}</strong> &nbsp;
                    ⏭ Already enrolled: <strong>{result.data.skipped}</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Batches info */}
        {stats?.batches?.length > 0 && (
          <div style={{ ...s.card, marginTop: '24px' }}>
            <h2 style={s.cardTitle}>Existing Batches</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
              {stats.batches.map((b, i) => (
                <span key={i} style={{ padding: '6px 16px', background: '#dbeafe', color: colors.primary, borderRadius: '30px', fontSize: '13px', fontWeight: '600' }}>
                  {b.batch} — {b.department}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataImport;
