import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { 
  X, Sparkles, IndianRupee, Loader
} from 'lucide-react';

export default function LeadDetailsEx({ lead, onClose, agents, properties: initialProperties, fetchLeads, fetchStats }) {
  const [activeSubTab, setActiveSubTab] = useState('timeline'); // timeline | sitevisits | bookings
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
      await apiService.logLeadActivity(lead.id, activityForm);
      setActivityForm({ type: 'NOTE', subject: '', details: '' });
      fetchTimeline();
      fetchLeads && fetchLeads(); // update dashboard score
    } catch (err) {
      alert(`Failed to log activity: ${err.message}`);
    }
  };

  // Schedule Visit
  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    try {
      const agent = agents.find(a => a.phone === lead.assignedAgentPhone) || agents[0];
      if (!agent) {
        alert("Please assign a relationship manager to this lead first.");
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
    } catch (err) {
      alert(`Failed to schedule visit: ${err.message}`);
    }
  };

  // Check In Visit
  const handleVisitCheckIn = async (visitId) => {
    try {
      await apiService.recordVisitCheckIn(visitId, 18.5590, 73.7868);
      fetchVisitsAndBookings();
      fetchTimeline();
    } catch (err) {
      alert(`Check-in failed: ${err.message}`);
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
    } catch (err) {
      alert(`Failed to complete site visit: ${err.message}`);
    }
  };

  // Create Booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const agent = agents.find(a => a.phone === lead.assignedAgentPhone) || agents[0];
      if (!agent) {
        alert("Please assign a relationship manager to this lead first.");
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
    } catch (err) {
      alert(`Failed to create booking: ${err.message}`);
    }
  };

  // Confirm Booking
  const handleConfirmBooking = async (id) => {
    try {
      await apiService.confirmBooking(id);
      fetchVisitsAndBookings();
      fetchTimeline();
      fetchStats && fetchStats();
    } catch (err) {
      alert(`Failed to confirm booking: ${err.message}`);
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

  // Calculate score helper from lead fields
  const score = lead.leadScore || 50;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(7,15,30,0.85)', zIndex: 1000, padding: '20px' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#070f1e', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '28px', color: 'var(--text-light)', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}><X size={20} /></button>

        <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 6px 0', fontSize: '1.5rem' }}>{lead.name}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-muted)', paddingBottom: '15px', margin: 0 }}>
          Lead ID: {lead.id} | Phone: {lead.phone} | Email: {lead.email}
        </p>

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
                {timeline.map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', borderLeft: '3px solid var(--gold-primary)', padding: '12px', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--gold-primary)' }}>{item.activityType}</span>
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{item.subject}</div>
                  </div>
                ))}
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
                  <option value="VIP_CHAUFFEUR">✨ VIP Chauffeur Service</option>
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
                        <button onClick={() => handleVisitCheckIn(v.id)} className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>Check In</button>
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
