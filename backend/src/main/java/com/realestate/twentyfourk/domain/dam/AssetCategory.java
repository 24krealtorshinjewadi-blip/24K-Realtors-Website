package com.realestate.twentyfourk.domain.dam;

public enum AssetCategory {
    HERO,
    GALLERY,
    PROPERTY_VIDEO,
    WALKTHROUGH_VIDEO,
    DRONE_VIDEO,
    BROCHURE_PDF,
    MASTER_PLAN,
    FLOOR_PLAN,
    BUILDER_LOGO,
    COMPANY_LOGO,
    AVATAR,
    MARKETING,
    SOCIAL;

    public String toS3Subfolder() {
        return switch (this) {
            case HERO, GALLERY -> "gallery";
            case PROPERTY_VIDEO, WALKTHROUGH_VIDEO, DRONE_VIDEO -> "videos";
            case BROCHURE_PDF, MASTER_PLAN, FLOOR_PLAN -> "documents";
            case BUILDER_LOGO, COMPANY_LOGO -> "logos";
            case AVATAR -> "avatars";
            case MARKETING, SOCIAL -> "marketing";
        };
    }
}
