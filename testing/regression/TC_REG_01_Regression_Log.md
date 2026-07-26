# 🛡️ TC_REG_01 — Bug Regression & Verification Log
**Module**: Bug Fix Tracking & Regression Test Log  
**Tested**: 26 July 2026  

---

## Regression Test Log

| Bug ID | Component | Summary | Root Cause | Fix Applied | Regression Status |
|---|---|---|---|---|---|
| BUG-001 | `AuthController` | Login returns 500 on wrong creds | `BadCredentialsException` uncaught in API controller | Added `@ExceptionHandler(BadCredentialsException.class)` returning HTTP 401 | ✅ RESOLVED |
| BUG-002 | `AuthController` | Refresh token 500 on invalid token | Unhandled `RuntimeException` | Caught exception and returned HTTP 401 Unauthorized | ✅ RESOLVED |
| BUG-004 | `PropertyController` | GET by ID returns 500 on invalid UUID string | Missing argument type mismatch exception handler | Added `@ExceptionHandler(MethodArgumentTypeMismatchException.class)` returning 400 | ✅ RESOLVED |
| BUG-005 | `PropertyController` | Invalid ID returns 500 instead of 404 | Missing `ResourceNotFoundException` handler | Added `ResourceNotFoundException` returning HTTP 404 | ✅ RESOLVED |
| BUG-006 | `ListPropertyPage` | Missing icon imports (`ShieldCheck`, `Key`) | Undefined React icons causing page crash | Imported missing icons from `lucide-react` | ✅ RESOLVED |
| BUG-007 | `Portal.jsx` | F5 Refresh jumps back to SELL/RENT | Hash routing mismatch on page reload | Tied `activeSection` to `sessionStorage` & `pushState` | ✅ RESOLVED |
| BUG-008 | `ListPropertyPage` | CORS blocking on video background | External video link blocked by Vercel CORS | Replaced with Coverr CDN CORS-enabled MP4 stream | ✅ RESOLVED |
