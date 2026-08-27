import { useEffect } from 'react';

/**
 * useSEO — Dynamic meta tag & structured data (JSON-LD) manager for 24K Realtors
 * Updates document.title, meta description, OG tags, Twitter cards, and JSON-LD schema.
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
    const DEF_IMG   = 'https://real-estate-digital-marketing.vercel.app/twentyfourk_pune_banner.png';
    const SUFFIX    = '| 24K Realtors Pune';

    const fullTitle = title ? `${title} ${SUFFIX}` : `24K Realtors Pune | Premium Location-Centric Real Estate Advisory`;
    const metaDesc  = description || '24K Realtors — Pune West\'s leading real estate advisory. 100% MahaRERA verified flats & societies in Hinjewadi, Wakad, Baner & Mahalunge.';
    const metaImg   = image  || DEF_IMG;
    const canonical = url    ? `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}` : BASE_URL;

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
    description: '24K Realtors — Pune West\'s leading real estate advisory. Discover 100% MahaRERA verified flats, villas & plots in Hinjewadi, Wakad, Baner & Mahalunge. RERA: A051262603190.',
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
        { '@type': 'City', name: 'Hinjewadi Phase 1', addressCountry: 'IN' },
        { '@type': 'City', name: 'Hinjewadi Phase 2', addressCountry: 'IN' },
        { '@type': 'City', name: 'Hinjewadi Phase 3', addressCountry: 'IN' },
        { '@type': 'City', name: 'Mahalunge', addressCountry: 'IN' },
        { '@type': 'City', name: 'Wakad', addressCountry: 'IN' },
        { '@type': 'City', name: 'Baner', addressCountry: 'IN' }
      ],
      priceRange: '₹65L – ₹3.8Cr',
      openingHours: 'Mo-Sa 09:00-19:00',
      sameAs: [
        'https://www.instagram.com/24krealtorspune',
        'https://www.facebook.com/24krealtorspune'
      ]
    }
  },

  societies: {
    title: '⚜️ Signature Collection — Master Societies & Luxury Residences Pune | 24K Realtors',
    description: 'Explore 24K Realtors Signature Collection: 100% MahaRERA verified master residential societies, gated townships & penthouses in Hinjewadi Phase 1, Phase 2, Phase 3, Wakad, Baner & Mahalunge.',
    url: '/#societies',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: '⚜️ 24K Signature Collection — Master Societies & Residences Pune',
      description: 'Exclusive portfolio of MahaRERA verified residential townships, luxury societies and gated communities in Pune West.',
      url: 'https://real-estate-digital-marketing.vercel.app/#societies',
      publisher: {
        '@type': 'RealEstateAgent',
        name: '24K Realtors Pune',
        url: 'https://real-estate-digital-marketing.vercel.app/'
      }
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
    ? (property.price >= 10000000 ? `₹${(property.price / 10000000).toFixed(2)} Cr` : `₹${Math.round(property.price / 100000)} Lakhs`)
    : '';

  const desc = [
    property.description
      ? property.description.substring(0, 120) + '…'
      : `${property.bedrooms || ''} BHK ${property.propertyType?.toLowerCase() || 'property'} in ${property.location}.`,
    price && `Priced at ${price}.`,
    property.reraNumber && `RERA: ${property.reraNumber}.`,
    'Contact 24K Realtors for verified site visit.'
  ].filter(Boolean).join(' ');

  return {
    title: `${property.title} — ${property.location} ${property.bedrooms ? property.bedrooms + ' BHK' : ''}`,
    description: desc.substring(0, 160),
    image: property.imageUrl || undefined,
    url: `/#property/${property.id}`,
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

/**
 * buildSocietySEO — Generate dynamic SEO metadata and JSON-LD schema for a Society Dossier
 * @param {Object} society - Society intelligence object
 * @returns {Object} - SEO configuration object
 */
export function buildSocietySEO(society) {
  if (!society) return SEO_CONFIGS.societies;

  const loc = society.hinjewadiPhase ? society.hinjewadiPhase.replace('_', ' ') : (society.location || 'Hinjewadi Pune');
  const price = society.priceRange || (society.startingPrice ? (society.startingPrice >= 10000000 ? `₹${(society.startingPrice / 10000000).toFixed(2)} Cr` : `₹${Math.round(society.startingPrice / 100000)} Lakhs`) : '');
  const rera = society.reraNumber ? `MahaRERA: ${society.reraNumber}` : 'MahaRERA Verified';

  const desc = `${society.canonicalName || society.name} in ${loc}. Verified Starting Price: ${price || 'on request'}. ${rera}. ${society.configurationSummary || '2 & 3 BHK'}. Verified infrastructure dossier & expert advisory by 24K Realtors.`;

  return {
    title: `${society.canonicalName || society.name} ${loc} | Price, Floor Plans, RERA & Intelligence`,
    description: desc.substring(0, 160),
    image: society.heroImageUrl || undefined,
    url: `/#society/${society.slug || society.id}`,
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ApartmentComplex',
          '@id': `https://real-estate-digital-marketing.vercel.app/#society/${society.slug}`,
          name: society.canonicalName || society.name,
          description: society.description || desc,
          image: society.heroImageUrl,
          address: {
            '@type': 'PostalAddress',
            streetAddress: society.fullAddress || `${society.name}, Rajiv Gandhi Infotech Park`,
            addressLocality: society.location || 'Hinjewadi',
            addressRegion: 'Maharashtra',
            postalCode: society.pincode || '411057',
            addressCountry: 'IN'
          },
          geo: society.latitude && society.longitude ? {
            '@type': 'GeoCoordinates',
            latitude: society.latitude,
            longitude: society.longitude
          } : undefined,
          amenityFeature: (society.amenities || []).map(a => ({
            '@type': 'LocationFeatureSpecification',
            name: a.amenityLabel || a.amenityKey,
            value: true
          }))
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://real-estate-digital-marketing.vercel.app/'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Societies Directory',
              item: 'https://real-estate-digital-marketing.vercel.app/#societies'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: society.canonicalName || society.name,
              item: `https://real-estate-digital-marketing.vercel.app/#society/${society.slug}`
            }
          ]
        }
      ]
    }
  };
}

/**
 * buildLocationSEO — Generate dynamic SEO for Location Landing Pages
 * @param {Object} locationData - Location data object
 * @returns {Object} - SEO configuration object
 */
export function buildLocationSEO(locationData) {
  if (!locationData) return SEO_CONFIGS.portal;

  const desc = `Explore verified master residential societies in ${locationData.name}, Pune West. Live inventory, price trends, transit infra, MahaRERA dossiers and advisory.`;

  return {
    title: `${locationData.name} Real Estate & Master Societies Directory 2026`,
    description: desc.substring(0, 160),
    url: `/#locations/${locationData.slug}`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Place',
          name: locationData.name,
          description: desc,
          address: {
            '@type': 'PostalAddress',
            addressLocality: locationData.name,
            addressRegion: 'Maharashtra',
            postalCode: locationData.pincode || '411057',
            addressCountry: 'IN'
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://real-estate-digital-marketing.vercel.app/'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Locations',
              item: 'https://real-estate-digital-marketing.vercel.app/#societies'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: locationData.name,
              item: `https://real-estate-digital-marketing.vercel.app/#locations/${locationData.slug}`
            }
          ]
        }
      ]
    }
  };
}
