# 🧪 24K Realtors — Professional QA Testing Suite

**Project**: 24K Real Estate Digital Marketing Platform & CRM ERP  
**Stack**: React 18 + Vite (Frontend) | Spring Boot 3 + PostgreSQL (Backend)  
**Environment**: Vercel (Frontend) | Railway (Backend)  

---

## 📁 Folder Structure
```
testing/
├── README.md                        ← This file — Testing guide & standards
├── frontend/                        ← Frontend (React/Vite) test cases
│   ├── TC_FE_01_Portal.md           ← Advisory Portal & Search HUD
│   ├── TC_FE_02_DataLabs.md         ← 24K Data Labs Market Intelligence
│   ├── TC_FE_03_ListProperty.md     ← 0% Commission SELL/RENT Portal
│   ├── TC_FE_04_PropertyDetail.md   ← Property Detail View & Gallery
│   ├── TC_FE_05_Dashboard.md        ← Executive CRM Dashboard
│   ├── TC_FE_06_Auth.md             ← Authentication & MFA Login
│   └── TC_FE_07_Navigation.md       ← Hash Routing & State Persistence
├── backend/                         ← Backend (Spring Boot) API test cases
│   ├── TC_BE_01_Auth_API.md         ← Auth & JWT API endpoints
│   ├── TC_BE_02_Properties_API.md   ← Properties CRUD API
│   ├── TC_BE_03_Leads_API.md        ← Lead Capture API
│   ├── TC_BE_04_CRM_API.md          ← CRM Dashboard & User Management
│   └── TC_BE_05_HRMS_API.md         ← HRMS Attendance, Leaves & Payroll
├── integration/                     ← End-to-End integration scenarios
│   └── TC_INT_01_E2E_Flows.md
├── regression/                      ← Bug fixes & regression log
│   └── TC_REG_01_Regression_Log.md
└── reports/                         ← Daily QA Audit Reports
    └── REPORT_2026_07_26.md
```

## 🚦 Status Legend
| Symbol | Meaning |
|:---:|:---|
| ✅ PASS | Test passed successfully |
| ❌ FAIL | Test failed — bug found & logged |
| ⚠️ PARTIAL | Partially working — needs review |
| 🔄 BLOCKED | Blocked by environment dependency |
| 🆕 NEW | New test added this session |

## 🔧 Quick API Test (PowerShell)
```powershell
$base = "https://twentyfourk-backend-production.up.railway.app/api/v1"
# Test public properties endpoint
Invoke-RestMethod -Uri "$base/properties?page=0&size=5" -Method GET
```

## 📋 Google Sheets Live QA Matrix
Live sheet updated daily: https://docs.google.com/spreadsheets/d/1CnvXUCMBlRoLbWKPNknJc_EfarNlSslvSFkDurHzqnM/edit
