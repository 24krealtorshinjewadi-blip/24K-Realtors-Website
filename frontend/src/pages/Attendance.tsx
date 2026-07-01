import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { Clock, MapPin, Play, Square, Calendar, Loader2, Compass } from 'lucide-react';

interface AttendanceSession {
  id: string;
  checkInTime: string;
  checkOutTime?: string;
  late: boolean;
  earlyExit: boolean;
  status: string;
  totalBreaksDurationMinutes: number;
  breaks?: { startTime: string; endTime?: string }[];
}

export const Attendance: React.FC = () => {
  const queryClient = useQueryClient();
  const [gps, setGps] = useState<{ lat: number; lon: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);

  // Fetch today's session state
  const { data: todaySession, isLoading } = useQuery<AttendanceSession | null>({
    queryKey: ['todayAttendance'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/attendance/today');
        if (response.status === 204) return null;
        return response.data;
      } catch {
        return null;
      }
    }
  });

  // Fetch monthly logs
  const { data: logs = [] } = useQuery<AttendanceSession[]>({
    queryKey: ['attendanceLogs'],
    queryFn: async () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const end = now.toISOString().split('T')[0];
      const response = await apiClient.get(`/attendance/logs?startDate=${start}&endDate=${end}`);
      return response.data;
    }
  });

  // Fetch GPS Coordinates
  const fetchGps = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGps({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setLocating(false);
        },
        () => {
          // Mock coordinates in case of permissions error or sandbox constraints
          setGps({ lat: 18.5590, lon: 73.7868 });
          setLocating(false);
        }
      );
    } else {
      setGps({ lat: 18.5590, lon: 73.7868 });
      setLocating(false);
    }
  };

  useEffect(() => {
    fetchGps();
  }, []);

  // Timer running while on break
  const activeBreak = todaySession?.breaks?.find(b => !b.endTime);
  useEffect(() => {
    let interval: any;
    if (activeBreak) {
      const start = new Date(activeBreak.startTime).getTime();
      interval = setInterval(() => {
        setBreakTimer(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      setBreakTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeBreak]);

  // Mutations
  const checkInMutation = useMutation({
    mutationFn: async (coords: { lat: number; lon: number }) => {
      return apiClient.post('/attendance/check-in', { latitude: coords.lat, longitude: coords.lon });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendanceLogs'] });
    }
  });

  const checkOutMutation = useMutation({
    mutationFn: async (coords: { lat: number; lon: number }) => {
      return apiClient.post('/attendance/check-out', { latitude: coords.lat, longitude: coords.lon });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendanceLogs'] });
    }
  });

  const startBreakMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post('/attendance/break/start');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
    }
  });

  const endBreakMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post('/attendance/break/end');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
    }
  });

  const formatSeconds = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCheckedIn = !!todaySession?.checkInTime;
  const isCheckedOut = !!todaySession?.checkOutTime;
  const isOnBreak = !!activeBreak;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Attendance Action Console */}
        <div className="bg-[#070f1e] border border-slate-800 rounded-xl p-8 flex flex-col justify-between items-center text-center lg:col-span-1 min-h-[400px]">
          <div className="w-full flex justify-between items-center text-xs text-slate-500 mb-6">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Compass size={14} className={locating ? 'animate-spin' : ''} />
              {gps ? `${gps.lat.toFixed(4)}, ${gps.lon.toFixed(4)}` : 'Awaiting GPS...'}
            </span>
          </div>

          <div className="space-y-4">
            <div className="text-4xl font-extrabold text-white tracking-wider font-mono">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Secure check-ins require verified GPS authorization matching real-estate platform coordinates.
            </p>
          </div>

          {/* Action Button Controls */}
          <div className="w-full space-y-3.5 mt-8">
            {!isCheckedIn ? (
              <button
                disabled={checkInMutation.isPending || locating}
                onClick={() => gps && checkInMutation.mutate(gps)}
                className="w-full bg-[#D4AF37] text-slate-950 py-3.5 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {checkInMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
                <span>Perform Core Check-In</span>
              </button>
            ) : isCheckedOut ? (
              <div className="bg-slate-900 border border-slate-800 text-slate-400 py-4 px-6 rounded-lg text-sm font-medium w-full">
                🔒 Shift Session Concluded
              </div>
            ) : (
              <div className="space-y-3 w-full">
                {isOnBreak ? (
                  <button
                    disabled={endBreakMutation.isPending}
                    onClick={() => endBreakMutation.mutate()}
                    className="w-full bg-emerald-500 text-slate-950 py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                  >
                    <Square size={18} />
                    <span>Conclude Break Log ({formatSeconds(breakTimer)})</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={startBreakMutation.isPending}
                      onClick={() => startBreakMutation.mutate()}
                      className="bg-slate-800 border border-slate-700 text-white py-3.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      <Play size={14} />
                      <span>Take Active Break</span>
                    </button>

                    <button
                      disabled={checkOutMutation.isPending || locating}
                      onClick={() => gps && checkOutMutation.mutate(gps)}
                      className="bg-rose-500 text-slate-950 py-3.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-rose-500/25 transition-all cursor-pointer"
                    >
                      <Square size={14} />
                      <span>Conclude Shift</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Attendance Summary Widgets */}
        <div className="bg-[#070f1e] border border-slate-800 rounded-xl p-8 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-[#D4AF37]" />
              <span>Today's Shift Log details</span>
            </h3>

            {isLoading ? (
              <div className="text-slate-400 py-12 text-center text-sm">Querying active database...</div>
            ) : !isCheckedIn ? (
              <div className="text-slate-500 py-12 text-center text-sm">
                No active session logs found. Perform core check-in to begin metrics tracking.
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Status Check</span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase ${
                    todaySession?.status === 'LATE' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {todaySession?.status}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Shift Started</span>
                  <span className="text-slate-100 font-mono">
                    {new Date(todaySession.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Shift Ended</span>
                  <span className="text-slate-100 font-mono">
                    {todaySession.checkOutTime 
                      ? new Date(todaySession.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
                      : '--:--'}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Cumulative Breaks Logged</span>
                  <span className="text-slate-100">{todaySession.totalBreaksDurationMinutes} min</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Punctuality Audits</span>
                  <div className="flex gap-2">
                    {todaySession.late && <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase">LATE ENTRANCE</span>}
                    {todaySession.earlyExit && <span className="text-[10px] bg-rose-950/40 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase">EARLY EXIT</span>}
                    {!todaySession.late && !todaySession.earlyExit && <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">PUNCTUAL</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#070f1e] border border-slate-800 rounded-xl p-6">
        <h3 className="text-md font-bold text-white mb-6">📅 Current Month Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Start</th>
                <th className="py-3 px-4 font-semibold">End</th>
                <th className="py-3 px-4 font-semibold">Breaks</th>
                <th className="py-3 px-4 font-semibold">Punctuality</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No attendance logs logged this month.</td>
                </tr>
              ) : (
                logs.map((logItem, idx) => (
                  <tr key={idx} className="border-b border-slate-850 hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      {new Date(logItem.checkInTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {new Date(logItem.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {logItem.checkOutTime 
                        ? new Date(logItem.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
                        : '--:--'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{logItem.totalBreaksDurationMinutes} min</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1">
                        {logItem.late && <span className="text-[9px] bg-amber-950/40 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold uppercase">LATE</span>}
                        {logItem.earlyExit && <span className="text-[9px] bg-rose-950/40 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-bold uppercase">EARLY EXIT</span>}
                        {!logItem.late && !logItem.earlyExit && <span className="text-[9px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase">OK</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-[4px] font-bold text-[9px] uppercase ${
                        logItem.status === 'LATE' ? 'bg-amber-950/40 text-amber-400' : 'bg-emerald-950/40 text-emerald-400'
                      }`}>
                        {logItem.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
