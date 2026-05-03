import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiBookOpen, FiClipboard, FiCalendar, FiClock,
  FiUser, FiFileText, FiDownload, FiChevronLeft,
  FiUsers, FiMessageSquare, FiCheckCircle, FiAlertCircle, FiEye
} from 'react-icons/fi';
import PDFModal from '../../components/common/PDFModal';

const API = process.env.NODE_ENV === 'production' ? 'https://academa-mxe9.onrender.com/api' : 'https://academa-mxe9.onrender.com/api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse]         = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials]   = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [viewingPDF, setViewingPDF] = useState(null); // { url, name }
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, aRes, mRes, annRes, sRes] = await Promise.all([
          fetch(`${API}/courses/${id}`, { headers: h }),
          fetch(`${API}/assignments?course_id=${id}`, { headers: h }),
          fetch(`${API}/materials?course_id=${id}`, { headers: h }),
          fetch(`${API}/announcements/course/${id}`, { headers: h }),
          fetch(`${API}/courses/${id}/students`, { headers: h }),
        ]);
        const [c,a,m,ann,s] = await Promise.all([cRes.json(),aRes.json(),mRes.json(),annRes.json(),sRes.json()]);
        if (c.success) setCourse(c.data);
        if (a.success) setAssignments(a.data);
        if (m.success) setMaterials(m.data);
        if (ann.success) setAnnouncements(ann.data);
        if (s.success) setStudents(s.data);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const colors = { primary:'var(--accent-primary)', bg:'var(--bg-primary)', card:'var(--bg-secondary)', text:'var(--text-primary)', light:'var(--text-secondary)', border:'var(--border-color)', lightBg:'var(--bg-tertiary)', success:'#10b981', warning:'#f59e0b', error:'#ef4444' };

  const statusStyle = s => ({ graded:{bg:'#d1fae5',color:'#065f46'}, submitted:{bg:'#dbeafe',color:'#1e40af'}, pending:{bg:'#fef3c7',color:'#92400e'}, late:{bg:'#fee2e2',color:'#991b1b'} }[s]||{bg:colors.lightBg,color:colors.light});

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading course...</div>;
  if (!course) return <div style={{padding:'32px',textAlign:'center',color:colors.light}}>Course not found.</div>;

  const tabs = ['overview','materials','assignments','announcements','classmates'];

  return (
    <div style={{backgroundColor:colors.bg,minHeight:'100vh',padding:'32px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <button style={{display:'flex',alignItems:'center',gap:'6px',background:'none',border:'none',color:colors.primary,fontSize:'15px',fontWeight:'500',cursor:'pointer',marginBottom:'20px'}}
          onClick={()=>navigate('/student/my-courses')}>
          <FiChevronLeft/> Back to Courses
        </button>

        <h1 style={{fontSize:'26px',fontWeight:'600',color:colors.text,marginBottom:'4px'}}>{course.name}</h1>
        <p style={{color:colors.light,marginBottom:'24px'}}>{course.code} • {course.credits} credits • {course.semester}</p>

        {/* Info Card */}
        <div style={{background:colors.card,borderRadius:'20px',padding:'22px',border:`1px solid ${colors.border}`,marginBottom:'24px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
            {[
              {icon:<FiUser/>,label:'Instructor',val:course.instructor_name||'TBA'},
              {icon:<FiCalendar/>,label:'Schedule',val:course.schedule||'TBA'},
              {icon:<FiClock/>,label:'Room',val:course.room||'TBA'},
              {icon:<FiUsers/>,label:'Students',val:`${course.student_count||students.length} enrolled`},
            ].map((item,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'38px',height:'38px',borderRadius:'10px',background:colors.lightBg,display:'flex',alignItems:'center',justifyContent:'center',color:colors.primary}}>{item.icon}</div>
                <div>
                  <div style={{fontSize:'12px',color:colors.light,marginBottom:'2px'}}>{item.label}</div>
                  <div style={{fontSize:'14px',fontWeight:'600',color:colors.text}}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:'8px',marginBottom:'20px',borderBottom:`1px solid ${colors.border}`,paddingBottom:'12px'}}>
          {tabs.map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)}
              style={{padding:'8px 18px',borderRadius:'30px',border:'none',fontSize:'14px',fontWeight:'500',cursor:'pointer',transition:'all 0.2s',background:activeTab===tab?colors.primary:'transparent',color:activeTab===tab?'white':colors.light}}>
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{background:colors.card,borderRadius:'20px',padding:'24px',border:`1px solid ${colors.border}`}}>

          {/* Overview */}
          {activeTab==='overview' && (
            <div>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:colors.text,marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px'}}><FiBookOpen color={colors.primary}/> About this Course</h2>
              <p style={{color:colors.light,lineHeight:'1.8',fontSize:'14px'}}>{course.description || 'No description available.'}</p>
            </div>
          )}

          {/* Materials */}
          {activeTab==='materials' && (
            <div>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:colors.text,marginBottom:'18px',display:'flex',alignItems:'center',gap:'8px'}}><FiFileText color={colors.primary}/> Course Materials</h2>
              {materials.length===0 ? <p style={{color:colors.light}}>No materials uploaded yet.</p> : (
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                  {materials.map(m => (
                    <div key={m.id} style={{padding:'16px',background:colors.lightBg,borderRadius:'14px',border:`1px solid ${colors.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        <div style={{width:'38px',height:'38px',borderRadius:'10px',background:colors.card,display:'flex',alignItems:'center',justifyContent:'center',color:colors.primary}}><FiFileText/></div>
                        <div>
                          <div style={{fontSize:'14px',fontWeight:'500',color:colors.text}}>{m.title}</div>
                          <div style={{fontSize:'12px', color:colors.light}}>{m.file_type?.toUpperCase()} • {m.file_size} • {new Date(m.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {m.file_url && (
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <button 
                            onClick={() => {
                              if (m.file_url.toLowerCase().endsWith('.pdf')) {
                                setViewingPDF({ url: `https://academa-mxe9.onrender.com${m.file_url}`, name: m.title });
                              } else {
                                window.open(`https://academa-mxe9.onrender.com${m.file_url}`, '_blank');
                              }
                            }}
                            style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',background:colors.card,border:`1px solid ${colors.border}`,borderRadius:'8px',fontSize:'12px',color:colors.primary, cursor:'pointer'}}>
                            {m.file_url.toLowerCase().endsWith('.pdf') ? <FiEye size={14}/> : <FiDownload size={14}/>}
                            {m.file_url.toLowerCase().endsWith('.pdf') ? 'View' : 'Download'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assignments */}
          {activeTab==='assignments' && (
            <div>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:colors.text,marginBottom:'18px',display:'flex',alignItems:'center',gap:'8px'}}><FiClipboard color={colors.primary}/> Assignments</h2>
              {assignments.length===0 ? <p style={{color:colors.light}}>No assignments yet.</p> : (
                <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  {assignments.map(a => {
                    const status = a.submission_status || 'pending';
                    const ss = statusStyle(status);
                    return (
                      <div key={a.id} style={{padding:'16px',background:colors.lightBg,borderRadius:'14px',border:`1px solid ${colors.border}`,cursor:'pointer',transition:'all 0.2s'}}
                        onClick={()=>navigate(`/student/assignment-submission/${a.id}`)}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=colors.primary;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=colors.border;}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <div>
                            <div style={{fontSize:'15px',fontWeight:'600',color:colors.text,marginBottom:'4px'}}>{a.title}</div>
                            <div style={{fontSize:'12px',color:colors.light}}>Due: {new Date(a.due_date).toLocaleDateString()} • {a.total_marks} marks</div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                            {a.grade && <span style={{fontSize:'14px',fontWeight:'700',color:colors.primary}}>{a.grade}/{a.total_marks}</span>}
                            <span style={{padding:'4px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'600',background:ss.bg,color:ss.color}}>
                              {status.charAt(0).toUpperCase()+status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Announcements */}
          {activeTab==='announcements' && (
            <div>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:colors.text,marginBottom:'18px',display:'flex',alignItems:'center',gap:'8px'}}><FiMessageSquare color={colors.primary}/> Announcements</h2>
              {announcements.length===0 ? <p style={{color:colors.light}}>No announcements for this course.</p> : (
                announcements.map(a => (
                  <div key={a.id} style={{padding:'16px',background:colors.lightBg,borderRadius:'14px',marginBottom:'12px',border:`1px solid ${colors.border}`,borderLeft:`4px solid ${a.is_important?colors.error:colors.primary}`}}>
                    <div style={{fontSize:'15px',fontWeight:'600',color:colors.text,marginBottom:'6px'}}>{a.title}</div>
                    <p style={{fontSize:'14px',color:colors.light,lineHeight:'1.6',marginBottom:'8px'}}>{a.description}</p>
                    <div style={{fontSize:'12px',color:colors.light}}>{a.author_name} • {new Date(a.created_at).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Classmates */}
          {activeTab==='classmates' && (
            <div>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:colors.text,marginBottom:'18px',display:'flex',alignItems:'center',gap:'8px'}}><FiUsers color={colors.primary}/> Classmates ({students.length})</h2>
              {students.length===0 ? <p style={{color:colors.light}}>No students enrolled yet.</p> : (
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
                  {students.map(s => (
                    <div key={s.id} style={{padding:'14px',background:colors.lightBg,borderRadius:'14px',border:`1px solid ${colors.border}`,display:'flex',alignItems:'center',gap:'10px'}}>
                      <div style={{width:'38px',height:'38px',borderRadius:'10px',background:colors.primary,color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700',fontSize:'14px',flexShrink:0}}>
                        {s.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div style={{fontSize:'14px',fontWeight:'500',color:colors.text}}>{s.name}</div>
                        <div style={{fontSize:'12px',color:colors.light}}>{s.enrollment_id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PDFModal 
        isOpen={!!viewingPDF} 
        onClose={() => setViewingPDF(null)} 
        fileUrl={viewingPDF?.url} 
        fileName={viewingPDF?.name} 
      />
    </div>
  );
};
export default CourseDetail;
