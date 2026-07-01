import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { 
  Phone, Mail, MapPin, DollarSign, Award
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  requirementType: string;
  budgetMin: number;
  budgetMax: number;
  preferredLocation: string;
  status: string;
  notes: string;
  leadScore: number;
  assignedAgent?: { id: string; name: string };
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
}

interface Employee {
  id: string;
  fullName: string;
  role: string;
}

interface Activity {
  id: string;
  activityType: string;
  subject: string;
  details: string;
  createdDate: string;
}

export const Leads: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  
  // Action state tabs inside Lead detail modal
  const [actionTab, setActionTab] = useState<'timeline' | 'visit' | 'booking' | 'call'>('timeline');

  // Input states inside Modal
  const [visitForm, setVisitForm] = useState({ propertyId: '', assignedUserId: '', visitTime: '' });
  const [bookingForm, setBookingForm] = useState({ propertyId: '', assignedUserId: '', bookingAmount: 0, totalPrice: 0 });
  const [callForm, setCallForm] = useState({ subject: 'Outbound Call', details: '' });

  // Query Leads
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await apiClient.get('/leads');
      return response.data;
    }
  });

  // Query Properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await apiClient.get('/properties');
      // Handle pageable structure if backend returns Page object
      if (response.data.content) return response.data.content;
      return response.data;
    }
  });

  // Query Employees (for assignment)
  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['employeesList'],
    queryFn: async () => {
      const response = await apiClient.get('/employees');
      return response.data;
    },
    enabled: !!selectedLead
  });

  // Query Timeline Activities
  const { data: timeline = [], refetch: refetchTimeline } = useQuery<Activity[]>({
    queryKey: ['leadTimeline', selectedLead?.id],
    queryFn: async () => {
      if (!selectedLead) return [];
      const response = await apiClient.get(`/leads/${selectedLead.id}/timeline`);
      return response.data;
    },
    enabled: !!selectedLead
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async (vars: { id: string; status: string }) => {
      return apiClient.put(`/leads/${vars.id}`, { status: vars.status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  const scheduleVisitMutation = useMutation({
    mutationFn: async (data: typeof visitForm) => {
      return apiClient.post('/site-visits', { leadId: selectedLead?.id, ...data });
    },
    onSuccess: () => {
      refetchTimeline();
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setVisitForm({ propertyId: '', assignedUserId: '', visitTime: '' });
      setActionTab('timeline');
    }
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: typeof bookingForm) => {
      return apiClient.post('/bookings', { leadId: selectedLead?.id, ...data });
    },
    onSuccess: () => {
      refetchTimeline();
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setBookingForm({ propertyId: '', assignedUserId: '', bookingAmount: 0, totalPrice: 0 });
      setActionTab('timeline');
    }
  });

  const addCallLogMutation = useMutation({
    mutationFn: async (data: typeof callForm) => {
      return apiClient.post(`/leads/${selectedLead?.id}/timeline`, { ...data, activityType: 'CALL' });
    },
    onSuccess: () => {
      refetchTimeline();
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setCallForm({ subject: 'Outbound Call', details: '' });
      setActionTab('timeline');
    }
  });

  const columns = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'VISITED', 'CONVERTED'];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex justify-between items-center bg-[#070f1e] border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">View Options:</span>
          <div className="bg-[#020617] p-1 rounded-lg border border-slate-800 flex">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${viewMode === 'kanban' ? 'bg-[#D4AF37] text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Pipeline Kanban
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-[#D4AF37] text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Log List
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Total CRM Pipeline Capacity: <strong>{leads.length} Leads</strong>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center text-slate-400">Loading pipeline leads...</div>
      ) : viewMode === 'list' ? (
        <div className="bg-[#070f1e] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/30">
                <th className="py-4 px-6 font-semibold">Name</th>
                <th className="py-4 px-6 font-semibold">Budget (INR)</th>
                <th className="py-4 px-6 font-semibold">Location Preference</th>
                <th className="py-4 px-6 font-semibold">Punctuation Index</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-slate-850 hover:bg-slate-800/10 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">{lead.name}</td>
                  <td className="py-4 px-6 text-slate-300">₹{lead.budgetMin?.toLocaleString()} - ₹{lead.budgetMax?.toLocaleString()}</td>
                  <td className="py-4 px-6 text-slate-400">{lead.preferredLocation}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-300">{lead.leadScore}%</span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${getScoreColor(lead.leadScore)}`} style={{ width: `${lead.leadScore}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-800 text-[#D4AF37] px-2 py-0.5 rounded text-[10px] font-bold uppercase">{lead.status}</span>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => { setSelectedLead(lead); setActionTab('timeline'); }}
                      className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      Detail Console →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map(col => {
            const colLeads = leads.filter(l => l.status === col);
            return (
              <div key={col} className="bg-[#070f1e] border border-slate-800/60 rounded-xl p-4 min-w-[240px] flex flex-col h-[70vh] overflow-y-auto space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-white tracking-wide uppercase">{col}</span>
                  <span className="bg-slate-800/80 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{colLeads.length}</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colLeads.map(lead => (
                    <div 
                      key={lead.id}
                      onClick={() => { setSelectedLead(lead); setActionTab('timeline'); }}
                      className="bg-slate-900 border border-slate-800 hover:border-[#D4AF37]/30 p-4 rounded-lg space-y-3.5 cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-xs leading-tight truncate max-w-[130px]">{lead.name}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${getScoreColor(lead.leadScore)} text-slate-950`}>
                          {lead.leadScore}%
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={10} className="text-slate-500" />
                          <span>{lead.preferredLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={10} className="text-slate-500" />
                          <span>₹{(lead.budgetMax / 100000).toFixed(1)} L Max</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070f1e] border border-[#D4AF37]/30 w-full max-w-4xl rounded-xl p-6 max-h-[90vh] overflow-y-auto relative animate-scale-up grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Panel: Profile Detail */}
            <div className="md:col-span-1 border-r border-slate-800/80 pr-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white leading-tight mb-2">{selectedLead.name}</h3>
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    updateStatusMutation.mutate({ id: selectedLead.id, status: newStatus });
                    setSelectedLead({ ...selectedLead, status: newStatus });
                  }}
                  className="bg-[#020617] border border-slate-800 text-[#D4AF37] rounded-lg px-2.5 py-1 text-xs focus:outline-none uppercase font-bold"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="VISITED">Visited</option>
                  <option value="CONVERTED">Converted</option>
                </select>
              </div>

              <div className="space-y-4 text-xs text-slate-400">
                <h4 className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wide border-b border-slate-800 pb-2">Profile details</h4>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-500" />
                  <span>{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-500" />
                  <span>{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-500" />
                  <span>{selectedLead.preferredLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-slate-500" />
                  <span>₹{selectedLead.budgetMin?.toLocaleString()} - ₹{selectedLead.budgetMax?.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-slate-800/20 border border-slate-800 p-4 rounded-lg">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Award size={14} className="text-[#D4AF37]" />
                  <span>AI Lead Score Index</span>
                </h4>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-mono font-bold text-slate-100">{selectedLead.leadScore}%</div>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${getScoreColor(selectedLead.leadScore)}`} style={{ width: `${selectedLead.leadScore}%` }}></div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Score automatically updates with site visits and communications logs.</p>
              </div>

              <button 
                onClick={() => setSelectedLead(null)}
                className="w-full border border-slate-800 text-slate-400 py-2.5 rounded-lg text-xs font-semibold hover:bg-slate-800/40 transition-colors"
              >
                Close Console
              </button>
            </div>

            {/* Right Panel: Operations Tabs */}
            <div className="md:col-span-2 flex flex-col h-[70vh]">
              {/* Tabs */}
              <div className="flex border-b border-slate-800 pb-3 mb-6 overflow-x-auto gap-4">
                <button onClick={() => setActionTab('timeline')} className={`text-xs font-bold pb-2 border-b-2 cursor-pointer transition-colors ${actionTab === 'timeline' ? 'border-[#D4AF37] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
                  Timeline Logs
                </button>
                <button onClick={() => setActionTab('visit')} className={`text-xs font-bold pb-2 border-b-2 cursor-pointer transition-colors ${actionTab === 'visit' ? 'border-[#D4AF37] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
                  Schedule Tour
                </button>
                <button onClick={() => setActionTab('booking')} className={`text-xs font-bold pb-2 border-b-2 cursor-pointer transition-colors ${actionTab === 'booking' ? 'border-[#D4AF37] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
                  Create Booking
                </button>
                <button onClick={() => setActionTab('call')} className={`text-xs font-bold pb-2 border-b-2 cursor-pointer transition-colors ${actionTab === 'call' ? 'border-[#D4AF37] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
                  Log Comm Notes
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                
                {/* Timeline Tab */}
                {actionTab === 'timeline' && (
                  <div className="space-y-4">
                    {timeline.length === 0 ? (
                      <p className="text-xs text-slate-500 py-12 text-center">No logs logged for this lead yet.</p>
                    ) : (
                      timeline.map(act => (
                        <div key={act.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-xs space-y-1 relative">
                          <span className="absolute top-4 right-4 text-[9px] text-slate-500 font-mono">
                            {new Date(act.createdDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                          <strong className="text-white block">{act.subject}</strong>
                          <span className="text-[10px] text-[#D4AF37] font-mono tracking-wider uppercase block">{act.activityType}</span>
                          <p className="text-slate-400 font-sans mt-2">{act.details}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Visit Form */}
                {actionTab === 'visit' && (
                  <form onSubmit={(e) => { e.preventDefault(); scheduleVisitMutation.mutate(visitForm); }} className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-2">Target Property Listing *</label>
                      <select 
                        required 
                        value={visitForm.propertyId} 
                        onChange={e => setVisitForm({ ...visitForm, propertyId: e.target.value })}
                        className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="">Select Property</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.title} - ₹{(p.price/100000).toFixed(1)} L ({p.location})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-2">Assign Advisory RM *</label>
                      <select 
                        required 
                        value={visitForm.assignedUserId} 
                        onChange={e => setVisitForm({ ...visitForm, assignedUserId: e.target.value })}
                        className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="">Select RM</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.role})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-2">Scheduled Time *</label>
                      <input 
                        required 
                        type="datetime-local" 
                        value={visitForm.visitTime} 
                        onChange={e => setVisitForm({ ...visitForm, visitTime: e.target.value })}
                        className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]" 
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={scheduleVisitMutation.isPending}
                      className="w-full bg-[#D4AF37] text-slate-950 py-3 rounded-lg text-xs font-bold hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {scheduleVisitMutation.isPending ? 'Scheduling...' : 'Confirm Schedule Visit'}
                    </button>
                  </form>
                )}

                {/* Booking Form */}
                {actionTab === 'booking' && (
                  <form onSubmit={(e) => { e.preventDefault(); createBookingMutation.mutate(bookingForm); }} className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-2">Property Listing *</label>
                      <select 
                        required 
                        value={bookingForm.propertyId} 
                        onChange={e => setBookingForm({ ...bookingForm, propertyId: e.target.value })}
                        className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none"
                      >
                        <option value="">Select Property</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.title} - ₹{p.price?.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-2">Assign Closing RM *</label>
                      <select 
                        required 
                        value={bookingForm.assignedUserId} 
                        onChange={e => setBookingForm({ ...bookingForm, assignedUserId: e.target.value })}
                        className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none"
                      >
                        <option value="">Select RM</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.role})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-xs text-slate-400 font-semibold mb-2">Token Amount (INR) *</label>
                        <input required type="number" value={bookingForm.bookingAmount} onChange={e => setBookingForm({ ...bookingForm, bookingAmount: Number(e.target.value) })} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-slate-400 font-semibold mb-2">Total Price (INR) *</label>
                        <input required type="number" value={bookingForm.totalPrice} onChange={e => setBookingForm({ ...bookingForm, totalPrice: Number(e.target.value) })} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none" />
                      </div>
                    </div>

                    <div className="bg-slate-800/30 border border-slate-800 p-3 rounded-lg text-xs flex justify-between">
                      <span className="text-slate-400">Estimated Corporate Commission (2%)</span>
                      <strong className="text-[#D4AF37]">₹{(bookingForm.totalPrice * 0.02).toLocaleString()}</strong>
                    </div>

                    <button 
                      type="submit"
                      disabled={createBookingMutation.isPending}
                      className="w-full bg-[#D4AF37] text-slate-950 py-3 rounded-lg text-xs font-bold hover:shadow-lg transition-all cursor-pointer"
                    >
                      {createBookingMutation.isPending ? 'Filing Booking...' : 'Create Booking Record'}
                    </button>
                  </form>
                )}

                {/* Call Notes Form */}
                {actionTab === 'call' && (
                  <form onSubmit={(e) => { e.preventDefault(); addCallLogMutation.mutate(callForm); }} className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-2">Subject *</label>
                      <input required type="text" value={callForm.subject} onChange={e => setCallForm({ ...callForm, subject: e.target.value })} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none" />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-2">Call Conversation details *</label>
                      <textarea required rows={4} placeholder="e.g. Lead requested a site visit on Baner 3BHK next Tuesday..." value={callForm.details} onChange={e => setCallForm({ ...callForm, details: e.target.value })} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none resize-none" />
                    </div>

                    <button 
                      type="submit"
                      disabled={addCallLogMutation.isPending}
                      className="w-full bg-[#D4AF37] text-slate-950 py-3 rounded-lg text-xs font-bold hover:shadow-lg transition-all cursor-pointer"
                    >
                      Save Call Log
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
