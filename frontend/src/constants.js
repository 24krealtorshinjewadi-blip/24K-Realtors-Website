/**
 * Application-wide constants.
 * All magic values, contact info, and configuration belong here.
 * Never hardcode these values in components.
 */

// ===== Contact Information =====
export const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || '+919673000053';
export const CONTACT_PHONE_DISPLAY = import.meta.env.VITE_CONTACT_PHONE_DISPLAY || '+91 96730 00053';
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || '24krealtorspune@gmail.com';
export const CONTACT_WEBSITE = 'https://www.24krealtors.in';
export const WHATSAPP_BASE = `https://wa.me/${CONTACT_PHONE.replace(/\D/g, '')}`;

// ===== Business Info =====
export const BUSINESS_NAME = '24K Realtors Pune';
export const BUSINESS_TAGLINE = 'Find Yourself At Home';
export const ADVISOR_NAME = 'Neeraj Giri';
export const SERVING_SINCE = '2011';
export const RERA_LICENSE = 'A051262603190';
export const BRAND_TAGLINE = "Pune's Premium Location Advisory";
export const OFFICE_ADDRESS = 'Office 19, Prem Mairah, Opp. VTP Bellissimo Maan Rd, Hinjewadi Phase 1, Pune 411057';

// ===== API =====
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  )
    ? 'http://localhost:8080/api/v1'
    : 'https://twentyfourk-backend-production.up.railway.app/api/v1');

// ===== Locations =====
export const LOCATIONS = ['HINJEWADI', 'WAKAD', 'BANER', 'TATHAWADE', 'BALEWADI', 'AUNDH'];

// ===== Transaction Types =====
export const TRANSACTION_TYPES = { BUY: 'BUY', RENT: 'RENT', SELL: 'SELL' };

// ===== Property Types =====
export const PROPERTY_TYPES = { RESIDENTIAL: 'RESIDENTIAL', COMMERCIAL: 'COMMERCIAL' };

// ===== Furnishing Status =====
export const FURNISHING_OPTIONS = ['FULLY_FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'];

// ===== Default Images (no rickrolls, ever) =====
export const DEFAULT_PROPERTY_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
export const DEFAULT_VIDEO_URL = null; // No placeholder — show "Video coming soon" state
export const DEFAULT_3D_TOUR_URL = null; // No placeholder — show "Tour coming soon" state

// ===== Animation =====
export const REDUCED_MOTION = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Pagination =====
export const DEFAULT_PAGE_SIZE = 9;
