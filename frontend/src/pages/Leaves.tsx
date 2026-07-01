import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAuthStore } from '../store/authStore';
import { Calendar, Plus, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface LeaveBalance {
  casualLeaves: number;
  sickLeaves: number;
  earnedLeaves: number;
}

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: string;
  user?: { fullName: string; designation: string };
}

export const Leaves: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [applyError, setApplyError] = useState('');

  const isManagerOrHr = !!(user && ['SUPER_ADMIN', 'ADMIN', 'HR'].includes(user.role));

  // Fetch balances
  const { data: balance, isLoading: balanceLoading } = useQuery<LeaveBalance>({
    queryKey: ['leaveBalance'],
    queryFn: async () => {
      const response = await apiClient.get('/leaves/balance');
      return response.data;
    }
  });

  // Fetch own requests
  const { data: myRequests, isLoading: requestsLoading } = useQuery<LeaveRequest[]>({
    queryKey: ['myLeaveRequests'],
    queryFn: async () => {
      const response = await apiClient.get('/leaves/my-requests');
      return response.data;
    }
  });
  const myRequestsList: LeaveRequest[] = myRequests || [];

  // Fetch pending requests (Managers/HR only)
  const { data: pendingRequests } = useQuery<LeaveRequest[]>({
    queryKey: ['pendingLeaveRequests'],
    queryFn: async () => {
      const response = await apiClient.get('/leaves/pending');
      return response.data;
    },
    enabled: isManagerOrHr
  });
  const pendingRequestsList: LeaveRequest[] = pendingRequests || [];

  // Mutations
  const applyMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      return apiClient.post('/leaves/apply', newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalance'] });
      setShowApplyModal(false);
      setFormData({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
      setApplyError('');
    },
    onError: (err: any) => {
      setApplyError(err.response?.data || 'Failed to submit leave request. Insufficient balances.');
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.patch(`/leaves/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myLeaveRequests'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.patch(`/leaves/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalance'] });
    }
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError('');
    applyMutation.mutate(formData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
      case 'REJECTED': return 'bg-rose-950/40 text-rose-400 border border-rose-500/20';
      default: return 'bg-amber-950/40 text-amber-400 border border-amber-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {balanceLoading ? (
          <div className="sm:col-span-3 text-center text-slate-400 py-6">Loading balances...</div>
        ) : (
          <>
            <div className="bg-[#070f1e] border border-slate-800 p-6 rounded-xl relative group">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Casual Leaves</h3>
              <p className="text-3xl font-bold text-[#D4AF37] mt-2 font-mono">{balance?.casualLeaves ?? '12.0'}</p>
              <span className="text-[10px] text-slate-500 mt-2 block">Routine personal leave quota</span>
            </div>
            <div className="bg-[#070f1e] border border-slate-800 p-6 rounded-xl relative group">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sick Leaves</h3>
              <p className="text-3xl font-bold text-amber-400 mt-2 font-mono">{balance?.sickLeaves ?? '10.0'}</p>
              <span className="text-[10px] text-slate-500 mt-2 block">Medical/Health rest allowances</span>
            </div>
            <div className="bg-[#070f1e] border border-slate-800 p-6 rounded-xl relative group">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Earned Leaves</h3>
              <p className="text-3xl font-bold text-sky-400 mt-2 font-mono">{balance?.earnedLeaves ?? '15.0'}</p>
              <span className="text-[10px] text-slate-500 mt-2 block">Accumulated privilege days</span>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => { setApplyError(''); setShowApplyModal(true); }}
          className="bg-[#D4AF37] text-slate-950 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          File Leave Request
        </button>
      </div>

      {/* HR/Admin Approval Desk */}
      {isManagerOrHr && pendingRequestsList.length > 0 && (
        <div className="bg-[#070f1e] border border-[#D4AF37]/20 rounded-xl p-6">
          <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="text-[#D4AF37]" size={18} />
            <span>⚜️ Leave Requests Approval Desk</span>
          </h3>
          <div className="space-y-4">
            {pendingRequestsList.map(req => (
              <div key={req.id} className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">{req.user?.fullName}</strong>
                    <span className="text-[10px] text-slate-400">({req.user?.designation})</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    <span className="text-[#D4AF37] font-semibold">{req.leaveType}</span>: {req.startDate} to {req.endDate}
                  </p>
                  <p className="text-xs text-slate-500 italic mt-1 font-sans">" {req.reason} "</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    disabled={rejectMutation.isPending}
                    onClick={() => rejectMutation.mutate(req.id)}
                    className="border border-rose-500/30 hover:bg-rose-950/20 text-rose-400 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                  <button 
                    disabled={approveMutation.isPending}
                    onClick={() => approveMutation.mutate(req.id)}
                    className="bg-[#D4AF37] hover:bg-[#AA8B24] text-slate-950 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave Application Log History */}
      <div className="bg-[#070f1e] border border-slate-800 rounded-xl p-6">
        <h3 className="text-md font-bold text-white mb-6">📋 My Application Logs</h3>
        {requestsLoading ? (
          <div className="text-slate-400 py-12 text-center text-sm">Loading logs...</div>
        ) : myRequestsList.length === 0 ? (
          <div className="text-slate-500 py-12 text-center text-sm">No leave applications recorded in database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Start Date</th>
                  <th className="py-3 px-4 font-semibold">End Date</th>
                  <th className="py-3 px-4 font-semibold">Reason</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {myRequestsList.map((req, idx) => (
                  <tr key={idx} className="border-b border-slate-850 hover:bg-slate-800/10 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#D4AF37]">{req.leaveType}</td>
                    <td className="py-3.5 px-4 text-slate-300">{req.startDate}</td>
                    <td className="py-3.5 px-4 text-slate-300">{req.endDate}</td>
                    <td className="py-3.5 px-4 text-slate-400 truncate max-w-xs">{req.reason || '-'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-[4px] font-bold text-[9px] uppercase ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Request Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070f1e] border border-[#D4AF37]/30 w-full max-w-md rounded-xl p-6 relative animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="text-[#D4AF37]" size={22} />
              <span>⚜️ File Leave Request</span>
            </h3>

            {applyError && (
              <div className="bg-rose-950/30 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{applyError}</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-5">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 font-semibold mb-2">Leave Category</label>
                <select 
                  value={formData.leaveType}
                  onChange={e => setFormData({ ...formData, leaveType: e.target.value })}
                  className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="CASUAL">Casual Leaves</option>
                  <option value="SICK">Sick Leaves</option>
                  <option value="EARNED">Earned Leaves</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-semibold mb-2">Start Date</label>
                  <input 
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-semibold mb-2">End Date</label>
                  <input 
                    required
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-slate-400 font-semibold mb-2">Request Statement</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="e.g. Urgent family commitments..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2 text-sm font-semibold border border-slate-800 rounded-lg hover:bg-slate-800/40 text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="bg-[#D4AF37] text-slate-950 px-6 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {applyMutation.isPending ? 'Filing...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
