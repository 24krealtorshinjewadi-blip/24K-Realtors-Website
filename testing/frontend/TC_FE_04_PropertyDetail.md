# 🔍 TC_FE_04 — Frontend Property Detail View & Gallery Test Cases
**Module**: Property Detail View & Financial Calculators  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Scenario | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| TC-FE-PD-001 | Full-Screen Image Lightbox Gallery | 1. Click main property cover photo | Opens modal lightbox gallery with thumbnail strip | ✅ PASS | Keyboard arrow navigation works |
| TC-FE-PD-002 | Interactive 2D/3D Floor Plan Tabs | 1. Click "3 BHK Floor Plan" tab | Displays 3 BHK layout dimensions and sq.ft breakdown | ✅ PASS | Layout images switch smoothly |
| TC-FE-PD-003 | Stamp Duty & EMI Calculator | 1. Adjust Down Payment slider to 20% | Re-calculates Monthly EMI + Stamp Duty (5%) + Metro Cess (1%) | ✅ PASS | Financial math verified |
| TC-FE-PD-004 | Locality Infra Score Breakdown | 1. Scroll to Neighborhood Score | Displays Commute (9.2/10), Greenery (8.4/10), Social (8.7/10) | ✅ PASS | Animated score bars |
| TC-FE-PD-005 | Similar Properties Recommendation | 1. Scroll to bottom recommendations | Shows 3 similar listings in same locality | ✅ PASS | Recommendation engine working |
| TC-FE-PD-006 | Parallax Penthouse Background | 1. Scroll page vertically | Background fixed parallax effect active | ✅ PASS | Smooth 60fps parallax |
