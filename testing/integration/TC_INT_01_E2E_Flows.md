# 🔄 TC_INT_01 — End-to-End Integration Flow Test Cases
**Module**: Cross-Layer Integration (Frontend ↔ Backend ↔ Database)  
**Tested**: 26 July 2026  

---

## E2E Integration Test Cases

| Scenario ID | Flow Description | Steps | Verified Outcome | Status |
|---|---|---|---|---|
| INT-E2E-001 | Visitor Lead Capture → CRM Lead Board | 1. User submits callback form on Portal<br>2. API POST `/leads/callback`<br>3. Admin logs into Dashboard | Lead appears under "NEW" column in CRM Kanban board with timestamp | ✅ PASS |
| INT-E2E-002 | Owner Listing Submission → Property Inventory | 1. Owner completes 4-step form on `/#list-property`<br>2. API POST `/properties`<br>3. Broker approves in CRM | New property listing appears live on Advisory Portal search | ✅ PASS |
| INT-E2E-003 | AI Chat Lead Qualification → RM Notification | 1. User asks Gemini AI chat for 3BHK Hinjewadi<br>2. User provides phone number in chat<br>3. AI detects phone & calls lead API | Lead auto-tagged as "AI-QUALIFIED" in CRM with assigned RM | ✅ PASS |
| INT-E2E-004 | MFA OTP Authentication Flow | 1. Admin enters username & password<br>2. Backend generates OTP & sends via SMS/WhatsApp<br>3. User enters OTP code | Session token issued, Dashboard unlocks | ✅ PASS |
| INT-E2E-005 | HR Attendance Check-In → Monthly Payroll | 1. Employee clicks "Check-In" in HRMS tab<br>2. Attendance recorded with geo-location<br>3. HR runs end-of-month payroll | Payslip generated deducting unapproved leaves automatically | ✅ PASS |
