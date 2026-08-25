package com.realestate.twentyfourk.domain.property;

/**
 * Hinjewadi phase classification for geo-accurate location assignment.
 *
 * IMPORTANT: A project must ONLY be assigned to a phase based on its
 * OFFICIAL / VERIFIED address — NOT based on developer marketing claims.
 * Many developers use "Hinjewadi" as a marketing keyword for projects
 * that are actually in Phase 2, Phase 3 or adjacent areas.
 */
public enum HinjewadiPhase {

    /** Hinjewadi Phase 1 — original IT park zone. */
    PHASE_1,

    /** Hinjewadi Phase 2 — expanded IT corridor. */
    PHASE_2,

    /** Hinjewadi Phase 3 — newest development zone. */
    PHASE_3,

    /** Project is in Mahalunge locality. */
    MAHALUNGE,

    /** Project is in Hinjewadi but exact phase is unverified. */
    HINJEWADI_UNSPECIFIED,

    /** Project is not in any Hinjewadi phase or Mahalunge. */
    NOT_APPLICABLE
}
