# 📊 TC_BE_04 — Backend CRM & Dashboard API Test Cases
**Module**: Executive CRM Telemetry & Inventory Management  
**Base URL**: `https://twentyfourk-backend-production.up.railway.app/api/v1`  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Endpoint | Method | Params/Body | Expected | Status | Notes |
|---|---|---|---|---|---|---|
| TC-BE-CRM-001 | `/dashboard/stats` | GET | Authenticated Header | 200 + KPI Object | ✅ PASS | Returns total, new, contacted, converted stats |
| TC-BE-CRM-002 | `/properties` | POST | `{title, price, location, bhk}` | 201 Created | ✅ PASS | Authenticated property creation |
| TC-BE-CRM-003 | `/properties/{id}` | PUT | Property update object | 200 Updated | ✅ PASS | Inventory update |
| TC-BE-CRM-004 | `/agents` | GET | — | 200 + Agent List | ✅ PASS | Returns active Relationship Managers |
