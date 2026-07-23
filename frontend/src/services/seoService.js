import { useEffect } from 'react';

/**
 * useSEO — Dynamic meta tag manager for 24K Realtors SPA
 * Updates document.title, meta description, OG tags, and Twitter cards
 * without react-helmet dependency.
 *
 * @param {Object} options
 * @param {string} options.title         - Page title
 * @param {string} options.description   - Meta description (max 160 chars)
 * @param {string} [options.image]       - OG image URL
 * @param {string} [options.url]         - Canonical URL
 * @param {string} [options.type]        - OG type: 'website' | 'article' | 'product'
 * @param {Object} [options.schema]      - JSON-LD schema object to inject
 */
export function useSEO({ title, description, image, url, type = 'website', schema }) {
  useEffect(() => {
    const BASE_URL  = 'https://real-estate-digital-marketing.vercel.app';
    const DEF_IMG   = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    const SUFFIX    = '| 24K Realtors Pune';

    const fullTitle = title ? `${title} ${SUFFIX}` : `24K Realtors Pune | Premium Location-Centric Real Estate Advisory`;
    const metaDesc  = description || '24K Realtors — Pune West\'s leading real estate advisory. 100% MahaRERA verified flats in Hinjewadi, Wakad & Baner.';
    const metaImg   = image  || DEF_IMG;
    const canonical = url    ? `${BASE_URL}${url}` : BASE_URL;

    // ── document title ───────────────────────────────────────────────────────
    document.title = fullTitle;

    // ── helper to set / create meta tags ────────────────────────────────────
    const setMeta = (selector, value, attr = 'content') => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = selector.replace(/[\[\]']/g, '').split('=');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
      el.setAttribute('href', href);
    };

    // ── Primary meta ─────────────────────────────────────────────────────────
    setMeta("meta[name='description']",            metaDesc);
    setLink('canonical',                            canonical);

    // ── Open Graph ───────────────────────────────────────────────────────────
    setMeta("meta[property='og:title']",            fullTitle);
    setMeta("meta[property='og:description']",      metaDesc);
    setMeta("meta[property='og:image']",            metaImg);
    setMeta("meta[property='og:url']",              canonical);
    setMeta("meta[property='og:type']",             type);

    // ── Twitter Card ─────────────────────────────────────────────────────────
    setMeta("meta[name='twitter:title']",           fullTitle);
    setMeta("meta[name='twitter:description']",     metaDesc);
    setMeta("meta[name='twitter:image']",           metaImg);

    // ── JSON-LD Structured Data ──────────────────────────────────────────────
    if (schema) {
      const existingScript = document.getElementById('dynamic-ld-json');
      if (existingScript) existingScript.remove();
      const script = document.createElement('script');
      script.id   = 'dynamic-ld-json';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    // ── Cleanup: restore defaults on unmount ─────────────────────────────────
    return () => {
      document.title = `24K Realtors Pune | Premium Location-Centric Real Estate Advisory`;
    };
  }, [title, description, image, url, type, schema]);
}

// ─── Pre-built SEO configs for each view ──────────────────────────────────────

export const SEO_CONFIGS = {
  portal: {
    title: 'Luxury Properties in Hinjewadi, Wakad & Baner',
    description: '24K Realtors — Pune West\'s leading real estate advisory. Discover 100% MahaRERA verified flats, villas & plots in Hinjewadi, Wakad, Baner & Kharadi. RERA: A52100028461.',
    url: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: '24K Realtors Pune',
      description: "Pune West's premium location-centric real estate advisory — 100% MahaRERA verified properties.",
      url: 'https://real-estate-digital-marketing.vercel.app/',
      telephone: '+91-96730-00053',
      email: 'advisory@24krealtors.com',
      logo: 'https://real-estate-digital-marketing.vercel.app/favicon.svg',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hinjewadi',
        addressRegion: 'Maharashtra',
        postalCode: '411057',
        addressCountry: 'IN'
      },
      areaServed: [
        { '@type': 'City', name: 'Hinjewadi', addressCountry: 'IN' },
        { '@type': 'City', name: 'Wakad', addressCountry: 'IN' },
        { '@type': 'City', name: 'Baner', addressCountry: 'IN' },
        { '@type': 'City', name: 'Kharadi', addressCountry: 'IN' },
      ],
      priceRange: '₹65L – ₹3.8Cr',
      openingHours: 'Mo-Sa 09:00-19:00',
      sameAs: [
        'https://www.instagram.com/24krealtorspune',
        'https://www.facebook.com/24krealtorspune'
      ]
    }
  },

  dashboard: {
    title: 'Admin Dashboard — CRM & Leads',
    description: '24K Realtors Admin Panel — Manage property listings, leads, RERA verifications and CRM analytics.',
    url: '/dashboard',
  },

  login: {
    title: 'Agent Login — Secure CRM Access',
    description: 'Login to 24K Realtors CRM dashboard. Manage leads, listings, and RERA documents securely.',
    url: '/login',
  },

  listProperty: {
    title: 'List Your Property — Free Advisory',
    description: 'List your property with 24K Realtors Pune. MahaRERA compliant listing, professional photography, and dedicated advisory support. Free valuation.',
    url: '/list-property',
  },
};

/**
 * buildPropertySEO — Generate dynamic SEO config for a specific property
 * @param {Object} property - Property object from API
 * @returns {Object} - SEO options to pass to useSEO()
 */
export function buildPropertySEO(property) {
  if (!property) return SEO_CONFIGS.portal;

  const price = property.price
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
        .format(property.price)
        .replace('₹', '₹')
    : '';

  const desc = [
    property.description
      ? property.description.substring(0, 120) + '…'
      : `${property.bedrooms || ''} BHK ${property.propertyType?.toLowerCase() || 'property'} in ${property.location}.`,
    price && `Priced at ${price}.`,
    property.reraNumber && `RERA: ${property.reraNumber}.`,
    'Contact 24K Realtors for site visit.'
  ].filter(Boolean).join(' ');

  return {
    title: `${property.title} — ${property.location} ${property.bedrooms ? property.bedrooms + ' BHK' : ''}`,
    description: desc.substring(0, 160),
    image: property.imageUrl || undefined,
    url: `/properties/${property.id}`,
    type: 'product',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: property.title,
      description: property.description || desc,
      image: property.imageUrl,
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'INR',
        availability: property.status === 'AVAILABLE'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
        seller: {
          '@type': 'RealEstateAgent',
          name: '24K Realtors Pune',
          telephone: '+91-96730-00053',
        }
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Bedrooms',     value: property.bedrooms },
        { '@type': 'PropertyValue', name: 'Bathrooms',    value: property.bathrooms },
        { '@type': 'PropertyValue', name: 'Area (sqft)',  value: property.areaSquareFeet },
        { '@type': 'PropertyValue', name: 'RERA Number',  value: property.reraNumber },
        { '@type': 'PropertyValue', name: 'Location',     value: property.location },
      ].filter(p => p.value)
    }
  };
}
