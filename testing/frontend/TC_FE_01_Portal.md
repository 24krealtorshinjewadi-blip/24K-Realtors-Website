# 🟢 TC_FE_01 — Frontend Advisory Portal & Search HUD Test Cases
**Module**: Advisory Home Portal  
**URL**: `https://24krealtors.in` (Production) / `http://localhost:5173` (Dev)  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Scenario | Steps | Expected | Status | Issue |
|---|---|---|---|---|---|
| TC-FE-P-001 | Homepage loads without errors | 1. Open URL | No JS errors in console, hero section visible | ✅ PASS | — |
| TC-FE-P-002 | Search by Location (Hinjewadi) | 1. Select "HINJEWADI" dropdown<br>2. Click Search | Property grid filters to Hinjewadi listings | ✅ PASS | — |
| TC-FE-P-003 | BHK Filter - 3 BHK | 1. Click "3 BHK" filter pill | Grid updates to 3 BHK listings | ✅ PASS | — |
| TC-FE-P-004 | Price Slider Filtering | 1. Set min to ₹80L, max to ₹1.5Cr | Properties in range visible | ✅ PASS | — |
| TC-FE-P-005 | Callback Form - Valid Submit | 1. Enter valid name + 10 digit phone<br>2. Click Submit | Success toast + lead saved to DB | ✅ PASS | — |
| TC-FE-P-006 | Callback Form - Invalid Phone | 1. Enter "12345" as phone<br>2. Click Submit | Validation error shown | ✅ PASS | — |
| TC-FE-P-007 | Wishlist Toggle | 1. Click heart icon on property card | Heart turns red, wishlist count increases | ✅ PASS | — |
| TC-FE-P-008 | Compare Overlay (3 properties) | 1. Select "Compare" on 3 cards | Compare bar appears at bottom | ✅ PASS | — |
| TC-FE-P-009 | WhatsApp Inquiry Button | 1. Click WhatsApp button on any card | Opens wa.me with pre-filled text | ✅ PASS | — |
| TC-FE-P-010 | Mobile Responsive Layout | 1. Resize browser to 375px width | Cards stack to 1-column, nav collapses | ✅ PASS | — |
| TC-FE-P-011 | AI Chat Widget Opens | 1. Click AI chatbot button (bottom right) | Chat window slides up with gold glassmorphism | ✅ PASS | — |
| TC-FE-P-012 | Data Labs Navigation | 1. Click "24K Data Labs" nav button | Navigates to Data Labs view | ✅ PASS | — |
| TC-FE-P-013 | RERA Filter Toggle | 1. Click "RERA Verified" filter | Unverified listings hidden | ⚠️ PARTIAL | Filter pill renders but backend filter not confirmed |
| TC-FE-P-014 | Video Background (Hero) | 1. Inspect hero section background | 1080p video plays muted in loop | ✅ PASS | — |
| TC-FE-P-015 | PDF Brochure Download | 1. Click brochure icon on property card | Modal preview shows, PDF downloads | ✅ PASS | — |

---

## ⚠️ Partial Issues

### PARTIAL-001 — RERA Filter Frontend/Backend Disconnect
- **Module**: TC-FE-P-013
- **Details**: UI shows RERA filter pill, but the backend `/properties` endpoint doesn't appear to have `&reraVerified=true` filter parameter documented. Needs backend verification.
