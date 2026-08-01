import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function ImageUploader({ onUploadSuccess, label = 'Upload Image', currentValue = '', folder = 'properties', accept = 'image/*' }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successUrl, setSuccessUrl] = useState(currentValue);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;

    // Validate file type based on accept prop
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isPdf   = file.type === 'application/pdf';

    if (!isImage && !isVideo && !isPdf) {
      setError('Only image, video, or PDF files are allowed.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      // Pass folder to S3 — 'properties' | 'gallery' | 'documents' | 'videos'
      const uploadFolder = isVideo ? 'videos' : isPdf ? 'documents' : folder;
      const response = await apiService.uploadMedia(file, uploadFolder);
      // Backend returns S3 URL: https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/folder/uuid.ext
      const uploadedUrl = response.url;
      setSuccessUrl(uploadedUrl);
      if (onUploadSuccess) {
        onUploadSuccess(uploadedUrl);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || 'Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };


  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setSuccessUrl('');
    if (onUploadSuccess) {
      onUploadSuccess('');
    }
  };

  // Sync if currentValue changes from parent
  React.useEffect(() => {
    if (currentValue !== successUrl) {
      setSuccessUrl(currentValue);
    }
  }, [currentValue, successUrl]);

  return (
    <div className="form-group" style={{ marginBottom: '16px' }}>
      <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-light)', marginBottom: '8px', display: 'block' }}>
        {label}
      </label>

      {successUrl ? (
        // Preview State
        <div style={{
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--border-gold, rgba(212, 175, 55, 0.4))',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img 
            src={successUrl.startsWith('/') ? `${apiService.BASE_URL.replace('/api/v1', '')}${successUrl}` : successUrl} 
            alt={`Uploaded preview for ${label}`} 
            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }} 
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>
              <CheckCircle size={14} />
              <span>Image Uploaded Successfully</span>
            </div>
            <div style={{ 
              fontSize: '0.7rem', 
              color: 'var(--text-muted, #888)', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden',
              marginTop: '4px' 
            }}>
              {successUrl}
            </div>
          </div>
          <button 
            onClick={handleRemove}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        // Dropzone State
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            position: 'relative',
            borderRadius: '8px',
            border: dragActive 
              ? '2px dashed var(--gold-primary, #d4af37)' 
              : '1px dashed var(--border-muted, rgba(255,255,255,0.15))',
            background: dragActive ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255,255,255,0.01)',
            padding: '24px',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Loader2 className="animate-spin" size={24} color="var(--gold-primary, #d4af37)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Uploading to AWS S3...</span>
            </div>
          ) : (
            <div>
              <input 
                type="file" 
                id={`file-upload-${label.replace(/\s+/g, '-')}`} 
                accept={accept}
                onChange={handleChange} 
                style={{ display: 'none' }}
              />
              <label 
                htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
              >
                <Upload size={24} color="var(--text-muted, #888)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  Drag & Drop or <span style={{ color: 'var(--gold-primary, #d4af37)', textDecoration: 'underline' }}>Browse</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #888)' }}>
                  {accept === 'image/*' ? 'PNG, JPG, WEBP' : accept.includes('video') ? 'MP4, MOV, WEBM' : 'Image, Video, PDF — Uploads to AWS S3'}
                </span>
              </label>
            </div>
          )}

          {error && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#EF4444', 
              fontSize: '0.8rem', 
              marginTop: '12px', 
              justifyContent: 'center' 
            }}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
