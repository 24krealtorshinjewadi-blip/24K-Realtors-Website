import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Plus, Search, Building, Landmark, Loader, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function SocietiesTab() {
  const [societies, setSocieties] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeSubTab, setActiveSubTab] = useState('societies'); // societies | builders
  const [showAddSocForm, setShowAddSocForm] = useState(false);
  const [showAddBuilderForm, setShowAddBuilderForm] = useState(false);
  const [editingSocId, setEditingSocId] = useState(null);

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
    builderId: '',
    galleryUrls: '',
    masterPlanUrl: '',
    floorPlanUrls: '',
    seoTitle: '',
    seoDescription: ''
  });

  const [faqsList, setFaqsList] = useState([{ question: '', answer: '' }]);

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
      
      // Filter out empty FAQs
      const filteredFaqs = faqsList.filter(f => f.question.trim() && f.answer.trim());
      
      const payload = {
        ...socForm,
        developer: selectedBuilder ? selectedBuilder.name : socForm.developer,
        startingPrice: Number(socForm.startingPrice),
        faqs: filteredFaqs.length > 0 ? JSON.stringify(filteredFaqs) : ''
      };

      if (editingSocId) {
        await apiService.updateSociety(editingSocId, payload);
      } else {
        await apiService.createSociety(payload);
      }

      setShowAddSocForm(false);
      setEditingSocId(null);
      resetSocForm();
      fetchData();
    } catch (err) {
      alert(`Failed to save society: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetSocForm = () => {
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
      builderId: '',
      galleryUrls: '',
      masterPlanUrl: '',
      floorPlanUrls: '',
      seoTitle: '',
      seoDescription: ''
    });
    setFaqsList([{ question: '', answer: '' }]);
  };

  const handleEditClick = (soc) => {
    setEditingSocId(soc.id);
    
    // Parse FAQs if present
    let parsedFaqs = [{ question: '', answer: '' }];
    if (soc.faqs) {
      try {
        parsedFaqs = JSON.parse(soc.faqs);
        if (!Array.isArray(parsedFaqs) || parsedFaqs.length === 0) {
          parsedFaqs = [{ question: '', answer: '' }];
        }
      } catch (e) {
        console.warn("Could not parse FAQs JSON. Falling back to default list.", e);
      }
    }

    setSocForm({
      name: soc.name || '',
      location: soc.location || 'BANER',
      developer: soc.developer || '',
      reraNumber: soc.reraNumber || '',
      projectStatus: soc.projectStatus || 'UNDER_CONSTRUCTION',
      startingPrice: soc.startingPrice || '',
      possessionDate: soc.possessionDate || '',
      overview: soc.overview || '',
      amenities: soc.amenities || '',
      builderId: soc.builder?.id || '',
      galleryUrls: soc.galleryUrls || '',
      masterPlanUrl: soc.masterPlanUrl || '',
      floorPlanUrls: soc.floorPlanUrls || '',
      seoTitle: soc.seoTitle || '',
      seoDescription: soc.seoDescription || ''
    });
    setFaqsList(parsedFaqs);
    setShowAddSocForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this society? This will hide it from Listings.")) return;
    try {
      await apiService.deleteSociety(id);
      fetchData();
    } catch (err) {
      alert(`Failed to delete society: ${err.message}`);
    }
  };

  // FAQ handlers
  const handleFaqChange = (index, field, value) => {
    const list = [...faqsList];
    list[index][field] = value;
    setFaqsList(list);
  };

  const addFaqRow = () => {
    setFaqsList([...faqsList, { question: '', answer: '' }]);
  };

  const removeFaqRow = (index) => {
    const list = [...faqsList];
    list.splice(index, 1);
    setFaqsList(list.length > 0 ? list : [{ question: '', answer: '' }]);
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
          onClick={() => { setActiveSubTab('societies'); setShowAddSocForm(false); setEditingSocId(null); resetSocForm(); setShowAddBuilderForm(false); }}
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
          onClick={() => { setActiveSubTab('builders'); setShowAddSocForm(false); setEditingSocId(null); resetSocForm(); setShowAddBuilderForm(false); }}
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
              <button 
                onClick={() => { 
                  if (showAddSocForm && editingSocId) {
                    resetSocForm();
                    setEditingSocId(null);
                  } else {
                    setShowAddSocForm(!showAddSocForm); 
                  }
                }} 
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                {editingSocId ? 'Cancel Editing' : 'Register Society'}
              </button>
              <button onClick={fetchData} className="btn-outline" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Add/Edit Society Form */}
          {showAddSocForm && (
            <div className="exclusive-details-card" style={{ marginBottom: '25px', padding: '20px', background: 'rgba(7,15,30,0.85)', border: '1px solid var(--border-gold)' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: 'var(--gold-primary)' }}>
                {editingSocId ? 'Edit Society Details' : 'New Society Onboarding'}
              </h3>
              <form onSubmit={handleAddSociety}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  
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

                  <div className="form-group">
                    <label className="form-label">Amenities List (comma-separated)</label>
                    <input type="text" placeholder="e.g. Infinity Pool, Clubhouse, Gym" value={socForm.amenities} onChange={e => setSocForm({ ...socForm, amenities: e.target.value })} className="form-input" />
                  </div>
                </div>

                {/* Society Overview */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Society Overview</label>
                  <textarea placeholder="Write brief marketing introduction about the society..." value={socForm.overview} onChange={e => setSocForm({ ...socForm, overview: e.target.value })} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} />
                </div>

                {/* Image Uploaders Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  <ImageUploader 
                    label="Gallery cover image" 
                    currentValue={socForm.galleryUrls} 
                    onUploadSuccess={(url) => setSocForm({ ...socForm, galleryUrls: url })} 
                  />
                  <ImageUploader 
                    label="Master Plan image" 
                    currentValue={socForm.masterPlanUrl} 
                    onUploadSuccess={(url) => setSocForm({ ...socForm, masterPlanUrl: url })} 
                  />
                  <ImageUploader 
                    label="Floor Plan image" 
                    currentValue={socForm.floorPlanUrls} 
                    onUploadSuccess={(url) => setSocForm({ ...socForm, floorPlanUrls: url })} 
                  />
                </div>

                {/* SEO Metadata Block */}
                <div style={{ border: '1px solid rgba(212, 175, 55, 0.2)', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.01)' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--gold-primary)', fontWeight: 600 }}>SEO Metadata Optimization</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">SEO Meta Title</label>
                      <input type="text" placeholder="Recommended length: 50-60 characters" value={socForm.seoTitle} onChange={e => setSocForm({ ...socForm, seoTitle: e.target.value })} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SEO Meta Description</label>
                      <textarea placeholder="Recommended length: 150-160 characters" rows="2" value={socForm.seoDescription} onChange={e => setSocForm({ ...socForm, seoDescription: e.target.value })} className="form-input" style={{ resize: 'vertical' }} />
                    </div>
                  </div>
                </div>

                {/* FAQs Manager */}
                <div style={{ border: '1px solid rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>Frequently Asked Questions (FAQs)</h4>
                    <button type="button" onClick={addFaqRow} className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                      + Add FAQ
                    </button>
                  </div>
                  
                  {faqsList.map((faq, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input 
                          type="text" 
                          placeholder="Question (e.g. What is the carpet area?)" 
                          value={faq.question} 
                          onChange={(e) => handleFaqChange(index, 'question', e.target.value)} 
                          className="form-input" 
                        />
                        <textarea 
                          placeholder="Answer details..." 
                          rows="1"
                          value={faq.answer} 
                          onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} 
                          className="form-input"
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFaqRow(index)} 
                        className="btn-outline"
                        style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '8px 12px', height: '42px' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                  <button type="button" onClick={() => { setShowAddSocForm(false); setEditingSocId(null); resetSocForm(); }} className="btn-outline">Cancel</button>
                  <button type="submit" disabled={submitLoading} className="btn-gold">
                    {submitLoading ? 'Saving...' : (editingSocId ? 'Save Changes' : 'Register Society')}
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
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {societies.map(soc => (
                    <tr key={soc.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {soc.galleryUrls && (
                            <img 
                              src={soc.galleryUrls.startsWith('/') ? `${apiService.BASE_URL.replace('/api/v1', '')}${soc.galleryUrls}` : soc.galleryUrls} 
                              alt="Soc" 
                              style={{ width: '32px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} 
                            />
                          )}
                          <span>{soc.name}</span>
                        </div>
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
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleEditClick(soc)} 
                            className="btn-outline" 
                            style={{ padding: '6px 8px', borderColor: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-primary)' }}
                            title="Edit Society"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(soc.id)} 
                            className="btn-outline" 
                            style={{ padding: '6px 8px', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}
                            title="Delete Society"
                          >
                            <Trash2 size={12} />
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
