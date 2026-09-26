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
    title: '🏢 Master Societies & Luxury Residences Pune | 24K Realtors',
    description: 'Explore 24K Realtors Verified Residences: 100% MahaRERA verified master residential societies, gated townships & penthouses in Hinjewadi Phase 1, Phase 2, Phase 3, Wakad, Baner & Mahalunge.',
    url: '/#societies',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: '🏢 24K Master Societies & Residences Pune',
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

  blog: {
    title: 'Real Estate Blog — Expert Guides, Market Insights & Investment Tips',
    description: '24K Realtors expert blog: MahaRERA guides, Hinjewadi investment analysis, home loan comparisons, NRI guides, and Pune real estate market trends. Updated 2026.',
    url: '/#blog',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: '24K Realtors — Real Estate Insights Blog',
      description: 'Expert real estate guides, market analysis, RERA verification help, and investment tips for Hinjewadi, Wakad, and Pune West.',
      url: 'https://real-estate-digital-marketing.vercel.app/#blog',
      publisher: {
        '@type': 'RealEstateAgent',
        name: '24K Realtors Pune',
        url: 'https://real-estate-digital-marketing.vercel.app/'
      }
    }
  },

  // ─── Godrej 24 — Hinjewadi Phase 1 ─────────────────────────────────────────
  godrej24: {
    title: 'Godrej 24 Hinjewadi Phase 1 | 2 & 3 BHK Verified Listings | 24K Realtors Pune',
    description: 'Verified 2 & 3 BHK listings in Godrej 24 Hinjewadi Phase 1 by Godrej Properties. Carpet areas: 725, 820, 940 (2BHK) & 1167, 1488 sq.ft (3BHK). Ready to move. MahaRERA P52100018596.',
    url: '/godrej-24-hinjewadi',
  },

  godrej24_2bhk: {
    title: 'Godrej 24 2 BHK Hinjewadi Phase 1 | Carpet 725, 820, 940 sq.ft | 24K Realtors',
    description: 'Godrej 24 2 BHK apartments in Hinjewadi Phase 1. Verified carpet areas: 725 sq.ft, 820 sq.ft, 940 sq.ft. Ready to move. MahaRERA: P52100018596. Contact 24K Realtors for pricing.',
    url: '/godrej-24-2-bhk',
  },

  godrej24_3bhk: {
    title: 'Godrej 24 3 BHK Hinjewadi Phase 1 | Carpet 1167, 1488 sq.ft | 24K Realtors',
    description: 'Godrej 24 3 BHK apartments in Hinjewadi Phase 1. Verified carpet areas: 1167 sq.ft and 1488 sq.ft. Ready to move. MahaRERA: P52100018596. Contact 24K Realtors for current pricing.',
    url: '/godrej-24-3-bhk',
  },

  // ─── Godrej Elements — Hinjewadi Phase 1 ─────────────────────────────────────
  godrejElements: {
    title: 'Godrej Elements Hinjewadi Phase 1 | 2 & 3 BHK Smart Homes | 24K Realtors Pune',
    description: 'Verified 2 & 3 BHK listings in Godrej Elements Hinjewadi Phase 1. Smart homes with home automation, 21-point safety, infinity pool. Carpet 725–1488 sq.ft. MahaRERA P52100016626.',
    url: '/godrej-elements-hinjewadi',
  },

  godrejElements_2bhk: {
    title: 'Godrej Elements 2 BHK Hinjewadi Phase 1 | Carpet 725, 820, 940 sq.ft | 24K Realtors',
    description: 'Godrej Elements 2 BHK smart apartments in Hinjewadi Phase 1. Verified carpet areas: 725 sq.ft, 820 sq.ft, 940 sq.ft. Home automation, infinity pool. MahaRERA: P52100016626.',
    url: '/godrej-elements-2-bhk',
  },

  godrejElements_3bhk: {
    title: 'Godrej Elements 3 BHK Hinjewadi Phase 1 | Carpet 1167, 1488 sq.ft | 24K Realtors',
    description: 'Godrej Elements 3 BHK smart apartments in Hinjewadi Phase 1. Verified carpet areas: 1167 sq.ft and 1488 sq.ft. Smart home automation, 21-point safety. MahaRERA: P52100016626.',
    url: '/godrej-elements-3-bhk',
  },

  // ─── Megapolis Township — Hinjewadi Phase 3 ──────────────────────────────
  megapolis: {
    title: 'Megapolis Township Hinjewadi Phase 3 | 1, 2 & 3 BHK Flats | 24K Realtors',
    description: 'Explore Pune\'s landmark 142+ acre integrated smart township Megapolis in Hinjewadi Phase 3 by Pride Purple Group. 5 iconic societies, Pawar Public School, Olympic pool. MahaRERA P52100047112.',
    url: '/townships/megapolis',
  },

  megapolis_sangria: {
    title: 'Megapolis Sangria Hinjewadi Phase 3 | 2, 2.5 & 3 BHK Flats | 24K Realtors',
    description: 'Verified 2, 2.5 & 3 BHK luxury residences in Megapolis Sangria Hinjewadi Phase 3. Carpet 645-1050 sq.ft. Ready to move. Next to Tech Mahindra & TCS. MahaRERA P52100047112.',
    url: '/townships/megapolis/sangria',
  },

  megapolis_mystic: {
    title: 'Megapolis Mystic Hinjewadi Phase 3 | 2 & 3 BHK Hillside Homes | 24K Realtors',
    description: 'Scenic hillside 2 & 3 BHK apartments in Megapolis Mystic Hinjewadi Phase 3. Panoramic Sahyadri views, zen gardens, ready to move. MahaRERA P52100046891.',
    url: '/townships/megapolis/mystic',
  },

  megapolis_splendour: {
    title: 'Megapolis Splendour Hinjewadi Phase 3 | Ready 2 & 3 BHK Flats | Pegasus Properties | 24K Realtors',
    description: 'Explore verified ready-to-move 2 BHK (741-900 sq.ft, std 855 sq.ft) & 3 BHK (1,215 sq.ft) flats in Megapolis Splendour, Hinjewadi Phase 3 by Pegasus Properties. Dual MahaRERA P52100022957 & P52100023051. 100% authentic site photos, gym, pool & tennis court.',
    url: '/megapolis-splendour',
  },

  megapolis_saffron: {
    title: 'Megapolis Saffron Hinjewadi Phase 3 | Ready 1 & 2 BHK Flats & Shops | Pegasus Properties | 24K Realtors',
    description: 'Explore verified ready-to-move 1 BHK (444-445 sq.ft) & 2 BHK (617-637 sq.ft up to 698 sq.ft) flats and commercial shops in Megapolis Saffron, Hinjewadi Phase 3 by Pegasus Properties. Triple MahaRERA P52100018779 (Phases A3-A9), P52100021609 (Phases A10-A14), P52100034988 (Shops). 100% authentic site photos.',
    url: '/megapolis-saffron',
  },

  megapolis_saffron_1bhk: {
    title: 'Megapolis Saffron 1 BHK Hinjewadi Phase 3 | Carpet 444 - 445 sq.ft | 24K Realtors',
    description: 'Verified 1 BHK smart apartments in Megapolis Saffron, Hinjewadi Phase 3. Carpet area: 444 to 445 sq.ft. Ready to move. MahaRERA P52100018779 & P52100021609. High rental yield near IT Hub.',
    url: '/megapolis-saffron-1-bhk',
  },

  megapolis_saffron_2bhk: {
    title: 'Megapolis Saffron 2 BHK Hinjewadi Phase 3 | Carpet 617 - 698 sq.ft | 24K Realtors',
    description: 'Verified 2 BHK apartments in Megapolis Saffron, Hinjewadi Phase 3. Carpet areas: 617 to 637 sq.ft with select layouts up to 698 sq.ft. Ready to move. MahaRERA P52100018779 & P52100021609.',
    url: '/megapolis-saffron-2-bhk',
  },

  megapolis_sparklet: {
    title: 'Megapolis Sparklet Hinjewadi Phase 3 | Ready 1 & 2 BHK Flats | Pegasus Properties | 24K Realtors',
    description: 'Explore verified ready-to-move 1 BHK (450-480 sq.ft) & 2 BHK (680-760 sq.ft) flats in Megapolis Sparklet, Hinjewadi Phase 3 by Pegasus Properties. Dual MahaRERA A51800000454 & P52100078240. 100% authentic site photos, curved balcony, pool & gym.',
    url: '/megapolis-sparklet',
  },

  megapolis_sparklet_1bhk: {
    title: 'Megapolis Sparklet 1 BHK Hinjewadi Phase 3 | Carpet 450 - 480 sq.ft | 24K Realtors',
    description: 'Verified 1 BHK hillside smart apartments in Megapolis Sparklet, Hinjewadi Phase 3. Usable carpet: 450 to 480 sq.ft. Ready to move. MahaRERA A51800000454 & P52100078240.',
    url: '/megapolis-sparklet-1-bhk',
  },

  megapolis_sparklet_2bhk: {
    title: 'Megapolis Sparklet 2 BHK Hinjewadi Phase 3 | Carpet 680 - 760 sq.ft | 24K Realtors',
    description: 'Verified 2 BHK family apartments in Megapolis Sparklet, Hinjewadi Phase 3. Usable carpet: 680 to 760 sq.ft with curved terrace balconies overlooking township pool. Ready to move. MahaRERA A51800000454 & P52100078240.',
    url: '/megapolis-sparklet-2-bhk',
  },

  megapolis_sunway: {
    title: 'Megapolis Sunway Hinjewadi Phase 3 | 1 & 2 BHK Smart Homes | 24K Realtors',
    description: 'High ROI 1 & 2 BHK sun-drenched apartments in Megapolis Sunway Hinjewadi Phase 3. 440-870 sq.ft carpet. Ready to move. MahaRERA P52100045780.',
    url: '/townships/megapolis/sunway',
  },

  megapolis_sparkle: {
    title: 'Megapolis Sparkle Hinjewadi Phase 3 | 2 & 3 BHK Homes | 24K Realtors',
    description: 'Spacious 2 & 3 BHK park-facing apartments in Megapolis Sparkle Hinjewadi Phase 3. Active gated community, Pawar Public School nearby. MahaRERA P52100046550.',
    url: '/townships/megapolis/sparkle',
  },

  joyville_sensorium: {
    title: 'Joyville Sensorium Hinjawadi Pune | 2 & 3 BHK Riverfront Flats | Shapoorji Pallonji | 24K Realtors',
    description: 'Explore Joyville Sensorium by Shapoorji Pallonji in Hinjawadi, Pune. 2 BHK (697–792 sq.ft) & 3 BHK (973–979 sq.ft) riverfront flats with terrace & dry balcony. Tower RERAs: Vista P52100027234, Elation P52100024965, Ambrosia P52100024963, Phase IV P52100027244. 100% authentic site photos.',
    url: '/joyville-sensorium',
  },

  joyville_sensorium_2bhk: {
    title: 'Joyville Sensorium 2 BHK Hinjawadi Pune | Carpet 697 - 792 sq.ft | 24K Realtors',
    description: 'Verified 2 BHK riverfront flats in Joyville Sensorium by Shapoorji Pallonji, Hinjawadi Pune. Carpet 697 to 792 sq.ft with 2 bedrooms, bathrooms, living & dining, terrace, and dry balcony. MahaRERA registered.',
    url: '/joyville-sensorium-2-bhk',
  },

  joyville_sensorium_3bhk: {
    title: 'Joyville Sensorium 3 BHK Hinjawadi Pune | Carpet 973 - 979 sq.ft | 24K Realtors',
    description: 'Verified 3 BHK riverfront luxury flats in Joyville Sensorium by Shapoorji Pallonji, Hinjawadi Pune. Carpet 973 to 979 sq.ft with 3 bedrooms, bathrooms, living & dining, terrace, and dry balcony. MahaRERA registered.',
    url: '/joyville-sensorium-3-bhk',
  },

  kasturi_eon_homes: {
    title: 'Kasturi Eon Homes Hinjawadi Phase 3 Pune | 2, 2.5 & 3 BHK Luxury Residences | 24K Realtors',
    description: 'Explore Kasturi Eon Homes in Hinjawadi Phase 3 Pune opposite TCS Sahyadri Park. 12 symmetrical towers around an 8-acre continuous vehicle-free central park. 2 BHK (839-845 sq.ft), 2.5 BHK (950-970 sq.ft with study), 3 BHK Comfort (1145-1150 sq.ft) & 3 BHK Luxury (1185-1282 sq.ft). MahaRERA: P52100046679, P52100080318. 100% verified site photos.',
    url: '/kasturi-eon-homes-hinjawadi',
  },

  kasturi_eon_homes_2bhk: {
    title: 'Kasturi Eon Homes 2 BHK Hinjawadi Phase 3 | Carpet 839 - 845 sq.ft | 24K Realtors',
    description: 'Verified 2 BHK luxury flats in Kasturi Eon Homes Hinjawadi Phase 3 Pune. Carpet area 839 to 845 sq.ft (variants up to 940 sq.ft) with private park-facing deck, modular kitchen & 25,000 sq.ft club. MahaRERA approved.',
    url: '/kasturi-eon-homes-2-bhk',
  },

  kasturi_eon_homes_2_5bhk: {
    title: 'Kasturi Eon Homes 2.5 BHK Hinjawadi Phase 3 | Carpet 950 - 970 sq.ft with Study | 24K Realtors',
    description: 'Smart 2.5 BHK luxury homes in Kasturi Eon Homes Hinjawadi Phase 3 Pune with dedicated study / work-from-home office room. Carpet 950 to 970 sq.ft opposite TCS Sahyadri Park.',
    url: '/kasturi-eon-homes-2-5-bhk',
  },

  kasturi_eon_homes_3bhk: {
    title: 'Kasturi Eon Homes 3 BHK Luxury Hinjawadi Phase 3 | Carpet 1145 - 1282 sq.ft | 24K Realtors',
    description: 'Palatial 3 BHK Mini / Comfort (1,145-1,150 sq.ft) & 3 BHK Luxury (1,185-1,282 sq.ft) residences in Kasturi Eon Homes Hinjawadi Phase 3. 8-acre central park views, glass shower cubicles, Grohe/Toto fittings.',
    url: '/kasturi-eon-homes-3-bhk',
  },
};


/**
 * buildBlogSEO — Generate dynamic SEO metadata and Article schema for a Blog Post
 * @param {Object} blog - Blog post object
 * @returns {Object} - SEO configuration object
 */
export function buildBlogSEO(blog) {
  if (!blog) return SEO_CONFIGS.blog;

  return {
    title: `${blog.seoTitle || blog.title} | 24K Realtors Blog`,
    description: (blog.seoDescription || blog.title).substring(0, 160),
    image: blog.coverImageUrl || undefined,
    url: `/#blog/${blog.slug}`,
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.title,
      description: blog.seoDescription || blog.title,
      image: blog.coverImageUrl,
      author: { '@type': 'Person', name: blog.author || '24K Realtors' },
      publisher: {
        '@type': 'Organization',
        name: '24K Realtors Pune',
        logo: { '@type': 'ImageObject', url: 'https://real-estate-digital-marketing.vercel.app/favicon.svg' }
      },
      datePublished: blog.createdDate,
      dateModified: blog.updatedDate || blog.createdDate,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://real-estate-digital-marketing.vercel.app/#blog/${blog.slug}` }
    }
  };
}

/**
 * buildPropertySEO — Generate dynamic SEO config for a specific property
 * @param {Object} property - Property object from API
 * @returns {Object} - SEO options to pass to useSEO()
 */
export function buildPropertySEO(property) {
  if (!property) return SEO_CONFIGS.portal;

  const price = property.price
    ? (typeof property.price === 'number'
        ? (property.price >= 10000000 ? `₹${(property.price / 10000000).toFixed(2)} Cr` : `₹${Math.round(property.price / 100000)} Lakhs`)
        : String(property.price))
    : '';

  const rawLoc = typeof property.location === 'string'
    ? property.location
    : (typeof property.location?.name === 'string'
        ? property.location.name
        : (typeof property.locality?.name === 'string'
            ? property.locality.name
            : (typeof property.locationName === 'string' ? property.locationName : 'Pune')));

  const loc = rawLoc.replace(/_/g, ' ');
  const locSlug = (rawLoc || 'hinjewadi').toLowerCase().replace(/_/g, '-');
  const title = property.title || '24K Luxury Property';

  const desc = [
    property.description
      ? String(property.description).substring(0, 120) + '…'
      : `${property.bedrooms ? property.bedrooms + ' BHK ' : ''}${typeof property.propertyType === 'string' ? property.propertyType.toLowerCase() : 'luxury residence'} in ${loc}.`,
    price && `Starting at ${price}.`,
    property.reraNumber && `MahaRERA: ${property.reraNumber}.`,
    'Verified guided site visits by 24K Realtors Pune.'
  ].filter(Boolean).join(' ');

  const siteUrl = 'https://real-estate-digital-marketing.vercel.app';
  const pageUrl = `${siteUrl}/property/${property.id || 'prop-1'}`;

  return {
    title: `${title} | ${loc} ${property.bedrooms ? property.bedrooms + ' BHK' : ''} — 24K Realtors`,
    description: desc.substring(0, 160),
    image: property.imageUrl || undefined,
    url: pageUrl,
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Apartment', 'RealEstateListing'],
          '@id': pageUrl,
          name: title,
          description: property.description || desc,
          image: property.imageUrl ? [property.imageUrl] : undefined,
          url: pageUrl,
          address: {
            '@type': 'PostalAddress',
            streetAddress: property.address || `${title}, ${loc}`,
            addressLocality: loc,
            addressRegion: 'Maharashtra',
            postalCode: '411057',
            addressCountry: 'IN'
          },
          geo: property.latitude && property.longitude ? {
            '@type': 'GeoCoordinates',
            latitude: property.latitude,
            longitude: property.longitude
          } : undefined,
          offers: price ? {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'INR',
            availability: property.status === 'AVAILABLE'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/SoldOut',
            seller: {
              '@type': 'RealEstateAgent',
              name: '24K Realtors Pune',
              telephone: '+919673000053',
              url: siteUrl
            }
          } : undefined,
          numberOfRooms: property.bedrooms,
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'Bedrooms',     value: property.bedrooms },
            { '@type': 'PropertyValue', name: 'Bathrooms',    value: property.bathrooms },
            { '@type': 'PropertyValue', name: 'Area (sqft)',  value: property.areaSquareFeet },
            { '@type': 'PropertyValue', name: 'RERA Number',  value: property.reraNumber },
            { '@type': 'PropertyValue', name: 'Location',     value: loc },
          ].filter(p => p.value)
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: loc, item: `${siteUrl}/locations/${locSlug}` },
            { '@type': 'ListItem', position: 3, name: title, item: pageUrl }
          ]
        }
      ]
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
  const heroImg = society.heroImageUrl || society.galleryUrls?.[0];
  const sqft = society.pricePerSqft ? `₹${society.pricePerSqft.toLocaleString('en-IN')}/sq.ft. ` : '';
  const investScore = society.investmentScore ? `Investment Score: ${society.investmentScore}/100. ` : '';

  const desc = `${society.canonicalName || society.name} in ${loc}. Verified Starting Price: ${price || 'on request'}. ${rera}. ${society.configurationSummary || '2 & 3 BHK'}. ${sqft}${investScore}Expert advisory by 24K Realtors.`;

  const siteUrl = 'https://real-estate-digital-marketing.vercel.app';
  const pageUrl = `${siteUrl}/society/${society.slug || society.id}`;

  return {
    title: `${society.canonicalName || society.name} ${loc} | Price, Floor Plans, RERA & Intelligence`,
    description: desc.substring(0, 160),
    image: heroImg,
    url: pageUrl,
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['ApartmentComplex', 'RealEstateListing'],
          '@id': pageUrl,
          name: society.canonicalName || society.name,
          description: society.description || desc,
          image: heroImg ? [heroImg, ...(society.galleryUrls?.slice(1,4) || [])] : undefined,
          url: pageUrl,
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
          offers: price ? {
            '@type': 'Offer',
            price: society.startingPrice,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'RealEstateAgent',
              name: '24K Realtors',
              telephone: '+919673000053',
              url: siteUrl
            }
          } : undefined,
          numberOfRooms: society.configurationSummary || '2 & 3 BHK',
          amenityFeature: (society.amenities || []).map(a => ({
            '@type': 'LocationFeatureSpecification',
            name: a.amenityLabel || a.amenityKey || a,
            value: true
          })),
          aggregateRating: society.investmentScore ? {
            '@type': 'AggregateRating',
            ratingValue: (society.investmentScore / 20).toFixed(1),
            bestRating: '5',
            worstRating: '1',
            ratingCount: '24'
          } : undefined
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
            { '@type': 'ListItem', position: 2, name: 'Societies Directory', item: `${siteUrl}/#societies` },
            { '@type': 'ListItem', position: 3, name: society.canonicalName || society.name, item: pageUrl }
          ]
        },
        {
          '@type': 'RealEstateAgent',
          name: '24K Realtors',
          telephone: '+919673000053',
          url: siteUrl,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Hinjewadi, Pune',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN'
          },
          priceRange: '₹₹₹'
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
