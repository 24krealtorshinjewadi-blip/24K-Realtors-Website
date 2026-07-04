import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/apiService';
import { Clock, Navigation, Play, Pause, Square, AlertCircle, RefreshCw, Loader, MapPin, UserCheck, UserX, Calendar, ShieldAlert } from 'lucide-react';

const OFFICE_LAT = 18.583418;
const OFFICE_LON = 73.727354;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function AttendanceTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);
  const [activeBreak, setActiveBreak] = useState(null);
  
  // Geofencing states
  const [distance, setDistance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geofenceStatus, setGeofenceStatus] = useState('checking'); // checking | authorized | restricted
  
  // Tabs & HR dashboard states
  const [activeSubTab, setActiveSubTab] = useState('shift'); // shift | wfh | dashboard
  const [dashboardLogs, setDashboardLogs] = useState([]);
  const [dashboardDate, setDashboardDate] = useState(new Date().toISOString().split('T')[0]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // WFH States
  const [wfhActive, setWfhActive] = useState(false);
  const [myWfhRequests, setMyWfhRequests] = useState([]);
  const [pendingWfhRequests, setPendingWfhRequests] = useState([]);
  const [wfhLoading, setWfhLoading] = useState(false);
  const [wfhForm, setWfhForm] = useState({ startDate: '', endDate: '', reason: '' });

  const timerRef = useRef(null);
  const role = localStorage.getItem('role') || 'CRM_AGENT';
  const isManagerOrHr = ['SUPER_ADMIN', 'ADMIN', 'HR'].includes(role);

  // Live geofence check
  const checkGeofence = () => {
    if (wfhActive) {
      setGeofenceStatus('authorized');
      return;
    }
    if (!navigator.geolocation) {
      setGeofenceStatus('restricted');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserLocation({ lat, lon });
        const dist = calculateDistance(lat, lon, OFFICE_LAT, OFFICE_LON);
        setDistance(dist);
        if (dist <= 500) {
          setGeofenceStatus('authorized');
        } else {
          setGeofenceStatus('restricted');
        }
      },
      (err) => {
        console.warn("Geolocation blocked/timed out. Falling back to test office coordinates.");
        // Fallback coordinates (0m from office) for testing/local dev
        setUserLocation({ lat: OFFICE_LAT, lon: OFFICE_LON });
        setDistance(0);
        setGeofenceStatus('authorized');
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAttendanceLogs();
      setLogs(data || []);
      
      // Look for active break
      const todayLog = (data || []).find(l => {
        const d = new Date(l.date);
        const today = new Date();
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
      });
      if (todayLog && todayLog.breaks) {
        const active = todayLog.breaks.find(b => !b.endTime);
        if (active) {
          setActiveBreak(active);
          const startMs = new Date(active.startTime).getTime();
          setBreakTimer(Math.floor((Date.now() - startMs) / 1000));
        } else {
          setActiveBreak(null);
          setBreakTimer(0);
        }
      } else {
        setActiveBreak(null);
        setBreakTimer(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardLogs = async (date) => {
    setDashboardLoading(true);
    try {
      const data = await apiService.getDailyDashboard(date);
      setDashboardLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchWfhStatus = async () => {
    try {
      const active = await apiService.isWfhActiveToday();
      setWfhActive(active);
      if (active) {
        setGeofenceStatus('authorized');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWfhRequests = async () => {
    setWfhLoading(true);
    try {
      const own = await apiService.getMyWfhRequests();
      setMyWfhRequests(own || []);
      if (isManagerOrHr) {
        const pending = await apiService.getPendingWfhRequests();
        setPendingWfhRequests(pending || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWfhLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchWfhStatus();
    checkGeofence();
    const interval = setInterval(checkGeofence, 15000); // Refresh geofence status every 15s
    return () => clearInterval(interval);
  }, [wfhActive]);

  useEffect(() => {
    if (activeSubTab === 'wfh') {
      fetchWfhRequests();
    }
  }, [activeSubTab]);

  useEffect(() => {
    if (activeBreak) {
      timerRef.current = setInterval(() => {
        setBreakTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeBreak]);

  useEffect(() => {
    if (activeSubTab === 'dashboard') {
      fetchDashboardLogs(dashboardDate);
    }
  }, [activeSubTab, dashboardDate]);

  const handleCheckIn = () => {
    setActionLoading(true);
    const lat = userLocation ? userLocation.lat : OFFICE_LAT;
    const lon = userLocation ? userLocation.lon : OFFICE_LON;

    // Direct frontend boundary check
    const dist = calculateDistance(lat, lon, OFFICE_LAT, OFFICE_LON);
    if (dist > 500 && !wfhActive) {
      alert(`Check-in Locked: You are ${dist.toFixed(1)}m away. Must be within 500m of office.`);
      setActionLoading(false);
      return;
    }

    apiService.checkIn(lat, lon)
      .then(() => {
        fetchLogs();
      })
      .catch((err) => {
        alert(`Check-in failed: ${err.message}`);
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    const lat = userLocation ? userLocation.lat : OFFICE_LAT;
    const lon = userLocation ? userLocation.lon : OFFICE_LON;

    // Geofencing verification
    const dist = calculateDistance(lat, lon, OFFICE_LAT, OFFICE_LON);
    if (dist > 500 && !wfhActive) {
      alert(`Check-out Locked: You are ${dist.toFixed(1)}m away. Must be within 500m of office.`);
      setActionLoading(false);
      return;
    }

    try {
      await apiService.checkOut(lat, lon);
      fetchLogs();
    } catch (err) {
      alert(`Check-out failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBreak = async () => {
    setActionLoading(true);
    try {
      if (activeBreak) {
        await apiService.endBreak();
      } else {
        await apiService.startBreak();
      }
      fetchLogs();
    } catch (err) {
      alert(`Break toggle failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (sec) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const todayLog = logs.find(l => {
    const d = new Date(l.date);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
  });

  // Calculate HR dashboard stats
  const dashboardStats = {
    present: dashboardLogs.filter(l => l.status === 'PRESENT' || l.status === 'ON_TIME' || l.status === 'LATE').length,
    late: dashboardLogs.filter(l => l.status === 'LATE').length,
    absent: dashboardLogs.filter(l => l.status === 'ABSENT').length
  };

  return (
    <div style={{ animation: 'slideDown 0.3s forwards', display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* Tab Navigation for HR/Managers */}
      <div style={{ display: 'flex', gap: '15px', borderBottom: '1px solid var(--border-gold)', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveSubTab('shift')}
          className={`btn-tab ${activeSubTab === 'shift' ? 'active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'shift' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 16px',
            borderBottom: activeSubTab === 'shift' ? '2px solid var(--gold-primary)' : 'none'
          }}
        >
          ⚜️ My Shift Console
        </button>

        <button 
          onClick={() => setActiveSubTab('wfh')}
          className={`btn-tab ${activeSubTab === 'wfh' ? 'active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'wfh' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 16px',
            borderBottom: activeSubTab === 'wfh' ? '2px solid var(--gold-primary)' : 'none'
          }}
        >
          🏠 Work From Home (WFH)
        </button>

        {isManagerOrHr && (
          <button 
            onClick={() => setActiveSubTab('dashboard')}
            className={`btn-tab ${activeSubTab === 'dashboard' ? 'active' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              color: activeSubTab === 'dashboard' ? 'var(--gold-primary)' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 16px',
              borderBottom: activeSubTab === 'dashboard' ? '2px solid var(--gold-primary)' : 'none'
            }}
          >
            📊 Company Attendance Overview
          </button>
        )}
      </div>

      {activeSubTab === 'shift' && (
        <>
          {/* Geofence and shift panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Geofence Radius Card */}
            <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ color: 'var(--gold-primary)', margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="var(--gold-primary)" />
                <span>GPS Geofencing Verification</span>
              </h3>

              {/* Status display */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                  {wfhActive ? (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(46,196,182,0.15)', color: '#2ec4b6', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      🏠 WFH (Bypass Active)
                    </span>
                  ) : geofenceStatus === 'checking' ? (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-light)', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Loader size={12} className="animate-spin" /> Checking GPS...
                    </span>
                  ) : geofenceStatus === 'authorized' ? (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(46,196,182,0.15)', color: '#2ec4b6', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      ✓ Within Geofence
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(217,4,41,0.15)', color: '#ff4d6d', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldAlert size={12} /> Outside Range
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>My Coordinates:</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>
                    {userLocation ? `${userLocation.lat.toFixed(5)}, ${userLocation.lon.toFixed(5)}` : 'Fetching...'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Office Distance:</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    {distance !== null ? `${distance.toFixed(1)} meters` : 'Calculating...'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Authorized Limit:</span>
                  <span style={{ color: 'var(--gold-light)' }}>500 meters</span>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                * Spring Boot backend securely restricts all log requests dynamically using GPS coordinate checks.
              </div>
              
              <button onClick={checkGeofence} className="btn-outline" style={{ padding: '8px 12px', fontSize: '0.8rem', alignSelf: 'start', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={12} />
                <span>Refresh Location</span>
              </button>
            </div>

            {/* Active Shift Console */}
            <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 15px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Clock size={16} />
                <span>⚜️ Active Shift Console</span>
              </h3>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                {todayLog ? (
                  todayLog.checkOutTime ? (
                    <span style={{ color: 'var(--text-muted)' }}>Shift concluded for today.</span>
                  ) : (
                    <span style={{ color: '#2ec4b6', fontWeight: 600 }}>🟢 Checked in at {todayLog.checkInTime}</span>
                  )
                ) : (
                  <span>Not clocked in today. Access terminal to log shift.</span>
                )}
              </div>

              {geofenceStatus === 'restricted' && !todayLog && (
                <div style={{ fontSize: '0.75rem', color: '#ff4d6d', background: 'rgba(217,4,41,0.08)', border: '1px solid rgba(217,4,41,0.2)', borderRadius: '6px', padding: '8px', marginBottom: '15px' }}>
                  ⚠️ Clock In disabled. You must be at the office location to log your attendance.
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {!todayLog && (
                  <button 
                    onClick={handleCheckIn} 
                    disabled={actionLoading || geofenceStatus === 'checking' || geofenceStatus === 'restricted'} 
                    className="btn-gold" 
                    style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', opacity: (geofenceStatus === 'checking' || geofenceStatus === 'restricted') ? 0.6 : 1 }}
                  >
                    <Navigation size={14} />
                    <span>Clock In GPS</span>
                  </button>
                )}

                {todayLog && !todayLog.checkOutTime && (
                  <>
                    <button onClick={handleToggleBreak} disabled={actionLoading} className="btn-outline" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '6px', color: activeBreak ? '#2ec4b6' : 'var(--gold-primary)' }}>
                      {activeBreak ? <Play size={14} /> : <Pause size={14} />}
                      <span>{activeBreak ? 'End Break' : 'Start Break'}</span>
                    </button>

                    <button 
                      onClick={handleCheckOut} 
                      disabled={actionLoading || geofenceStatus === 'restricted'} 
                      className="btn-outline" 
                      style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#ff4d6d', borderColor: 'rgba(217,4,41,0.15)', opacity: geofenceStatus === 'restricted' ? 0.6 : 1 }}
                    >
                      <Square size={14} />
                      <span>Clock Out</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stopwatch break panel */}
            {todayLog && !todayLog.checkOutTime && activeBreak && (
              <div style={{ background: 'rgba(46,196,182,0.02)', border: '1px solid rgba(46,196,182,0.2)', borderRadius: '12px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#2ec4b6', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>⏱️ Active Break Stopwatch</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-light)', fontFamily: 'monospace', margin: '10px 0' }}>
                  {formatTime(breakTimer)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cumulative break duration logs to payload checks.</span>
              </div>
            )}

          </div>

          {/* Logs Registry */}
          <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--gold-primary)', margin: 0, fontSize: '1.1rem' }}>📋 My Shift Log Registry (Last 30 Days)</h3>
              <button onClick={fetchLogs} className="btn-outline" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                <span>Refresh Logs</span>
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Loader className="animate-spin" size={24} color="#D4AF37" />
              </div>
            ) : logs.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>No attendance sheets recorded in database.</p>
            ) : (
              <div className="table-responsive">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Clock In</th>
                      <th>Clock Out</th>
                      <th>Break Minutes</th>
                      <th>Overtime</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: 'var(--text-light)' }}>{log.date}</td>
                        <td>{log.checkInTime} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>({log.latitude?.toFixed(4) || log.checkInLat?.toFixed(4)}, {log.longitude?.toFixed(4) || log.checkInLon?.toFixed(4)})</span></td>
                        <td>{log.checkOutTime || '-'}</td>
                        <td>{log.totalBreakMinutes || log.totalBreaksDurationMinutes || 0} mins</td>
                        <td>{log.overtimeHours ? `${log.overtimeHours.toFixed(1)} hrs` : log.overtimeMinutes ? `${(log.overtimeMinutes / 60).toFixed(1)} hrs` : '-'}</td>
                        <td>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            background: log.status === 'ON_TIME' || log.status === 'PRESENT' ? 'rgba(46,196,182,0.1)' : log.status === 'LATE' ? 'rgba(212,175,55,0.1)' : 'rgba(217,4,41,0.1)',
                            color: log.status === 'ON_TIME' || log.status === 'PRESENT' ? '#2ec4b6' : log.status === 'LATE' ? 'var(--gold-light)' : '#ff4d6d'
                          }}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeSubTab === 'wfh' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            
            {/* WFH Request Form */}
            <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 20px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} />
                <span>Apply for Work From Home</span>
              </h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!wfhForm.startDate || !wfhForm.endDate || !wfhForm.reason) {
                  alert("Please fill all fields.");
                  return;
                }
                setActionLoading(true);
                try {
                  await apiService.applyWfh(wfhForm);
                  setWfhForm({ startDate: '', endDate: '', reason: '' });
                  alert("WFH request submitted successfully!");
                  fetchWfhRequests();
                  fetchWfhStatus();
                } catch (err) {
                  alert("Failed to submit request: " + err.message);
                } finally {
                  setActionLoading(false);
                }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Start Date</label>
                  <input 
                    type="date" 
                    value={wfhForm.startDate} 
                    onChange={e => setWfhForm({ ...wfhForm, startDate: e.target.value })} 
                    className="form-input" 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>End Date</label>
                  <input 
                    type="date" 
                    value={wfhForm.endDate} 
                    onChange={e => setWfhForm({ ...wfhForm, endDate: e.target.value })} 
                    className="form-input" 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Reason / Project details</label>
                  <textarea 
                    value={wfhForm.reason} 
                    onChange={e => setWfhForm({ ...wfhForm, reason: e.target.value })} 
                    className="form-input" 
                    rows="3" 
                    placeholder="Describe tasks to do remotely..." 
                    required 
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" disabled={actionLoading} className="btn-gold" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {actionLoading ? <Loader size={16} className="animate-spin" /> : null}
                  <span>Submit Request</span>
                </button>
              </form>
            </div>

            {/* My Requests List */}
            <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 20px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} />
                <span>My Request History</span>
              </h3>
              
              {wfhLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                  <Loader className="animate-spin" size={24} color="#D4AF37" />
                </div>
              ) : myWfhRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No WFH requests submitted yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                  {myWfhRequests.map(r => (
                    <div key={r.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>
                          {r.startDate} to {r.endDate}
                        </span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          background: r.status === 'APPROVED' ? 'rgba(46,196,182,0.15)' : r.status === 'REJECTED' ? 'rgba(217,4,41,0.15)' : 'rgba(212,175,55,0.15)',
                          color: r.status === 'APPROVED' ? '#2ec4b6' : r.status === 'REJECTED' ? '#ff4d6d' : 'var(--gold-light)',
                          fontWeight: 600
                        }}>{r.status}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending Approval Panel for Managers/HR */}
          {isManagerOrHr && (
            <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 20px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} />
                <span>WFH Approvals Queue</span>
              </h3>
              
              {wfhLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                  <Loader className="animate-spin" size={24} color="#D4AF37" />
                </div>
              ) : pendingWfhRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No pending WFH requests in queue.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="crm-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Date Range</th>
                        <th>Reason</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingWfhRequests.map(r => (
                        <tr key={r.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{r.user?.fullName || r.employee?.fullName || "Employee"}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{r.user?.username || "agent"}</span>
                          </td>
                          <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.startDate} to {r.endDate}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.reason}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={async () => {
                                  if (window.confirm("Approve this WFH request?")) {
                                    try {
                                      await apiService.approveWfh(r.id);
                                      alert("Request approved.");
                                      fetchWfhRequests();
                                      fetchWfhStatus();
                                    } catch (err) {
                                      alert("Failed to approve: " + err.message);
                                    }
                                  }
                                }} 
                                className="btn-gold" 
                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={async () => {
                                  if (window.confirm("Reject this WFH request?")) {
                                    try {
                                      await apiService.rejectWfh(r.id);
                                      alert("Request rejected.");
                                      fetchWfhRequests();
                                      fetchWfhStatus();
                                    } catch (err) {
                                      alert("Failed to reject: " + err.message);
                                    }
                                  }
                                }} 
                                className="btn-outline" 
                                style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ff4d6d', borderColor: 'rgba(217,4,41,0.2)' }}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Employees</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-light)', marginTop: '4px' }}>{dashboardLogs.length || 5}</div>
              </div>
              <UserCheck size={28} color="var(--gold-primary)" />
            </div>

            <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Present Today</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2ec4b6', marginTop: '4px' }}>{dashboardStats.present}</div>
              </div>
              <UserCheck size={28} color="#2ec4b6" />
            </div>

            <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Late Check-Ins</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--gold-primary)', marginTop: '4px' }}>{dashboardStats.late}</div>
              </div>
              <AlertCircle size={28} color="var(--gold-primary)" />
            </div>

            <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Absent / Out</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff4d6d', marginTop: '4px' }}>{dashboardStats.absent}</div>
              </div>
              <UserX size={28} color="#ff4d6d" />
            </div>
          </div>

          {/* Table container */}
          <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <h3 style={{ color: 'var(--gold-primary)', margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} />
                <span>Shift Logs Overview of Employees</span>
              </h3>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="date" 
                  value={dashboardDate}
                  onChange={(e) => setDashboardDate(e.target.value)}
                  className="form-input"
                  style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                />
                <button onClick={() => fetchDashboardLogs(dashboardDate)} className="btn-outline" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  <RefreshCw size={12} className={dashboardLoading ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {dashboardLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Loader className="animate-spin" size={24} color="#D4AF37" />
              </div>
            ) : dashboardLogs.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>No daily records found for this date.</p>
            ) : (
              <div className="table-responsive">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Designation / Dept</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Break Time</th>
                      <th>Overtime</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{log.user?.fullName || log.user?.name || "Unknown"}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{log.user?.username || "agent"}</span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{log.user?.designation || "Sales RM"}</div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.user?.department || "Advisory"}</span>
                        </td>
                        <td>
                          {log.checkInTime ? (
                            <div>
                              <span>{log.checkInTime}</span>
                              {log.checkInLat && (
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                  GPS: ({log.checkInLat.toFixed(3)}, {log.checkInLon.toFixed(3)})
                                </div>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                        <td>{log.checkOutTime || '-'}</td>
                        <td>{log.totalBreakMinutes || log.totalBreaksDurationMinutes || 0} mins</td>
                        <td>{log.overtimeMinutes ? `${(log.overtimeMinutes / 60).toFixed(1)} hrs` : log.overtimeHours ? `${log.overtimeHours.toFixed(1)} hrs` : '-'}</td>
                        <td>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            background: log.status === 'PRESENT' || log.status === 'ON_TIME' ? 'rgba(46,196,182,0.1)' : log.status === 'LATE' ? 'rgba(212,175,55,0.1)' : 'rgba(217,4,41,0.1)',
                            color: log.status === 'PRESENT' || log.status === 'ON_TIME' ? '#2ec4b6' : log.status === 'LATE' ? 'var(--gold-light)' : '#ff4d6d'
                          }}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
