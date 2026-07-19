import React from 'react';
import { X, Sparkles, Loader } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function PropertyFormDrawer({
  isOpen,
  onClose,
  editingPropertyId,
  propertyForm,
  setPropertyForm,
  formSubmitLoading,
  onSubmit,
  onParseText,
  societies
}) {
  const [societySearch, setSocietySearch] = React.useState('');
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="crm-drawer">
      <div className="drawer-header">
        <h3 className="drawer-title">{editingPropertyId ? 'Update Property Listing' : 'Publish New Property Listing'}</h3>
        <button className="btn-outline" style={{ padding: '6px 12px' }} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Client-Side Smart Copy-Paste Parser */}
      {!editingPropertyId && (
        <div style={{ background: 'rgba(212, 175, 55, 0.04)', border: '1px dashed var(--border-gold)', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-light)', fontWeight: 600 }}>
            <Sparkles size={16} />
            <span>Smart Listing Auto-Fill Parser</span>
          </label>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Paste flat listing details text below (e.g. <i>"3 BHK premium flat in Hinjewadi, 1650 sqft, price 1.45 Cr, no brokerage"</i>) and click parse.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <textarea 
              id="rawParserInput"
              placeholder="Paste property text details from 99acres or WhatsApp messages..."
              className="form-input"
              rows="2"
              style={{ flexGrow: 1, resize: 'vertical' }}
            />
            <button 
              type="button" 
              onClick={onParseText} 
              className="btn-gold" 
              style={{ alignSelf: 'flex-end', height: '42px', padding: '0 16px' }}
            >
              Parse
            </button>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Property Title</label>
          <input type="text" name="title" className="form-input" required placeholder="e.g. 24K Opula 3 BHK Baner" value={propertyForm.title} onChange={e => setPropertyForm({...propertyForm, title: e.target.value})} />
        </div>

        <div className="form-group">
          <label className="form-label">Marketing Description</label>
          <textarea name="description" className="form-input" rows="3" placeholder="Description..." value={propertyForm.description} onChange={e => setPropertyForm({...propertyForm, description: e.target.value})} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Property Type</label>
            <select name="propertyType" value={propertyForm.propertyType} onChange={e => setPropertyForm({...propertyForm, propertyType: e.target.value})} className="form-input">
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <select name="transactionType" value={propertyForm.transactionType} onChange={e => setPropertyForm({...propertyForm, transactionType: e.target.value})} className="form-input">
              <option value="BUY">Buy (Outright)</option>
              <option value="RENT">Rent (Lease)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input type="number" name="price" className="form-input" required placeholder="e.g. 13500000" value={propertyForm.price} onChange={e => setPropertyForm({...propertyForm, price: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Area Size (Sq. Ft.)</label>
            <input type="number" name="areaSquareFeet" className="form-input" required placeholder="e.g. 1500" value={propertyForm.areaSquareFeet} onChange={e => setPropertyForm({...propertyForm, areaSquareFeet: e.target.value})} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Prime Location</label>
            <select name="location" value={propertyForm.location} onChange={e => setPropertyForm({...propertyForm, location: e.target.value})} className="form-input">
              <option value="BANER">Baner</option>
              <option value="WAKAD">Wakad</option>
              <option value="HINJEWADI">Hinjewadi</option>
              <option value="BALEWADI">Balewadi High Street</option>
              <option value="TATHAWADE">Tathawade</option>
              <option value="MAHALUNGE">Mahalunge</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Beds (BHK)</label>
            <input type="number" name="bedrooms" className="form-input" required value={propertyForm.bedrooms} onChange={e => setPropertyForm({...propertyForm, bedrooms: e.target.value})} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Bathrooms</label>
            <input type="number" name="bathrooms" className="form-input" required value={propertyForm.bathrooms} onChange={e => setPropertyForm({...propertyForm, bathrooms: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Listing Status</label>
            <select name="status" value={propertyForm.status} onChange={e => setPropertyForm({...propertyForm, status: e.target.value})} className="form-input">
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ gridColumn: '1 / -1', position: 'relative' }}>
            <label className="form-label">Linked Parent Society</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="🔍 Type to search society..." 
                  value={societySearch || (societies && societies.find(s => s.id === propertyForm.societyId) ? societies.find(s => s.id === propertyForm.societyId).name : '')}
                  onChange={e => {
                    setSocietySearch(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                />
                {dropdownOpen && (
                  <div className="searchable-select-popup">
                    <div 
                      className="searchable-select-option" 
                      onClick={() => {
                        setPropertyForm({ ...propertyForm, societyId: '' });
                        setSocietySearch('');
                        setDropdownOpen(false);
                      }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold', color: 'var(--gold-primary)' }}
                    >
                      None (Resale Standalone Property)
                    </div>
                    {societies && societies.filter(soc => 
                      soc.name.toLowerCase().includes(societySearch.toLowerCase()) || 
                      soc.location.toLowerCase().includes(societySearch.toLowerCase())
                    ).map(soc => (
                      <div 
                        key={soc.id} 
                        className="searchable-select-option" 
                        onClick={() => {
                          setPropertyForm({ ...propertyForm, societyId: soc.id });
                          setSocietySearch(soc.name);
                          setDropdownOpen(false);
                        }}
                      >
                        🏢 {soc.name} ({soc.location})
                      </div>
                    ))}
                    {societies && societies.filter(soc => 
                      soc.name.toLowerCase().includes(societySearch.toLowerCase()) || 
                      soc.location.toLowerCase().includes(societySearch.toLowerCase())
                    ).length === 0 && (
                      <div style={{ padding: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        No matching societies found.
                      </div>
                    )}
                  </div>
                )}
              </div>
              {dropdownOpen && (
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => setDropdownOpen(false)}
                  style={{ padding: '0 12px', height: '42px' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">RERA Permit ID</label>
            <input type="text" name="reraNumber" className="form-input" placeholder="e.g. RERA-PUN-PRM-24K123" value={propertyForm.reraNumber} onChange={e => setPropertyForm({...propertyForm, reraNumber: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Address</label>
            <input type="text" name="address" className="form-input" required placeholder="Address..." value={propertyForm.address} onChange={e => setPropertyForm({...propertyForm, address: e.target.value})} />
          </div>
        </div>

        <div className="form-row">
          <ImageUploader 
            label="Property Listing Image" 
            currentValue={propertyForm.imageUrl} 
            onUploadSuccess={(url) => setPropertyForm({ ...propertyForm, imageUrl: url })} 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Drone Walkthrough Video URL (embed format)</label>
            <input type="text" name="videoUrl" className="form-input" placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ" value={propertyForm.videoUrl} onChange={e => setPropertyForm({...propertyForm, videoUrl: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">3D Tour URL (Matterport embed link)</label>
            <input type="text" name="threeDTourUrl" className="form-input" placeholder="e.g. https://my.matterport.com/show/?m=JGPmBB6q58g" value={propertyForm.threeDTourUrl} onChange={e => setPropertyForm({...propertyForm, threeDTourUrl: e.target.value})} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Furnishing Status</label>
            <select name="furnishingStatus" value={propertyForm.furnishingStatus} onChange={e => setPropertyForm({...propertyForm, furnishingStatus: e.target.value})} className="form-input">
              <option value="FULLY_FURNISHED">Fully Furnished</option>
              <option value="SEMI_FURNISHED">Semi Furnished</option>
              <option value="UNFURNISHED">Unfurnished</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)', marginTop: '24px' }}>
              <input 
                type="checkbox" 
                checked={propertyForm.gasPipeline} 
                onChange={e => setPropertyForm({...propertyForm, gasPipeline: e.target.checked})} 
              />
              Piped Gas Connection (Gas Pipe)
            </label>
          </div>
        </div>

        {/* Promotional Badges Checkboxes */}
        <div className="form-group" style={{ display: 'flex', gap: '20px', margin: '15px 0', flexWrap: 'wrap' }}>
          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)' }}>
            <input 
              type="checkbox" 
              checked={propertyForm.verifiedListing} 
              onChange={e => setPropertyForm({...propertyForm, verifiedListing: e.target.checked})} 
            />
            Verified Listing
          </label>
          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)' }}>
            <input 
              type="checkbox" 
              checked={propertyForm.exclusiveDeal} 
              onChange={e => setPropertyForm({...propertyForm, exclusiveDeal: e.target.checked})} 
            />
            Exclusive Deal
          </label>
          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)' }}>
            <input 
              type="checkbox" 
              checked={propertyForm.noBrokerage} 
              onChange={e => setPropertyForm({...propertyForm, noBrokerage: e.target.checked})} 
            />
            No Brokerage
          </label>
        </div>

        <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={formSubmitLoading}>
          {formSubmitLoading ? <Loader className="animate-spin" size={20} /> : (editingPropertyId ? 'Update Listing' : 'Publish Listing')}
        </button>
      </form>
    </div>
  );
}
