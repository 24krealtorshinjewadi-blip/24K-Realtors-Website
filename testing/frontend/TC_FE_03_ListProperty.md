# 🏡 TC_FE_03 — Frontend 0% Commission SELL / RENT Owner Portal Test Cases
**Module**: 0% Commission SELL / RENT Portal  
**URL**: `https://24krealtors.in/#list-property` / `http://localhost:5173/#list-property`  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Scenario | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| TC-FE-LP-001 | Segmented Switcher (SELL vs RENT) | 1. Click "LIST FOR RENT" toggle | Form fields switch to Monthly Rent & Furnishing status | ✅ PASS | Smooth tab transition |
| TC-FE-LP-002 | Real-Time Live Preview Card Update | 1. Enter title "3 BHK Apartment in Baner"<br>2. Set price ₹1.2 Cr | Right side Live Preview Card updates in real-time | ✅ PASS | Live state sync verified |
| TC-FE-LP-003 | AI Valuation Telemetry Meter | 1. Select area Hinjewadi<br>2. Enter Carpet Area 1150 sq.ft | Calculates Low (₹78L), Avg (₹89L), High (₹1.02Cr) valuation | ✅ PASS | Valuation benchmarks accurate |
| TC-FE-LP-004 | 4K Photo Drag & Drop Upload | 1. Drag & drop 3 property images | Thumbnails preview created with removal buttons | ✅ PASS | Image previews rendered |
| TC-FE-LP-005 | Owner Mandate Lead Submission | 1. Fill Name & Phone<br>2. Click "Submit Property Mandate" | Submits lead to Railway backend DB with success notification | ✅ PASS | Verified lead creation |
| TC-FE-LP-006 | 4K Luxury Video Background Loop | 1. Inspect background element | Plays 1080p HTML5 luxury video loop with dark glass overlay | ✅ PASS | Coverr CDN stream smooth |
| TC-FE-LP-007 | Back Navigation Hash Reset | 1. Click "Back to Advisor" | Returns to Portal & clears `#list-property` from address bar | ✅ PASS | Hash cleared cleanly |
