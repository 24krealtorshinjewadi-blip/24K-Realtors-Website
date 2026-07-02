import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Plus, Search, Building, Landmark, Loader, RefreshCw } from 'lucide-react';

export default function SocietiesTab() {
  const [societies, setSocieties] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeSubTab, setActiveSubTab] = useState('societies'); // societies | builders
  const [showAddSocForm, setShowAddSocForm] = useState(false);
  const [showAddBuilderForm, setShowAddBuilderForm] = useState(false);

  // Forms states
  const [socForm, setSocForm] = useState({
    name: '',
    location: 'BANER',
    developer: '',
    reraNumber: '',
    projectStatus: 'UNDER_CONSTRUCTION',
    startingPrice: '',
    possessionDate: '',
    overview: '',
    amenities: '',
    builderId: ''
  });

  const [builderForm, setBuilderForm] = useState({
    name: '',
    description: '',
    experienceYears: '',
    completedProjectsCount: '',
    ongoingProjectsCount: '',
    awards: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const socData = await apiService.getSocieties(0, 100);
      setSocieties(socData.content || []);

      const builderData = await apiService.getBuilders();
      setBuilders(builderData || []);
    } catch (err) {
      console.error("Failed to fetch societies/builders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSociety = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const selectedBuilder = builders.find(b => b.id === socForm.builderId);
      const payload = {
        ...socForm,
        developer: selectedBuilder ? selectedBuilder.name : socForm.developer,
        startingPrice: Number(socForm.startingPrice)
      };
      await apiService.createSociety(payload);
      setShowAddSocForm(false);
      setSocForm({
        name: '',
        location: 'BANER',
        developer: '',
        reraNumber: '',
        projectStatus: 'UNDER_CONSTRUCTION',
        startingPrice: '',
        possessionDate: '',
        overview: '',
        amenities: '',
        builderId: ''
      });
      fetchData();
    } catch (err) {
      alert(`Failed to add society: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddBuilder = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = {
        ...builderForm,
        experienceYears: Number(builderForm.experienceYears),
        completedProjectsCount: Number(builderForm.completedProjectsCount),
        ongoingProjectsCount: Number(builderForm.ongoingProjectsCount)
      };
      await apiService.createBuilder(payload);
      setShowAddBuilderForm(false);
      setBuilderForm({
        name: '',
        description: '',
        experienceYears: '',
        completedProjectsCount: '',
        ongoingProjectsCount: '',
        awards: ''
      });
      fetchData();
    } catch (err) {
      alert(`Failed to create builder profile: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatPrice = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  return (
    <div style={{ animation: 'slideDown 0.3s forwards' }}>
      
      {/* Sub-tabs Selection Row */}
      <div style={{ display: 'flex', gap: '15px', borderBottom: '1px solid var(--border-muted)', marginBottom: '25px', paddingBottom: '10px' }}>
        <button 
          onClick={() => { setActiveSubTab('societies'); setShowAddSocForm(false); setShowAddBuilderForm(false); }}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'societies' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            paddingBottom: '8px',
            borderBottom: activeSubTab === 'societies' ? '2px solid var(--gold-primary)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Building size={16} />
          Societies Registry
        </button>
        <button 
          onClick={() => { setActiveSubTab('builders'); setShowAddSocForm(false); setShowAddBuilderForm(false); }}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'builders' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            paddingBottom: '8px',
            borderBottom: activeSubTab === 'builders' ? '2px solid var(--gold-primary)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Landmark size={16} />
          Developers Directory
        </button>
      </div>

      {activeSubTab === 'societies' ? (
        <div>
          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 className="luxury-title" style={{ fontSize: '1.2rem', margin: 0 }}>⚜️ Registered Societies</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowAddSocForm(!showAddSocForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />
                Register Society
              </button>
              <button onClick={fetchData} className="btn-outline" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Add Society Form */}
          {showAddSocForm && (
            <div className="exclusive-details-card" style={{ marginBottom: '25px', padding: '20px', background: 'rgba(7,15,30,0.85)' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: 'var(--gold-primary)' }}>New Society Onboarding</h3>
              <form onSubmit={handleAddSociety} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                
                <div className="form-group">
                  <label className="form-label">Society Name *</label>
                  <input required type="text" placeholder="e.g. 24K Opula" value={socForm.name} onChange={e => setSocForm({ ...socForm, name: e.target.value })} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">RERA Registration *</label>
                  <input required type="text" placeholder="e.g. RERA-PUN-PRM-24K091" value={socForm.reraNumber} onChange={e => setSocForm({ ...socForm, reraNumber: e.target.value })} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Location Corridor *</label>
                  <select value={socForm.location} onChange={e => setSocForm({ ...socForm, location: e.target.value })} className="form-input" style={{ width: '100%' }}>
                    <option value="BANER">Baner</option>
                    <option value="WAKAD">Wakad</option>
                    <option value="HINJEWADI">Hinjewadi</option>
                    <option value="BALEWADI">Balewadi</option>
                    <option value="KHARADI">Kharadi</option>
                    <option value="TATHAWADE">Tathawade</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Associated Builder/Developer *</label>
                  <select required value={socForm.builderId} onChange={e => setSocForm({ ...socForm, builderId: e.target.value })} className="form-input" style={{ width: '100%' }}>
                    <option value="">Select Developer...</option>
                    {builders.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Starting Valuation (INR) *</label>
                  <input required type="number" placeholder="e.g. 14500000" value={socForm.startingPrice} onChange={e => setSocForm({ ...socForm, startingPrice: e.target.value })} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Construction Status *</label>
                  <select value={socForm.projectStatus} onChange={e => setSocForm({ ...socForm, projectStatus: e.target.value })} className="form-input" style={{ width: '100%' }}>
                    <option value="READY_TO_MOVE">Ready to Move</option>
                    <option value="UNDER_CONSTRUCTION">Under Construction</option>
                    <option value="NEW_LAUNCH">New Launch</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Possession Date</label>
                  <input type="text" placeholder="e.g. December 2025" value={socForm.possessionDate} onChange={e => setSocForm({ ...socForm, possessionDate: e.target.value })} className="form-input" />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Amenities List (comma-separated)</label>
                  <input type="text" placeholder="e.g. Infinity Pool, Clubhouse, Gym" value={socForm.amenities} onChange={e => setSocForm({ ...socForm, amenities: e.target.value })} className="form-input" />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Society Overview</label>
                  <textarea placeholder="Write brief marketing introduction about the society..." value={socForm.overview} onChange={e => setSocForm({ ...socForm, overview: e.target.value })} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowAddSocForm(false)} className="btn-outline">Cancel</button>
                  <button type="submit" disabled={submitLoading} className="btn-gold">
                    {submitLoading ? 'Registering...' : 'Add Society'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List/Table */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Loader className="animate-spin" size={24} color="#D4AF37" />
            </div>
          ) : societies.length === 0 ? (
            <div className="empty-state">No societies registered. Click "Register Society" to begin.</div>
          ) : (
            <div className="table-responsive">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Society Details</th>
                    <th>Developer</th>
                    <th>Starting Valuation</th>
                    <th>RERA Index</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {societies.map(soc => (
                    <tr key={soc.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{soc.name}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {soc.location}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {soc.developer || soc.builder?.name || 'N/A'}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--gold-primary)' }}>
                        {formatPrice(soc.startingPrice)}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {soc.reraNumber}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem',
                          background: soc.projectStatus === 'READY_TO_MOVE' ? 'rgba(46,196,182,0.1)' : 'rgba(212,175,55,0.1)',
                          color: soc.projectStatus === 'READY_TO_MOVE' ? '#2ec4b6' : 'var(--gold-primary)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          textTransform: 'capitalize'
                        }}>
                          {soc.projectStatus.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Builders tab Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 className="luxury-title" style={{ fontSize: '1.2rem', margin: 0 }}>⚜️ Registered Builders</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowAddBuilderForm(!showAddBuilderForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />
                Register Developer
              </button>
              <button onClick={fetchData} className="btn-outline" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Add Builder Form */}
          {showAddBuilderForm && (
            <div className="exclusive-details-card" style={{ marginBottom: '25px', padding: '20px', background: 'rgba(7,15,30,0.85)' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: 'var(--gold-primary)' }}>New Developer Onboarding</h3>
              <form onSubmit={handleAddBuilder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                
                <div className="form-group">
                  <label className="form-label">Developer/Builder Name *</label>
                  <input required type="text" placeholder="e.g. Pride Purple Group" value={builderForm.name} onChange={e => setBuilderForm({ ...builderForm, name: e.target.value })} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input type="number" placeholder="e.g. 20" value={builderForm.experienceYears} onChange={e => setBuilderForm({ ...builderForm, experienceYears: e.target.value })} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Completed Projects Count</label>
                  <input type="number" placeholder="e.g. 35" value={builderForm.completedProjectsCount} onChange={e => setBuilderForm({ ...builderForm, completedProjectsCount: e.target.value })} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Ongoing Projects Count</label>
                  <input type="number" placeholder="e.g. 8" value={builderForm.ongoingProjectsCount} onChange={e => setBuilderForm({ ...builderForm, ongoingProjectsCount: e.target.value })} className="form-input" />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Awards & Key Accolades</label>
                  <input type="text" placeholder="e.g. Best Luxury Developer Pune 2025" value={builderForm.awards} onChange={e => setBuilderForm({ ...builderForm, awards: e.target.value })} className="form-input" />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Developer Description</label>
                  <textarea placeholder="Write introduction summary about developer background..." value={builderForm.description} onChange={e => setBuilderForm({ ...builderForm, description: e.target.value })} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowAddBuilderForm(false)} className="btn-outline">Cancel</button>
                  <button type="submit" disabled={submitLoading} className="btn-gold">
                    {submitLoading ? 'Registering...' : 'Register Developer'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Builder List */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Loader className="animate-spin" size={24} color="#D4AF37" />
            </div>
          ) : builders.length === 0 ? (
            <div className="empty-state">No developer profile created. Click "Register Developer" to start.</div>
          ) : (
            <div className="table-responsive">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Developer</th>
                    <th>Experience</th>
                    <th>Projects Completed</th>
                    <th>Ongoing Projects</th>
                    <th>Awards</th>
                  </tr>
                </thead>
                <tbody>
                  {builders.map(b => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{b.name}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>slug: {b.slug}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {b.experienceYears ? `${b.experienceYears} Years` : 'N/A'}
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{b.completedProjectsCount || 0}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{b.ongoingProjectsCount || 0}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--gold-primary)' }}>
                        {b.awards || 'None registered'}
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
  );
}
