# 🏢 TC_FE_05 — Frontend Executive CRM & HRMS Dashboard Test Cases
**Module**: Executive Admin & CRM Dashboard  
**URL**: `https://24krealtors.in/#login` -> `/dashboard`  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Scenario | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| TC-FE-DB-001 | Forbes Command Telemetry Ticker | 1. Open Dashboard header | Tickers live pipeline volume (₹42.8 Cr) & conversion stats | ✅ PASS | Marquee animation active |
| TC-FE-DB-002 | 5 Executive KPI Metric Cards | 1. Inspect top KPI row | Displays Total Leads, New Leads, In Conversation, Converted Deals, Active Listings | ✅ PASS | Glassmorphic styling |
| TC-FE-DB-003 | Lead Kanban Board Drag & Drop | 1. Drag Lead card from "NEW" to "IN_CONVERSATION" | Pipeline status updates in DB & UI re-renders | ✅ PASS | Smooth drag & drop state update |
| TC-FE-DB-004 | Relationship Manager Assignment | 1. Select RM from dropdown for Lead | Lead assigned to agent & database updated | ✅ PASS | Dropdown sync verified |
| TC-FE-DB-005 | Property Inventory Creator & GIS Map | 1. Click "Add Property"<br>2. Fill details & coordinates | Property saved + Leaflet map pin added | ✅ PASS | Leaflet map pin renders |
| TC-FE-DB-006 | HRMS Employee Provisioning & Payroll | 1. Switch to "Employees (HR)" tab | Displays employee roster, check-in log & salary calculator | ✅ PASS | Role-based tab permissions active |
