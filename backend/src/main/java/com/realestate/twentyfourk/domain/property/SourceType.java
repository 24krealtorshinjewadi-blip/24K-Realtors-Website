package com.realestate.twentyfourk.domain.property;

/**
 * Classifies the type/authority level of a data source.
 *
 * Source hierarchy (from master prompt):
 *   Level 1 — OFFICIAL_RERA, OFFICIAL_DEVELOPER, GOVT_RECORDS
 *   Level 2 — PROPERTY_PORTAL (Housing.com, 99acres, MagicBricks etc.)
 *   Level 3 — MAPS, COMMUNITY, OTHER
 *
 * A broker website must NEVER be the sole source for an important factual claim.
 */
public enum SourceType {

    /** MahaRERA official portal — highest authority for legal/RERA data. */
    OFFICIAL_RERA,

    /** Official developer or project website. */
    OFFICIAL_DEVELOPER,

    /** Government authority records (local body, municipality etc.). */
    GOVT_RECORDS,

    /** Trusted property portals: Housing.com, 99acres, MagicBricks, Square Yards, PropTiger. */
    PROPERTY_PORTAL,

    /** Google Maps, Google Business Profile. */
    MAPS,

    /** Verified society/community sources, reputed local publications. */
    COMMUNITY,

    /** Any other source not fitting above categories. Must document clearly. */
    OTHER
}
