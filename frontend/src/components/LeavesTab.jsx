import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Plus, CheckCircle, XCircle, RefreshCw, Loader } from 'lucide-react';

export default function LeavesTab() {
  const [balances, setBalances] = useState({ casualLeaves: 0, sickLeaves: 0, earnedLeaves: 0 });
  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [form, setForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  const role = localStorage.getItem('role') || 'CRM_AGENT';
  const isManagerOrHr = ['SUPER_ADMIN', 'ADMIN', 'HR'].includes(role);

  const fetchData = async () => {
    setLoading(true);
    try {
      const bal = await apiService.getLeaveBalance();
      setBalances(bal);
      
      const reqs = await apiService.getMyLeaveRequests();
      setRequests(reqs || []);

      if (isManagerOrHr) {
        const pending = await apiService.getPendingLeaveRequests();
        setPendingRequests(pending || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await apiService.applyLeave(form);
      setShowApplyForm(false);
      setForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
      fetchData();
    } catch (err) {
      alert(`Leave application failed: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiService.approveLeave(id);
      fetchData();
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleReject = async (id) => {
    try {
      await apiService.rejectLeave(id);
      fetchData();
    } catch (err) {
      alert(`Rejection failed: ${err.message}`);
    }
  };

  const getStatusStyle = (status) => {
    return status === 'APPROVED' 
      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
      : status === 'REJECTED' 
      ? 'bg-rose-950/40 text-rose-400 border border-rose-500/20' 
      : 'bg-amber-950/40 text-amber-400 border border-amber-500/20';
  };

  return (
    <div style={{ animation: 'slideDown 0.3s forwards', display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* Leave Balances Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Casual Leaves Balance</span>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold-primary)', margin: '5px 0' }}>{balances.casualLeaves}</div>
        </div>
        <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Sick Leaves Balance</span>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold-primary)', margin: '5px 0' }}>{balances.sickLeaves}</div>
        </div>
        <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Earned Leaves Balance</span>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold-primary)', margin: '5px 0' }}>{balances.earnedLeaves}</div>
        </div>
      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--text-light)', fontSize: '1.25rem', margin: 0 }}>⚜️ Leaves Console</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowApplyForm(!showApplyForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            File Leave Request
          </button>
          <button onClick={fetchData} className="btn-outline" style={{ padding: '8px 12px' }}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Apply Leave Form */}
      {showApplyForm && (
        <div className="form-drawer-overlay" style={{ background: 'rgba(7,15,30,0.6)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '10px' }}>
            <h3 style={{ color: 'var(--gold-primary)', margin: 0 }}>⚜️ File Leave Request</h3>
            <button onClick={() => setShowApplyForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
          </div>
          <form onSubmit={handleApply} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Leave Category *</label>
              <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })} className="form-input" style={{ width: '100%' }}>
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="EARNED">Earned Leave</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Start Date *</label>
              <input required type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>End Date *</label>
              <input required type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="form-input" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Reason Statement *</label>
              <input required type="text" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="form-input" />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'end', gap: '10px' }}>
              <button type="button" onClick={() => setShowApplyForm(false)} className="btn-outline">Cancel</button>
              <button type="submit" disabled={submitLoading} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {submitLoading && <Loader className="animate-spin" size={14} />}
                File Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HR/Admin Approval Desk */}
      {isManagerOrHr && pendingRequests.length > 0 && (
        <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 20px 0', fontSize: '1.1rem' }}>⚜️ Leave Requests Approval Desk</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingRequests.map(req => (
              <div key={req.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-muted)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '0.85rem' }}>{req.user?.fullName} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({req.user?.designation})</span></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{req.leaveType}</span>: {req.startDate} to {req.endDate}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic', marginTop: '6px' }}>" {req.reason} "</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleReject(req.id)} className="btn-outline" style={{ padding: '6px 12px', color: '#ff4d6d', borderColor: 'rgba(217,4,41,0.15)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                    <XCircle size={14} /> Reject
                  </button>
                  <button onClick={() => handleApprove(req.id)} className="btn-gold" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                    <CheckCircle size={14} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaves History */}
      <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 20px 0', fontSize: '1.1rem' }}>📋 My Application Logs</h3>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 0' }}>
            <Loader className="animate-spin" size={24} color="#D4AF37" />
          </div>
        ) : requests.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No leave requests filed yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: 'var(--text-light)' }}>{req.leaveType}</td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.reason}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-[4px] font-bold text-[9px] uppercase ${getStatusStyle(req.status)}`}>
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

    </div>
  );
}
