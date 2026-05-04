import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiAlertCircle } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const TIME_SLOTS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

const Timetable = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetch(`${API}/timetable`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json())
      .then(d => {
        if (d.success) setEntries(d.data);
        else setError(d.message || 'Could not load timetable');
      })
      .catch(() => setError('Failed to load timetable'))
      .finally(() => setLoading(false));
  }, []);

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)' };

  const courseColors = {};
  const palette = ['#2563eb','#7c3aed','#db2777','#ea580c','#059669','#b45309','#0891b2','#4f46e5'];
  let colorIdx = 0;
  entries.forEach(e => {
    if (!courseColors[e.course_code]) {
      courseColors[e.course_code] = palette[colorIdx % palette.length];
      colorIdx++;
    }
  });

  const getEntry = (day, timeSlot) => {
    return entries.find(e => {
      const start = e.start_time?.substring(0,5);
      const end   = e.end_time?.substring(0,5);
      const slotEnd = TIME_SLOTS[TIME_SLOTS.indexOf(timeSlot)+1] || '18:00';
      return e.day_of_week === day && start <= timeSlot && end > timeSlot;
    });
  };

  const isStartOfEntry = (day, timeSlot, entry) => {
    return entry && entry.start_time?.substring(0,5) === timeSlot;
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading timetable...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1400px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiCalendar style={{color:colors.primary}}/> Class Timetable
        </h1>
        <p style={{color:colors.light, marginBottom:'8px'}}>
          Weekly schedule — {user.branch || user.department} {user.batch ? `Batch ${user.batch}` : ''}
        </p>

        {error && (
          <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'14px 18px', background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:'12px', marginBottom:'20px', color:'#92400e'}}>
            <FiAlertCircle/> {error}. Please contact your admin to set up your timetable.
          </div>
        )}

        {entries.length === 0 && !error ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
            <FiCalendar size={48} style={{opacity:0.3, marginBottom:'16px', color:colors.primary}}/>
            <h3 style={{color:colors.text, marginBottom:'8px'}}>No Timetable Yet</h3>
            <p style={{color:colors.light}}>Your timetable hasn't been set up yet. Contact your admin or wait for courses to be assigned.</p>
          </div>
        ) : (
          <>
            {/* Timetable Grid */}
            <div style={{background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`, overflow:'auto', boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
              <table style={{width:'100%', borderCollapse:'collapse', minWidth:'900px'}}>
                <thead>
                  <tr>
                    <th style={{padding:'14px 16px', background:colors.lightBg, borderBottom:`1px solid ${colors.border}`, borderRight:`1px solid ${colors.border}`, fontSize:'13px', fontWeight:'600', color:colors.text, width:'90px'}}>Time</th>
                    {DAYS.map(day => (
                      <th key={day} style={{padding:'14px 16px', background:colors.lightBg, borderBottom:`1px solid ${colors.border}`, borderRight:`1px solid ${colors.border}`, fontSize:'13px', fontWeight:'600', color:colors.text, textAlign:'center'}}>
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(slot => (
                    <tr key={slot}>
                      <td style={{padding:'10px 14px', borderBottom:`1px solid ${colors.border}`, borderRight:`1px solid ${colors.border}`, fontSize:'12px', color:colors.light, fontWeight:'500', background:colors.lightBg, whiteSpace:'nowrap'}}>
                        <FiClock size={11} style={{marginRight:'4px'}}/>{slot}
                      </td>
                      {DAYS.map(day => {
                        const entry = getEntry(day, slot);
                        if (!entry) return (
                          <td key={day} style={{padding:'8px', borderBottom:`1px solid ${colors.border}`, borderRight:`1px solid ${colors.border}`, height:'64px'}}/>
                        );
                        const color = courseColors[entry.course_code] || colors.primary;
                        const isStart = isStartOfEntry(day, slot, entry);
                        if (!isStart) return null; // handled by rowspan
                        return (
                          <td key={day} style={{padding:'6px', borderBottom:`1px solid ${colors.border}`, borderRight:`1px solid ${colors.border}`, height:'64px', verticalAlign:'top'}}>
                            <div style={{background:`${color}15`, border:`1px solid ${color}40`, borderLeft:`3px solid ${color}`, borderRadius:'8px', padding:'6px 8px', height:'100%', cursor:'default'}}>
                              <div style={{fontSize:'12px', fontWeight:'700', color:color}}>{entry.course_code}</div>
                              <div style={{fontSize:'11px', color:colors.text, fontWeight:'500', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{entry.course_name}</div>
                              <div style={{fontSize:'10px', color:colors.light, display:'flex', alignItems:'center', gap:'2px', marginTop:'2px'}}>
                                <FiMapPin size={9}/>{entry.room}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div style={{marginTop:'20px', background:colors.card, borderRadius:'16px', padding:'18px 24px', border:`1px solid ${colors.border}`, display:'flex', flexWrap:'wrap', gap:'16px'}}>
              {Object.entries(courseColors).map(([code, color]) => {
                const entry = entries.find(e=>e.course_code===code);
                return (
                  <div key={code} style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <div style={{width:'14px', height:'14px', borderRadius:'4px', background:color}}/>
                    <span style={{fontSize:'13px', color:colors.text}}>{code} — {entry?.course_name}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Timetable;
