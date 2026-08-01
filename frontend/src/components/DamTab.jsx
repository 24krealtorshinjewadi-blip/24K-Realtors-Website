import React, { useState, useEffect, useRef } from 'react';
import {
  Upload, HardDrive, File, Image as ImageIcon, Video, FileText,
  Search, Filter, Trash2, RefreshCw, Copy, Check, Eye, Lock, Unlock,
  Layers, Clock, ShieldCheck, Download, ExternalLink, Grid, List,
  AlertCircle, CheckCircle, Plus, X, Play, FileCheck, Tag, Info
} from 'lucide-react';
import { apiService } from '../services/apiService';

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: '🔥 All Assets', icon: HardDrive },
  { value: 'HERO', label: '🏞️ Hero Images', icon: ImageIcon },
  { value: 'GALLERY', label: '📷 Gallery Photos', icon: ImageIcon },
  { value: 'PROPERTY_VIDEO', label: '🎥 Property Videos', icon: Video },
  { value: 'WALKTHROUGH_VIDEO', label: '🎬 Walkthrough Videos', icon: Video },
  { value: 'DRONE_VIDEO', label: '🛸 Drone 4K Videos', icon: Video },
  { value: 'BROCHURE_PDF', label: '📄 Brochure PDFs', icon: FileText },
  { value: 'MASTER_PLAN', label: '🗺️ Master Plans', icon: FileText },
  { value: 'FLOOR_PLAN', label: '📐 Floor Blueprints', icon: FileText },
  { value: 'BUILDER_LOGO', label: '🏢 Builder Logos', icon: Tag },
  { value: 'COMPANY_LOGO', label: '🛡️ Company Branding', icon: Tag },
  { value: 'AVATAR', label: '👤 Employee Avatars', icon: Tag },
  { value: 'MARKETING', label: '📢 Marketing Creatives', icon: File },
  { value: 'SOCIAL', label: '📱 Social Media Media', icon: File },
];

export default function DamTab() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showTrash, setShowTrash] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Upload Modal / Drag-Drop State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('GALLERY');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadIsPrivate, setUploadIsPrivate] = useState(false);
  const [uploadPropertyId, setUploadPropertyId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Copy & Action Feedback
  const [copiedId, setCopiedId] = useState(null);
  const [previewAsset, setPreviewAsset] = useState(null);
  const [versionsModalAsset, setVersionsModalAsset] = useState(null);
  const [versionsList, setVersionsList] = useState([]);
  const [auditLogsAsset, setAuditLogsAsset] = useState(null);
  const [auditLogsList, setAuditLogsList] = useState([]);
  const [presignedUrlModal, setPresignedUrlModal] = useState(null);
  const [generatedSignedUrl, setGeneratedSignedUrl] = useState('');
  const [presignDuration, setPresignDuration] = useState(60);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAssets();
  }, [category, showTrash, page, searchTerm]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      if (showTrash) {
        const res = await apiService.fetchTrashDamAssets({ page, size: 24 });
        setAssets(res.content || []);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      } else {
        const res = await apiService.fetchDamAssets({
          category,
          search: searchTerm,
          page,
          size: 24
        });
        setAssets(res.content || []);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      }
    } catch (err) {
      console.error("Failed to load DAM assets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
      setShowUploadModal(true);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleExecuteUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    let successCount = 0;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        await apiService.uploadDamAsset(
          file,
          {
            title: uploadTitle || file.name,
            category: uploadCategory,
            isPrivate: uploadIsPrivate,
            propertyId: uploadPropertyId ? Number(uploadPropertyId) : null
          },
          (progress) => {
            const overall = Math.round(((i + progress / 100) / selectedFiles.length) * 100);
            setUploadProgress(overall);
          }
        );
        successCount++;
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
      }
    }

    setUploading(false);
    setShowUploadModal(false);
    setSelectedFiles([]);
    setUploadTitle('');
    setUploadProgress(0);
    loadAssets();
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Move this asset to trash?")) return;
    try {
      await apiService.softDeleteDamAsset(id);
      loadAssets();
    } catch (err) {
      alert("Failed to delete asset: " + err.message);
    }
  };

  const handleRestore = async (id) => {
    try {
      await apiService.restoreDamAsset(id);
      loadAssets();
    } catch (err) {
      alert("Failed to restore asset: " + err.message);
    }
  };

  const handlePurge = async (id) => {
    if (!window.confirm("PERMANENT ACTION: Permanently purge this asset from S3 and database?")) return;
    try {
      await apiService.purgeDamAsset(id);
      loadAssets();
    } catch (err) {
      alert("Failed to purge asset: " + err.message);
    }
  };

  const handleOpenVersions = async (asset) => {
    setVersionsModalAsset(asset);
    try {
      const list = await apiService.fetchDamVersions(asset.id);
      setVersionsList(list || []);
    } catch (err) {
      setVersionsList([]);
    }
  };

  const handleOpenAuditLogs = async (asset) => {
    setAuditLogsAsset(asset);
    try {
      const logs = await apiService.fetchDamAuditLogs(asset.id);
      setAuditLogsList(logs || []);
    } catch (err) {
      setAuditLogsList([]);
    }
  };

  const handleGeneratePresignedUrl = async (asset) => {
    setPresignedUrlModal(asset);
    setGeneratedSignedUrl('');
    try {
      const res = await apiService.getDamPresignedUrl(asset.id, presignDuration);
      setGeneratedSignedUrl(res.presignedUrl);
    } catch (err) {
      alert("Failed to generate presigned URL: " + err.message);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ color: '#fff', padding: '24px' }}>
      
      {/* ── 1. Top Header Banner & Metrics ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(7,15,30,0.85) 0%, rgba(12,24,48,0.95) 100%)',
        border: '1px solid rgba(230,195,92,0.25)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <HardDrive size={22} color="#E6C35C" />
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: '#fff', margin: 0 }}>
              Enterprise Digital Asset Management (DAM)
            </h2>
            <span style={{
              background: 'rgba(37, 211, 102, 0.15)',
              border: '1px solid rgba(37, 211, 102, 0.35)',
              color: '#25D366',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              AWS S3 Active
            </span>
          </div>
          <p style={{ color: 'var(--text-muted, #888)', fontSize: '0.82rem', margin: 0 }}>
            Single source of truth for 24K Realtors 4K Drone Videos, Floor Blueprints, RERA PDFs, & Luxury Media.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => { setShowTrash(!showTrash); setPage(0); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: showTrash ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
              border: showTrash ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.12)',
              color: showTrash ? '#EF4444' : '#fff',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}
          >
            <Trash2 size={15} />
            <span>{showTrash ? 'Exit Trash' : 'Trash Can'}</span>
          </button>

          <button
            onClick={() => { setShowUploadModal(true); setSelectedFiles([]); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)',
              color: '#040814',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.85rem',
              boxShadow: '0 4px 14px rgba(230,195,92,0.3)'
            }}
          >
            <Upload size={16} />
            <span>Upload New Assets</span>
          </button>
        </div>
      </div>

      {/* ── 2. Category Filter & Search Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
          {CATEGORY_OPTIONS.map(cat => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(0); }}
              style={{
                background: category === cat.value && !showTrash
                  ? 'rgba(230,195,92,0.18)'
                  : 'rgba(255,255,255,0.03)',
                border: category === cat.value && !showTrash
                  ? '1px solid #E6C35C'
                  : '1px solid rgba(255,255,255,0.1)',
                color: category === cat.value && !showTrash ? '#E6C35C' : 'rgba(255,255,255,0.7)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#888" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search filename or title..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '6px 12px 6px 30px',
                color: '#fff',
                fontSize: '0.8rem',
                width: '200px'
              }}
            />
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#fff',
              cursor: 'pointer'
            }}
            title="Toggle View Mode"
          >
            {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
          </button>
        </div>
      </div>

      {/* ── 3. Asset Grid / List View ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
          <RefreshCw className="animate-spin" size={32} color="#E6C35C" />
          <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>Fetching DAM Assets from S3 & PostgreSQL...</p>
        </div>
      ) : assets.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <HardDrive size={40} color="#555" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1rem', color: '#ccc', margin: '0 0 6px' }}>No Assets Found</h3>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>
            {showTrash ? 'Trash can is currently empty.' : 'Upload images, videos, or PDFs to get started.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: viewMode === 'grid' ? 'grid' : 'flex',
          flexDirection: viewMode === 'grid' ? 'unset' : 'column',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {assets.map(asset => (
            <div
              key={asset.id}
              style={{
                background: 'rgba(7, 15, 30, 0.75)',
                border: '1px solid rgba(197, 168, 128, 0.22)',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: viewMode === 'grid' ? 'column' : 'row',
                alignItems: viewMode === 'grid' ? 'stretch' : 'center',
                padding: viewMode === 'grid' ? '0' : '10px 16px',
                gap: viewMode === 'grid' ? '0' : '16px'
              }}
            >
              {/* Media Preview Container */}
              <div style={{
                height: viewMode === 'grid' ? '160px' : '60px',
                width: viewMode === 'grid' ? '100%' : '80px',
                position: 'relative',
                background: '#040814',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {asset.mimeType?.startsWith('video/') ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={asset.thumbnailUrl || '/gallery_tower_2.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                    <Play size={28} color="#E6C35C" style={{ position: 'absolute' }} />
                  </div>
                ) : asset.mimeType === 'application/pdf' ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)' }}>
                    <FileText size={32} color="#EF4444" />
                    <span style={{ fontSize: '0.65rem', color: '#EF4444', fontWeight: 800, marginTop: '4px' }}>PDF DOCUMENT</span>
                  </div>
                ) : (
                  <img
                    src={asset.thumbnailUrl || asset.cdnUrl}
                    alt={asset.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {/* Category Badge */}
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(4,8,20,0.85)',
                  border: '1px solid rgba(230,195,92,0.3)',
                  color: '#E6C35C',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {asset.category}
                </span>

                {asset.isPrivate && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(239,68,68,0.9)',
                    color: '#fff',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <Lock size={10} /> PRIVATE
                  </span>
                )}
              </div>

              {/* Asset Metadata */}
              <div style={{ padding: viewMode === 'grid' ? '12px' : '0', flex: 1, overflow: 'hidden' }}>
                <h4 style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {asset.title}
                </h4>

                <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: '#888', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span>{formatBytes(asset.fileSizeBytes)}</span>
                  {asset.width && asset.height && <span>• {asset.width}x{asset.height}</span>}
                  <span>• v{asset.versionNumber || 1}</span>
                </div>

                {/* Action Buttons Toolbar */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleCopyUrl(asset.cdnUrl, asset.id)}
                    style={{
                      background: copiedId === asset.id ? 'rgba(37,211,102,0.2)' : 'rgba(255,255,255,0.05)',
                      border: copiedId === asset.id ? '1px solid #25D366' : '1px solid rgba(255,255,255,0.1)',
                      color: copiedId === asset.id ? '#25D366' : '#ccc',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Copy CDN URL"
                  >
                    {copiedId === asset.id ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <button
                    onClick={() => setPreviewAsset(asset)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ccc',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                    title="Preview Media"
                  >
                    <Eye size={12} />
                  </button>

                  {asset.isPrivate && (
                    <button
                      onClick={() => handleGeneratePresignedUrl(asset)}
                      style={{
                        background: 'rgba(230,195,92,0.15)',
                        border: '1px solid rgba(230,195,92,0.3)',
                        color: '#E6C35C',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Generate Presigned URL"
                    >
                      <Lock size={12} /> Signed URL
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenVersions(asset)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ccc',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                    title="Version History"
                  >
                    <Layers size={12} />
                  </button>

                  <button
                    onClick={() => handleOpenAuditLogs(asset)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ccc',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                    title="Audit Logs"
                  >
                    <Clock size={12} />
                  </button>

                  {showTrash ? (
                    <>
                      <button
                        onClick={() => handleRestore(asset.id)}
                        style={{
                          background: 'rgba(37,211,102,0.15)',
                          border: '1px solid #25D366',
                          color: '#25D366',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.72rem',
                          cursor: 'pointer'
                        }}
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handlePurge(asset.id)}
                        style={{
                          background: 'rgba(239,68,68,0.15)',
                          border: '1px solid #EF4444',
                          color: '#EF4444',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.72rem',
                          cursor: 'pointer'
                        }}
                      >
                        Purge
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleSoftDelete(asset.id)}
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#EF4444',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '0.72rem',
                        cursor: 'pointer'
                      }}
                      title="Move to Trash"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 4. Upload Modal ── */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'rgba(10,18,36,0.95)',
            border: '1px solid rgba(230,195,92,0.3)',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '520px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} color="#E6C35C" /> Upload Assets to AWS S3
              </h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Drag Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: dragActive ? '2px dashed #E6C35C' : '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '10px',
                padding: '30px',
                textAlign: 'center',
                background: dragActive ? 'rgba(230,195,92,0.08)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <Upload size={32} color="#E6C35C" style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '0.85rem', color: '#fff', margin: '0 0 4px' }}>
                Drag & Drop files here, or <span style={{ color: '#E6C35C', textDecoration: 'underline' }}>Browse</span>
              </p>
              <p style={{ fontSize: '0.72rem', color: '#888', margin: 0 }}>
                Supports Images, 4K Videos (MP4/WEBM), & PDFs
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div style={{ marginBottom: '16px', fontSize: '0.8rem', color: '#25D366', fontWeight: 600 }}>
                ✓ {selectedFiles.length} file(s) selected ({selectedFiles.map(f => f.name).join(', ')})
              </div>
            )}

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>Asset Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.82rem' }}
                >
                  {CATEGORY_OPTIONS.filter(c => c.value !== 'ALL').map(c => (
                    <option key={c.value} value={c.value} style={{ background: '#070F1E', color: '#fff' }}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>Custom Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Hinjewadi Phase 3 Drone View"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="private-check"
                  checked={uploadIsPrivate}
                  onChange={(e) => setUploadIsPrivate(e.target.checked)}
                />
                <label htmlFor="private-check" style={{ fontSize: '0.8rem', color: '#ccc', cursor: 'pointer' }}>
                  Private Asset (Requires Presigned URL to access)
                </label>
              </div>
            </div>

            {uploading && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#E6C35C', marginBottom: '4px' }}>
                  <span>Uploading to AWS S3...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #FFF4D0, #E6C35C)', transition: 'width 0.2s' }} />
                </div>
              </div>
            )}

            <button
              disabled={uploading || selectedFiles.length === 0}
              onClick={handleExecuteUpload}
              style={{
                width: '100%',
                background: uploading || selectedFiles.length === 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)',
                color: uploading || selectedFiles.length === 0 ? '#666' : '#040814',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: uploading || selectedFiles.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? 'Uploading...' : 'Start S3 Upload'}
            </button>
          </div>
        </div>
      )}

      {/* ── 5. Full Screen Preview Modal ── */}
      {previewAsset && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', background: '#040814', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(230,195,92,0.3)' }}>
            <button onClick={() => setPreviewAsset(null)} style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            {previewAsset.mimeType?.startsWith('video/') ? (
              <video src={previewAsset.cdnUrl} controls autoPlay style={{ maxWidth: '85vw', maxHeight: '80vh' }} />
            ) : previewAsset.mimeType === 'application/pdf' ? (
              <iframe src={previewAsset.cdnUrl} title="PDF Preview" style={{ width: '80vw', height: '80vh', border: 'none' }} />
            ) : (
              <img src={previewAsset.cdnUrl} alt="" style={{ maxWidth: '85vw', maxHeight: '80vh', objectFit: 'contain' }} />
            )}
          </div>
        </div>
      )}

      {/* ── 6. Presigned URL Generator Modal ── */}
      {presignedUrlModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0A1224', border: '1px solid rgba(230,195,92,0.3)', borderRadius: '12px', padding: '24px', maxWidth: '480px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', color: '#E6C35C', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={16} /> Private S3 Signed Link
              </h3>
              <button onClick={() => setPresignedUrlModal(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '6px' }}>Validity Duration</label>
              <select
                value={presignDuration}
                onChange={(e) => {
                  setPresignDuration(Number(e.target.value));
                  handleGeneratePresignedUrl(presignedUrlModal);
                }}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', borderRadius: '6px' }}
              >
                <option value={15} style={{ background: '#070F1E' }}>15 Minutes</option>
                <option value={60} style={{ background: '#070F1E' }}>1 Hour (60 Mins)</option>
                <option value={1440} style={{ background: '#070F1E' }}>24 Hours</option>
              </select>
            </div>

            {generatedSignedUrl && (
              <div>
                <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>Signed Temporary URL</label>
                <textarea
                  readOnly
                  value={generatedSignedUrl}
                  style={{ width: '100%', height: '80px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#25D366', fontSize: '0.72rem', borderRadius: '6px', padding: '8px' }}
                />
                <button
                  onClick={() => handleCopyUrl(generatedSignedUrl, 'presigned')}
                  style={{ width: '100%', marginTop: '8px', background: '#E6C35C', color: '#040814', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Copy Signed URL
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 7. Versions History Drawer ── */}
      {versionsModalAsset && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0A1224', border: '1px solid rgba(230,195,92,0.3)', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="#E6C35C" /> Version History: {versionsModalAsset.title}
              </h3>
              <button onClick={() => setVersionsModalAsset(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {versionsList.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.8rem' }}>No version history recorded.</p>
              ) : versionsList.map(v => (
                <div key={v.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E6C35C' }}>Version {v.versionNumber}</div>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>{formatBytes(v.fileSizeBytes)} • {v.createdBy}</div>
                  </div>
                  <button onClick={() => handleCopyUrl(v.cdnUrl, v.id)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc', borderRadius: '4px', padding: '4px 8px', fontSize: '0.72rem', cursor: 'pointer' }}>
                    Copy Link
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 8. Audit Logs Modal ── */}
      {auditLogsAsset && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0A1224', border: '1px solid rgba(230,195,92,0.3)', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#E6C35C" /> Audit Logs: {auditLogsAsset.title}
              </h3>
              <button onClick={() => setAuditLogsAsset(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {auditLogsList.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.8rem' }}>No audit logs recorded for this asset.</p>
              ) : auditLogsList.map(log => (
                <div key={log.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#E6C35C', fontWeight: 700 }}>
                    <span>{log.action}</span>
                    <span style={{ color: '#888', fontWeight: 400 }}>{log.performedBy}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#ccc', marginTop: '4px' }}>{log.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
