package com.realestate.twentyfourk.domain.property;

/**
 * Classifies the construction/sales status of a property project.
 * Based on 24K Realtors Property Intelligence Database specification.
 * Status must be determined from verified sources — NEVER from marketing copy alone.
 */
public enum ProjectStatus {

    /** Society is ready to occupy; possession has been handed over. */
    READY_TO_MOVE,

    /** Construction is ongoing; possession not yet given. */
    UNDER_CONSTRUCTION,

    /** Recently launched; bookings open. */
    NEW_LAUNCH,

    /** Announced but not yet launched / bookings not open. */
    UPCOMING,

    /** Construction complete; OC received; handover done. */
    COMPLETED,

    /** Primary sales largely done; majority of activity is resale. */
    RESALE_DOMINANT,

    /** All units sold; no inventory available. */
    SOLD_OUT,

    /** Mix of ready-to-move and under-construction (phased projects). */
    MIXED_STATUS,

    /** Status could not be determined from available sources. */
    UNKNOWN
}
