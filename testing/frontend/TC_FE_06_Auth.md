# 🔐 TC_FE_06 — Frontend Authentication & MFA Login Test Cases
**Module**: Authentication, MFA & Identity-First Login  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Scenario | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| TC-FE-AUTH-001 | Identify Step (Email/Mobile) | 1. Enter email/mobile in login modal | Auto-detects identifier type, requests OTP | ✅ PASS | Smooth identifier-first flow |
| TC-FE-AUTH-002 | MFA 6-Digit OTP Entry | 1. Input 6-digit OTP code | Authorizes session, stores JWT token | ✅ PASS | Auto-focus next input box |
| TC-FE-AUTH-003 | Google OAuth Sign-In | 1. Click "Continue with Google" | Opens Google identity popup, authenticates user | ✅ PASS | JWT token stored |
| TC-FE-AUTH-004 | Session Logout | 1. Click "Logout Session" in Dashboard | Clears JWT & Refresh tokens, returns to Portal | ✅ PASS | LocalStorage cleared |
