/**
 * UnitListingCard.jsx — 24K Realtors
 * ──────────────────────────────────────────────────────────────────
 * Individual apartment unit listing card.
 * Used in MegapolisSocietyListingsPage (right panel grid).
 *
 * Props:
 *   unit          — inventory unit object from API or mock
 *   societyName   — display name for the parent society tag
 */

import React from 'react';
import { MapPin, Layers, Home, Eye, ArrowUpRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/* ── Price Formatter ─────────────────────────────────────────────── */
function formatPrice(val) {
  if (!val) return 'Price on Request';
  if (typeof val === 'string' && (val.includes('₹') || val.includes('Cr') || val.includes('L'))) return val;
  const n = Number(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(n) || n <= 0) return val;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${Math.round(n / 100000)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

/* ── PSF Rate Formatter ──────────────────────────────────────────── */
function formatPSF(price, carpet) {
  if (!price || !carpet) return null;
  const p = Number(String(price).replace(/[^0-9.]/g, ''));
  const c = Number(String(carpet).replace(/[^0-9.]/g, ''));
  if (!p || !c) return null;
  const psf = Math.round(p / c);
  return `~₹${psf.toLocaleString('en-IN')}/sqft`;
}

/* ── Status badge class mapper ───────────────────────────────────── */
function statusBadgeClass(status) {
  if (!status) return 'pi-unit-badge--status-available';
  const s = status.toUpperCase();
  if (s.includes('RESALE') || s.includes('RESELL')) return 'pi-unit-badge--status-resale';
  if (s.includes('BOOK') || s.includes('SOLD'))     return 'pi-unit-badge--status-booked';
  return 'pi-unit-badge--status-available';
}
function statusLabel(status) {
  if (!status) return 'New Sale';
  const s = status.toUpperCase();
  if (s.includes('RESALE') || s.includes('RESELL')) return 'Resale';
  if (s.includes('BOOK') || s.includes('SOLD'))     return 'Booked';
  if (s.includes('RENT')) return 'Rental';
  return 'New Sale';
}

/* ── Furnishing Mapper ───────────────────────────────────────────── */
function furnishLabel(f) {
  if (!f) return null;
  const u = f.toUpperCase();
  if (u.includes('FULL') || u === 'FURNISHED') return 'Furnished';
  if (u.includes('SEMI')) return 'Semi-Furnished';
  if (u.includes('UN') || u === 'UNFURNISHED') return 'Unfurnished';
  return f;
}

/* ── Default fallback images per society ────────────────────────── */
const SOCIETY_IMAGES = {
  sangria:    '/dev_kolte_patil_township.png',
  mystic:     '/dev_kolte_patil_township.png',
  splendour:  '/dev_kolte_patil_township.png',
  sunway:     '/dev_kolte_patil_township.png',
  sparkle:    '/dev_kolte_patil_township.png',
};
function getUnitImage(unit) {
  if (unit.imageUrl) return unit.imageUrl;
  if (unit.heroImageUrl) return unit.heroImageUrl;
  const slug = (unit.societySlug || unit.society || '').toLowerCase();
  return SOCIETY_IMAGES[slug] || '/dev_kolte_patil_township.png';
}

/* ── WhatsApp message ────────────────────────────────────────────── */
function buildWALink(unit, societyName) {
  const bhk   = unit.bhkType || unit.bhk || '';
  const carpet = unit.carpetAreaSqft || unit.carpet || '';
  const price = unit.price || unit.totalPrice || '';
  const tower = unit.tower ? ` | Tower ${unit.tower}` : '';
  const floor = unit.floorNumber != null ? ` | Floor ${unit.floorNumber}` : '';
  const msg = `Hi 24K Realtors, I'm interested in a ${bhk} apartment at Megapolis ${societyName || unit.society || ''}${tower}${floor}. Carpet: ${carpet} sqft. Price: ${formatPrice(price)}. Please share more details.`;
  return `https://wa.me/919673000053?text=${encodeURIComponent(msg)}`;
}

export default function UnitListingCard({ unit, societyName, index = 0 }) {
  if (!unit) return null;

  const imgSrc      = getUnitImage(unit);
  const bhkLabel    = unit.bhkType || unit.bhk || '2 BHK';
  const carpet      = unit.carpetAreaSqft || unit.carpet;
  const totalArea   = unit.builtUpAreaSqft || unit.builtUp;
  const price       = unit.totalPrice || unit.price;
  const psf         = formatPSF(price, carpet);
  const furnish     = furnishLabel(unit.furnishingStatus || unit.furnishing);
  const viewType    = unit.viewType || unit.view;
  const floorNo     = unit.floorNumber != null ? `Floor ${unit.floorNumber}` : null;
  const tower       = unit.tower ? `Tower ${unit.tower}` : null;
  const reraNo      = unit.reraNumber;
  const status      = unit.availabilityStatus || unit.status || 'AVAILABLE';
  const society     = societyName || unit.societyName || unit.society || 'Megapolis';

  return (
    <motion.div
      className="pi-unit-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.5), duration: 0.3 }}
    >
      {/* ── Image Area ─────────────────────────────────────────────── */}
      <div className="pi-unit-card__img-wrap">
        <img
          src={imgSrc}
          alt={`${bhkLabel} at Megapolis ${society}`}
          loading="lazy"
          onError={e => { e.target.onerror = null; e.target.src = '/dev_kolte_patil_township.png'; }}
        />
        <div className="pi-unit-card__img-overlay" />

        {/* Top Badges */}
        <div className="pi-unit-card__top-badges">
          <span className={`pi-unit-badge pi-unit-badge--bhk`}>{bhkLabel}</span>
          <span className={`pi-unit-badge ${statusBadgeClass(status)}`}>
            {statusLabel(status)}
          </span>
        </div>

        {/* RERA Badge */}
        {reraNo && (
          <div className="pi-unit-card__rera">
            <ShieldCheck size={11} />
            <span>{reraNo}</span>
          </div>
        )}
      </div>

      {/* ── Card Body ──────────────────────────────────────────────── */}
      <div className="pi-unit-card__body">

        {/* Society tag */}
        <div className="pi-unit-card__society-tag">
          <Layers size={11} />
          Megapolis {society}
        </div>

        {/* Title */}
        <h3 className="pi-unit-card__title">
          {bhkLabel} — {carpet ? `${carpet} sqft Carpet` : 'Premium Apartment'}
        </h3>

        {/* Spec Pills */}
        <div className="pi-unit-card__specs">
          {carpet && (
            <span className="pi-unit-spec-pill">
              <Home size={11} />
              {carpet} sqft carpet
            </span>
          )}
          {totalArea && (
            <span className="pi-unit-spec-pill">
              <Layers size={11} />
              {totalArea} sqft built-up
            </span>
          )}
          {tower && (
            <span className="pi-unit-spec-pill">
              <MapPin size={11} />
              {tower}
            </span>
          )}
          {floorNo && (
            <span className="pi-unit-spec-pill">
              <Layers size={11} />
              {floorNo}
            </span>
          )}
          {furnish && (
            <span className="pi-unit-spec-pill">
              <Home size={11} />
              {furnish}
            </span>
          )}
          {viewType && (
            <span className="pi-unit-spec-pill">
              <Eye size={11} />
              {viewType} View
            </span>
          )}
        </div>

        {/* Price Row + WhatsApp CTA */}
        <div className="pi-unit-card__price-row">
          <div className="pi-unit-price-block">
            <div className="pi-unit-price-label">Price</div>
            <div className="pi-unit-price-val">{formatPrice(price)}</div>
            {psf && <div className="pi-unit-price-psf">{psf}</div>}
          </div>

          <a
            href={buildWALink(unit, society)}
            target="_blank"
            rel="noopener noreferrer"
            className="pi-unit-card__whatsapp-btn"
            aria-label={`WhatsApp inquiry for ${bhkLabel} at Megapolis ${society}`}
          >
            <MessageCircle size={13} />
            <span>Get Price</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
