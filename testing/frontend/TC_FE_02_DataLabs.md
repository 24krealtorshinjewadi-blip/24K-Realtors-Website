# 📊 TC_FE_02 — Frontend 24K Data Labs Market Intelligence Test Cases
**Module**: 24K Data Labs (Real Estate Analytics & ROI Engine)  
**URL**: `https://24krealtors.in` (Data Labs tab) / `http://localhost:5173`  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Scenario | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| TC-FE-DL-001 | Micro-Market Live Marquee Ticker | 1. Open 24K Data Labs tab | Telemetry marquee scrolls live Pune appreciation stats | ✅ PASS | Smooth animation |
| TC-FE-DL-002 | 5-Year CAGR Price Appreciation Graph | 1. Click "Hinjewadi Phase 1" tab | SVG chart renders historical CAGR & 2027 price forecast | ✅ PASS | High-DPI SVG line chart |
| TC-FE-DL-003 | Real Estate vs FD vs Gold ROI Simulator | 1. Enter ₹1 Crore principal<br>2. Set 5 Year horizon | Calculates CAGR & Net Returns for Property (15.8%), Gold (9.5%), FD (6.8%) | ✅ PASS | Verified ROI formulas |
| TC-FE-DL-004 | Head-to-Head Corridor Comparison | 1. Select Baner vs Hinjewadi | Renders side-by-side infra & rental yield scores | ✅ PASS | Matrix table clean |
| TC-FE-DL-005 | Forbes Macro Risk Audit Assessment | 1. Inspect Macro Risk Index section | Displays RERA compliance & inventory absorption risk scores | ✅ PASS | Audit badges render |
| TC-FE-DL-006 | Export Market Intelligence PDF Report | 1. Click "Export Telemetry Report" | Downloads PDF document of analytics | ✅ PASS | Clean PDF output |
