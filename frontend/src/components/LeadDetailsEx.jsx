import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { 
  X, Sparkles, IndianRupee, Loader, ShieldCheck
} from 'lucide-react';
import { toast } from './Toast';

export default function LeadDetailsEx({ lead, onClose, agents, properties: initialProperties, fetchLeads, fetchStats }) {
  const [activeSubTab, setActiveSubTab] = useState('timeline'); // timeline | sitevisits | bookings
  const [convertingCustomer, setConvertingCustomer] = useState(false);
  const [properties, setProperties] = useState(initialProperties || []);
  
  // Timeline activities
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [activityForm, setActivityForm] = useState({ type: 'NOTE', subject: '', details: '' });

  // Site visits
  const [visits, setVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [visitForm, setVisitForm] = useState({ propertyId: '', scheduledTime: '', transportMode: 'SELF' });

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({ propertyId: '', finalPrice: '', discountApplied: '0', paymentReceived: false });

  const fetchPropertiesList = useCallback(async () => {
    try {
      const data = await apiService.getProperties({ status: '' }, 0, 100);
      setProperties(data.content || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchTimeline = useCallback(async () => {
    setTimelineLoading(true);
    try {
      const data = await apiService.getLeadTimeline(lead.id);
      setTimeline(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTimelineLoading(false);
    }
  }, [lead.id]);

  const fetchVisitsAndBookings = useCallback(async () => {
    setVisitsLoading(true);
    setBookingsLoading(true);
    try {
      const allVisits = await apiService.getAllSiteVisits();
      setVisits((allVisits || []).filter(v => v.lead?.id === lead.id));

      const allBookings = await apiService.getAllBookings();
      setBookings((allBookings || []).filter(b => b.lead?.id === lead.id));
    } catch (err) {
      console.error(err);
    } finally {
      setVisitsLoading(false);
      setBookingsLoading(false);
    }
  }, [lead.id]);

  useEffect(() => {
    fetchTimeline();
    fetchVisitsAndBookings();
    if (!initialProperties || initialProperties.length === 0) {
      fetchPropertiesList();
    }
  }, [lead.id, initialProperties, fetchTimeline, fetchVisitsAndBookings, fetchPropertiesList]);

  // Log Activity
  const handleLogActivity = async (e) => {
    e.preventDefault();
    try {
      await apiService.logLeadActivity(lead.id, {
        activityType: activityForm.type,
        subject: activityForm.subject,
        details: activityForm.details
      });
      setActivityForm({ type: 'NOTE', subject: '', details: '' });
      fetchTimeline();
      fetchLeads && fetchLeads(); // update dashboard score
      toast.success('Activity logged to lead timeline!');
    } catch (err) {
      toast.error(`Failed to log activity: ${err.message}`);
    }
  };

  // Schedule Visit
  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    try {
      const agent = agents?.find(a => a.phone === lead.assignedAgentPhone) || agents?.[0];
      if (!agent) {
        toast.warning("Please assign a relationship manager to this lead first.");
        return;
      }
      await apiService.scheduleSiteVisit({
        leadId: lead.id,
        agentId: agent.id,
        propertyId: visitForm.propertyId,
        scheduledTime: new Date(visitForm.scheduledTime).toISOString().slice(0, 16),
        transportMode: visitForm.transportMode
      });
      setVisitForm({ propertyId: '', scheduledTime: '', transportMode: 'SELF' });
      fetchVisitsAndBookings();
      fetchTimeline();
      fetchLeads && fetchLeads();
      toast.success('Site tour scheduled successfully!');
    } catch (err) {
      toast.error(`Failed to schedule visit: ${err.message}`);
    }
  };

  // Check In Visit
  const handleVisitCheckIn = async (visitId) => {
    try {
      await apiService.recordVisitCheckIn(visitId, 18.5590, 73.7868);
      fetchVisitsAndBookings();
      fetchTimeline();
      toast.success('Site visit checked in!');
    } catch (err) {
      toast.error(`Check-in failed: ${err.message}`);
    }
  };

  // Complete Visit
  const handleVisitComplete = async (visitId) => {
    const feedback = prompt("Enter customer feedback / review notes for this site tour:");
    if (feedback === null) return;
    try {
      await apiService.completeSiteVisit(visitId, feedback);
      fetchVisitsAndBookings();
      fetchTimeline();
      fetchLeads && fetchLeads();
      toast.success('Site visit marked completed!');
    } catch (err) {
      toast.error(`Failed to complete site visit: ${err.message}`);
    }
  };

  // Create Booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const agent = agents?.find(a => a.phone === lead.assignedAgentPhone) || agents?.[0];
      if (!agent) {
        toast.warning("Please assign a relationship manager to this lead first.");
        return;
      }
      await apiService.createBooking({
        leadId: lead.id,
        agentId: agent.id,
        propertyId: bookingForm.propertyId,
        finalPrice: Number(bookingForm.finalPrice),
        discountApplied: Number(bookingForm.discountApplied),
        paymentReceived: bookingForm.paymentReceived
      });
      setBookingForm({ propertyId: '', finalPrice: '', discountApplied: '0', paymentReceived: false });
      fetchVisitsAndBookings();
      fetchTimeline();
      fetchStats && fetchStats();
      fetchLeads && fetchLeads();
      toast.success('Booking recorded successfully!');
    } catch (err) {
      toast.error(`Failed to create booking: ${err.message}`);
    }
  };

  // Confirm Booking
  const handleConfirmBooking = async (id) => {
    try {
      await apiService.confirmBooking(id);
      fetchVisitsAndBookings();
      fetchTimeline();
      fetchStats && fetchStats();
      toast.success('Booking confirmed & agreement generated!');
    } catch (err) {
      toast.error(`Failed to confirm booking: ${err.message}`);
    }
  };

  // Convert Lead to Customer 360
  const handleConvertToCustomer = async () => {
    try {
      setConvertingCustomer(true);
      const customer = await apiService.convertLeadToCustomer(lead.id);
      toast.success(`Converted to Customer 360! Client: ${customer.name}`);
      fetchLeads && fetchLeads();
      fetchStats && fetchStats();
      fetchTimeline();
    } catch (err) {
      toast.error(`Failed to convert to customer: ${err.message}`);
    } finally {
      setConvertingCustomer(false);
    }
  };

  const formatPrice = (val) => {
    if (!val) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const score = lead.leadScore || 50;

  // Calculate current stage dynamically
  let currentStage = 1;
  if (bookings.length > 0) {
    currentStage = 5;
  } else if (visits.some(v => v.status === 'COMPLETED' || v.status === 'CHECKED_IN')) {
    currentStage = 4;
  } else if (visits.some(v => v.status === 'SCHEDULED')) {
    currentStage = 3;
  } else if (timeline.length > 0) {
    currentStage = 2;
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(7,15,30,0.85)', zIndex: 1000, padding: '20px' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#070f1e', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '28px', color: 'var(--text-light)', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}><X size={20} /></button>

        <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 6px 0', fontSize: '1.5rem' }}>{lead.name}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-muted)', paddingBottom: '15px', margin: 0 }}>
          Lead ID: {lead.id} | Phone: {lead.phone} | Email: {lead.email}
        </p>

        {/* Customer 360 Conversion Prompt */}
        <div style={{ marginTop: '16px', background: 'linear-gradient(90deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.02) 100%)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#D4AF37', fontSize: '0.84rem' }}>
              👑 Customer 360° Dossier & Investor Portfolio
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
              {lead.status === 'CONVERTED' ? '✓ Client profile registered in Customer 360 database.' : 'Convert this prospective buyer into an official client profile with KYC & asset ledger.'}
            </div>
          </div>
          {lead.status !== 'CONVERTED' && (
            <button
              onClick={handleConvertToCustomer}
              disabled={convertingCustomer}
              className="btn-gold"
              style={{ padding: '7px 14px', fontSize: '0.76rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {convertingCustomer ? <Loader size={12} className="animate-spin" /> : <ShieldCheck size={14} />}
              Convert to Customer 360°
            </button>
          )}
        </div>

        {/* AI Lead Score Banner */}
        <div style={{ marginTop: '20px', background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--gold-primary)" />
              <span>AI Lead Conversion Score</span>
            </span>
            <strong style={{ color: score > 75 ? '#2ec4b6' : 'var(--gold-primary)', fontSize: '1.1rem' }}>{score}%</strong>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ height: '100%', width: `${score}%`, background: score > 75 ? '#2ec4b6' : 'var(--gold-primary)', transition: 'width 0.5s' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Factors: Budget, Preferred Location (Wakad/Baner), Notes filled, Site tours completed.
          </span>
        </div>

        {/* Visual Lead Journey Stepper */}
        <div style={{ margin: '24px 0', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', alignItems: 'center' }}>
            {/* Background connecting bar */}
            <div style={{ position: 'absolute', top: '15px', left: '4%', right: '4%', height: '3px', background: 'rgba(255,255,255,0.08)', zIndex: 1 }} />
            {/* Active gold connecting bar */}
            <div style={{ 
              position: 'absolute', 
              top: '15px', 
              left: '4%', 
              width: `${(currentStage - 1) * 23}%`, 
              height: '3px', 
              background: 'linear-gradient(90deg, #D4AF37, #FFDF79)', 
              zIndex: 2,
              transition: 'width 0.5s ease-in-out'
            }} />
            
            {/* Step Nodes */}
            {['Contact', 'Engaged', 'Site Visit', 'Checked In', 'Booked'].map((label, index) => {
              const stepNum = index + 1;
              const isCompleted = stepNum <= currentStage;
              const isActive = stepNum === currentStage;
              
              return (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '18%' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: isActive 
                      ? '#070f1e' 
                      : isCompleted 
                        ? 'linear-gradient(135deg, #D4AF37, #B8960C)' 
                        : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${isCompleted ? '#D4AF37' : 'rgba(255,255,255,0.15)'}`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: isActive ? '#D4AF37' : isCompleted ? '#070F1E' : 'rgba(255,255,255,0.4)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 0 15px rgba(212,175,55,0.4)' : 'none'
                  }}>
                    {isCompleted && stepNum < currentStage ? '✓' : stepNum}
                  </div>
                  <span style={{ 
                    marginTop: '8px', 
                    fontSize: '0.72rem', 
                    color: isActive ? '#D4AF37' : isCompleted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                    fontWeight: isActive || isCompleted ? 700 : 500,
                    textAlign: 'center',
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap'
                  }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-muted)', marginTop: '25px', gap: '15px' }}>
          <button 
            onClick={() => setActiveSubTab('timeline')}
            style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'timeline' ? '2px solid var(--gold-primary)' : 'none', color: activeSubTab === 'timeline' ? 'var(--text-light)' : 'var(--text-muted)', padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Timeline & Log
          </button>
          <button 
            onClick={() => setActiveSubTab('sitevisits')}
            style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'sitevisits' ? '2px solid var(--gold-primary)' : 'none', color: activeSubTab === 'sitevisits' ? 'var(--text-light)' : 'var(--text-muted)', padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            VIP Site Visits
          </button>
          <button 
            onClick={() => setActiveSubTab('bookings')}
            style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'bookings' ? '2px solid var(--gold-primary)' : 'none', color: activeSubTab === 'bookings' ? 'var(--text-light)' : 'var(--text-muted)', padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Booking & Commission
          </button>
        </div>

        {/* TAB 1: TIMELINE */}
        {activeSubTab === 'timeline' && (
          <div style={{ marginTop: '20px' }}>
            {/* Log activity form */}
            <form onSubmit={handleLogActivity} style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: '10px', marginBottom: '20px' }}>
              <select value={activityForm.type} onChange={e => setActivityForm({ ...activityForm, type: e.target.value })} className="form-input" style={{ margin: 0 }}>
                <option value="NOTE">📝 Add Note</option>
                <option value="CALL">📞 Log Call</option>
                <option value="EMAIL">✉️ Log Email</option>
                <option value="MEETING">🤝 Log Meeting</option>
              </select>
              <input required type="text" placeholder="Details of conversation..." value={activityForm.subject} onChange={e => setActivityForm({ ...activityForm, subject: e.target.value })} className="form-input" style={{ margin: 0 }} />
              <button type="submit" className="btn-gold" style={{ padding: '8px 16px' }}>Save Log</button>
            </form>

            {/* Timeline feed */}
            {timelineLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}><Loader className="animate-spin" size={20} /></div>
            ) : timeline.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '15px 0' }}>No timeline events recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                {timeline.map((item, idx) => {
                  const typeColors = {
                    SYSTEM: { border: '#3B82F6', text: '#60A5FA' },
                    STATUS_CHANGE: { border: '#10B981', text: '#34D399' },
                    ASSIGNMENT: { border: '#8B5CF6', text: '#A78BFA' },
                    NOTE: { border: '#D4AF37', text: '#D4AF37' },
                    CALL: { border: '#F59E0B', text: '#FBBF24' },
                    MEETING: { border: '#EC4899', text: '#F472B6' }
                  };
                  const colorConfig = typeColors[item.activityType] || { border: '#D4AF37', text: '#D4AF37' };
                  const dateStr = item.createdDate || item.timestamp;
                  return (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${colorConfig.border}`, padding: '12px 14px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', color: colorConfig.text, fontSize: '0.7rem', padding: '1px 6px', background: `${colorConfig.border}15`, borderRadius: '4px' }}>
                          {item.activityType}
                        </span>
                        <span>{dateStr ? new Date(dateStr).toLocaleString('en-IN') : 'Recent'}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: 600 }}>{item.subject}</div>
                      {item.details && (
                        <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px', lineHeight: 1.4 }}>
                          {item.details}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SITE VISITS */}
        {activeSubTab === 'sitevisits' && (
          <div style={{ marginTop: '20px' }}>
            {/* Schedule Visit Form */}
            <form onSubmit={handleScheduleVisit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '6px', border: '1px dashed var(--border-gold)', marginBottom: '20px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Property Listing *</label>
                <select required value={visitForm.propertyId} onChange={e => setVisitForm({ ...visitForm, propertyId: e.target.value })} className="form-input" style={{ width: '100%' }}>
                  <option value="">-- Choose Listing --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.location})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Visit Date & Time *</label>
                <input required type="datetime-local" value={visitForm.scheduledTime} onChange={e => setVisitForm({ ...visitForm, scheduledTime: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Transport Mode</label>
                <select value={visitForm.transportMode} onChange={e => setVisitForm({ ...visitForm, transportMode: e.target.value })} className="form-input" style={{ width: '100%' }}>
                  <option value="SELF">🚗 Self Drive</option>
                  <option value="VIP_CHAUFFEUR">✨ Guided Chauffeur Service</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'end' }}>
                <button type="submit" className="btn-gold" style={{ padding: '8px 16px' }}>Schedule Tour</button>
              </div>
            </form>

            {/* Visits List */}
            {visitsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}><Loader className="animate-spin" size={20} /></div>
            ) : visits.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '15px 0' }}>No site visits scheduled.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                {visits.map(v => (
                  <div key={v.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-muted)', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '0.85rem' }}>{v.property?.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        RM: {v.assignedAgent?.fullName} | Transport: <strong style={{ color: 'var(--gold-primary)' }}>{v.transportMode}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '4px' }}>Scheduled: {new Date(v.scheduledTime).toLocaleString()}</div>
                      {v.feedback && <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: '#2ec4b6', marginTop: '6px' }}>" {v.feedback} "</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'end' }}>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        background: v.status === 'COMPLETED' ? 'rgba(46,196,182,0.1)' : v.status === 'CHECKED_IN' ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)',
                        color: v.status === 'COMPLETED' ? '#2ec4b6' : v.status === 'CHECKED_IN' ? 'var(--gold-light)' : 'var(--text-muted)'
                      }}>
                        {v.status}
                      </span>
                      {v.status === 'SCHEDULED' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleVisitCheckIn(v.id)} className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>Check In</button>
                          <a 
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Namaste ${lead.name} ji! 👋\n\n24K Realtors ki taraf se aapka Private Site Tour scheduled hai:\n🏡 Property: ${v.property?.title}\n📅 Date & Time: ${new Date(v.scheduledTime).toLocaleString()}\n🚗 Transport: ${v.transportMode === 'VIP_CHAUFFEUR' ? 'Guided Chauffeur Service (Pickup arranged)' : 'Self Drive'}\n🧑‍💼 RM: ${v.assignedAgent?.fullName || 'Assigned Agent'}\n\nHum aapse reach out karenge. Please confirm if this time suits you. Dhanyawad! 🙏`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-gold"
                            style={{ 
                              padding: '4px 8px', 
                              fontSize: '0.72rem', 
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              background: 'linear-gradient(135deg, #25D366, #128C7E)',
                              border: 'none',
                              color: '#fff'
                            }}
                          >
                            💬 Invite
                          </a>
                        </div>
                      )}
                      {v.status === 'CHECKED_IN' && (
                        <button onClick={() => handleVisitComplete(v.id)} className="btn-gold" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>Complete Tour</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKINGS */}
        {activeSubTab === 'bookings' && (
          <div style={{ marginTop: '20px' }}>
            {/* Create Booking Form */}
            <form onSubmit={handleCreateBooking} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '6px', border: '1px dashed var(--border-gold)', marginBottom: '20px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Property Listing *</label>
                <select required value={bookingForm.propertyId} onChange={e => setBookingForm({ ...bookingForm, propertyId: e.target.value })} className="form-input" style={{ width: '100%' }}>
                  <option value="">-- Choose Property --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({formatPrice(p.price)})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Deal Price (INR) *</label>
                <input required type="number" placeholder="Deal Price" value={bookingForm.finalPrice} onChange={e => setBookingForm({ ...bookingForm, finalPrice: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Discount (INR)</label>
                <input type="number" placeholder="Discount" value={bookingForm.discountApplied} onChange={e => setBookingForm({ ...bookingForm, discountApplied: e.target.value })} className="form-input" />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                <input type="checkbox" id="payCheck" checked={bookingForm.paymentReceived} onChange={e => setBookingForm({ ...bookingForm, paymentReceived: e.target.checked })} style={{ cursor: 'pointer' }} />
                <label htmlFor="payCheck" style={{ fontSize: '0.75rem', cursor: 'pointer' }}>Payment Received</label>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'end' }}>
                <button type="submit" className="btn-gold" style={{ padding: '8px 16px' }}>Log Purchase Deal</button>
              </div>
            </form>

            {/* Bookings List */}
            {bookingsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}><Loader className="animate-spin" size={20} /></div>
            ) : bookings.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '15px 0' }}>No purchase deals logged.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                {bookings.map(b => (
                  <div key={b.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-muted)', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '0.85rem' }}>{b.property?.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        RM: {b.assignedUser?.fullName} | Price: <strong style={{ color: 'var(--text-light)' }}>{formatPrice(b.finalPrice)}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#2ec4b6', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <IndianRupee size={12} />
                        <span>Commission (2.0%): {formatPrice(b.commissionEarned)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'end' }}>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        background: b.paymentReceived ? 'rgba(46,196,182,0.1)' : 'rgba(212,175,55,0.1)',
                        color: b.paymentReceived ? '#2ec4b6' : 'var(--gold-light)'
                      }}>
                        {b.paymentReceived ? 'CONFIRMED' : 'RESERVED'}
                      </span>
                      {!b.paymentReceived && (
                        <button onClick={() => handleConfirmBooking(b.id)} className="btn-gold" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>Confirm Payout</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
