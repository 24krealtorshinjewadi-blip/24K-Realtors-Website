import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2 
} from 'lucide-react';

export default function FullScreenPhotoModal({
  isOpen,
  onClose,
  photos = [],
  initialIndex = 0
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomScale, setZoomScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Sync initialIndex
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomScale(1);
      setPanPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Normalize photos input (array of strings or array of objects)
  const normalizedPhotos = photos.map((p, idx) => {
    if (typeof p === 'string') {
      return { url: p, title: `Photo ${idx + 1}`, tag: 'VERIFIED' };
    }
    return {
      url: p.url || p.src || p.imageUrl || '',
      title: p.title || p.roomName || p.label || `Photo ${idx + 1}`,
      tag: p.tag || p.badge || 'VERIFIED PHOTO'
    };
  });

  const total = normalizedPhotos.length;
  const currentPhoto = normalizedPhotos[currentIndex] || { url: '', title: '', tag: '' };

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % total);
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
  }, [total]);

  const handleZoomIn = (e) => {
    if (e) e.stopPropagation();
    setZoomScale(prev => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = (e) => {
    if (e) e.stopPropagation();
    setZoomScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e) => {
    if (e) e.stopPropagation();
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Drag to pan when zoomed
  const handleMouseDown = (e) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomScale <= 1) return;
    setPanPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !total) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(3, 7, 18, 0.96)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        userSelect: 'none'
      }}
    >
      {/* ── Top Bar: Title, Room Tag, Zoom Controls & Close ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#FFFFFF',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '12px',
          padding: '10px 18px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div>
          <span style={{ 
            fontSize: '0.68rem', 
            color: '#E6C35C', 
            fontWeight: 800, 
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            {currentPhoto.tag}
          </span>
          <h4 style={{ 
            margin: 0, 
            fontSize: '1.05rem', 
            fontFamily: "'Cinzel', serif", 
            color: '#FFFFFF', 
            fontWeight: 700 
          }}>
            {currentPhoto.title} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>({currentIndex + 1} of {total})</span>
          </h4>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleZoomIn}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '7px 11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.76rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
            title="Zoom In (+)"
          >
            <ZoomIn size={15} color="#E6C35C" />
            <span>{Math.round(zoomScale * 100)}%</span>
          </button>

          <button
            onClick={handleZoomOut}
            disabled={zoomScale <= 1}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: zoomScale <= 1 ? 'rgba(255,255,255,0.3)' : '#FFFFFF',
              borderRadius: '8px',
              padding: '7px 11px',
              cursor: zoomScale <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Zoom Out (-)"
          >
            <ZoomOut size={15} />
          </button>

          {zoomScale > 1 && (
            <button
              onClick={handleResetZoom}
              style={{
                background: 'rgba(230, 195, 92, 0.15)',
                border: '1px solid rgba(230, 195, 92, 0.4)',
                color: '#E6C35C',
                borderRadius: '8px',
                padding: '7px 11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.76rem',
                fontWeight: 700
              }}
              title="Reset Zoom (0)"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}

          <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#F87171',
              borderRadius: '8px',
              padding: '7px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
            title="Close Lightbox (Esc)"
          >
            <X size={16} />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* ── Main Interactive Image Viewer Stage ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Prev Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(4, 8, 20, 0.75)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#E6C35C',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
          }}
          title="Previous Photo (←)"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Center High-Res Image with Pan & Scale */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (zoomScale === 1) {
              handleZoomIn(e);
            } else {
              handleResetZoom(e);
            }
          }}
          style={{
            maxWidth: '92vw',
            maxHeight: '74vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomScale})`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'center center'
          }}
        >
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            style={{
              maxWidth: '90vw',
              maxHeight: '72vh',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.15)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            draggable={false}
          />
        </div>

        {/* Next Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(4, 8, 20, 0.75)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#E6C35C',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
          }}
          title="Next Photo (→)"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* ── Bottom Strip: Interactive Thumbnails ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          overflowX: 'auto',
          padding: '8px 4px',
          maxWidth: '100%',
          zIndex: 10
        }}
      >
        {normalizedPhotos.map((photo, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentIndex(i);
              setZoomScale(1);
              setPanPosition({ x: 0, y: 0 });
            }}
            style={{
              position: 'relative',
              width: '68px',
              height: '46px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: currentIndex === i ? '2px solid #E6C35C' : '1px solid rgba(255,255,255,0.15)',
              padding: 0,
              background: '#0F172A',
              cursor: 'pointer',
              opacity: currentIndex === i ? 1 : 0.6,
              transform: currentIndex === i ? 'scale(1.08)' : 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <img
              src={photo.url}
              alt={photo.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
