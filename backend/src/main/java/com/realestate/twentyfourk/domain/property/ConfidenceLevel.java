package com.realestate.twentyfourk.domain.property;

/**
 * Field-level confidence scoring for property intelligence data.
 *
 * HIGH       = Official source + RERA verified (two independent confirmations)
 * MEDIUM     = Official/credible source + secondary verification
 * LOW        = Only one credible source available
 * UNVERIFIED = Could not verify from any reliable source
 *
 * Every important data field in the property intelligence database should
 * carry a confidence level to support transparency and trust.
 */
public enum ConfidenceLevel {

    /** Verified from MahaRERA + official developer source (or two+ independent credible sources). */
    HIGH,

    /** Verified from one official/credible source + at least one secondary source. */
    MEDIUM,

    /** Only one credible source found; no independent confirmation. */
    LOW,

    /** No reliable verification possible. Display "Not publicly verified". */
    UNVERIFIED
}
