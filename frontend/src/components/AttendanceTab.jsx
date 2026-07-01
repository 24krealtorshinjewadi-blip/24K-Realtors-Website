import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/apiService';
import { Clock, Navigation, Play, Pause, Square, AlertCircle, RefreshCw, Loader } from 'lucide-react';

export default function AttendanceTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);
  const [activeBreak, setActiveBreak] = useState(null);
  
  const timerRef = useRef(null);

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

  useEffect(() => {
    fetchLogs();
  }, []);

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

  const handleCheckIn = () => {
    setActionLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await apiService.checkIn(pos.coords.latitude, pos.coords.longitude);
          fetchLogs();
        } catch (err) {
          alert(`Check-in failed: ${err.message}`);
        } finally {
          setActionLoading(false);
        }
      },
      async (err) => {
        // Fallback to default coords if blocked
        try {
          await apiService.checkIn(18.5590, 73.7868);
          fetchLogs();
        } catch (apiErr) {
          alert(`Check-in failed: ${apiErr.message}`);
        } finally {
          setActionLoading(false);
        }
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await apiService.checkOut();
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

  return (
    <div style={{ animation: 'slideDown 0.3s forwards', display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* Shift Panel Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Attendance status control panel */}
        <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 15px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Clock size={16} />
            <span>⚜️ Active Shift Console</span>
          </h3>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {todayLog ? (
              todayLog.checkOutTime ? (
                <span style={{ color: 'var(--text-muted)' }}>Shift concluded for today.</span>
              ) : (
                <span style={{ color: '#2ec4b6' }}>🟢 Checked in at {todayLog.checkInTime}</span>
              )
            ) : (
              <span>Not clocked in today. Access terminal to log shift.</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!todayLog && (
              <button onClick={handleCheckIn} disabled={actionLoading} className="btn-gold" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

                <button onClick={handleCheckOut} disabled={actionLoading} className="btn-outline" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#ff4d6d', borderColor: 'rgba(217,4,41,0.15)' }}>
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
          <h3 style={{ color: 'var(--gold-primary)', margin: 0, fontSize: '1.1rem' }}>📋 Monthly Shift Log Registry</h3>
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
                    <td>{log.checkInTime} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>({log.latitude?.toFixed(4)}, {log.longitude?.toFixed(4)})</span></td>
                    <td>{log.checkOutTime || '-'}</td>
                    <td>{log.totalBreakMinutes} mins</td>
                    <td>{log.overtimeHours ? `${log.overtimeHours.toFixed(1)} hrs` : '-'}</td>
                    <td>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        background: log.status === 'ON_TIME' ? 'rgba(46,196,182,0.1)' : log.status === 'LATE' ? 'rgba(212,175,55,0.1)' : 'rgba(217,4,41,0.1)',
                        color: log.status === 'ON_TIME' ? '#2ec4b6' : log.status === 'LATE' ? 'var(--gold-light)' : '#ff4d6d'
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
  );
}
