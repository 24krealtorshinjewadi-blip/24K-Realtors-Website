# 🧭 TC_FE_07 — Frontend Navigation & State Persistence Test Cases
**Module**: Routing, Hash Navigation & F5 State Recovery  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Scenario | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| TC-FE-NAV-001 | Single Page Hash Routing (`#list-property`) | 1. Click "⚜️ SELL/RENT" in navbar | Navigation changes view & address bar updates hash to `#list-property` | ✅ PASS | Smooth SPA transition |
| TC-FE-NAV-002 | Browser Refresh (F5) State Recovery | 1. Navigate to 24K Data Labs<br>2. Press F5 | Page reloads & stays on 24K Data Labs view | ✅ PASS | Restored from sessionStorage |
| TC-FE-NAV-003 | Clear Hash on Back Navigation | 1. Click "Back to Advisor" from SELL/RENT | Hash cleared from URL address bar | ✅ PASS | Clean URL restored |
| TC-FE-NAV-004 | Browser Back (←) & Forward (→) | 1. Navigate through 3 views<br>2. Click browser Back button | Restores previous view state seamlessly | ✅ PASS | History state preserved |
