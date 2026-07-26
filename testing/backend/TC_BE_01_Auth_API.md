# 🔴 TC_BE_01 — Backend Auth API Test Cases
**Module**: Authentication & JWT Security  
**Base URL**: `https://twentyfourk-backend-production.up.railway.app/api/v1/auth`  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Endpoint | Method | Payload | Expected | Actual | Status | Issue |
|---|---|---|---|---|---|---|---|
| TC-BE-AUTH-001 | `/auth/register` | POST | `{username, password:"Weak1"}` | 400 Bad Request | 400 | ✅ PASS | — |
| TC-BE-AUTH-002 | `/auth/register` | POST | `{username, password:"StrongP@ss1"}` | 201 Created | 201 | ✅ PASS | — |
| TC-BE-AUTH-003 | `/auth/login` | POST | `{username:"invalid", password:"wrong"}` | 401 Unauthorized | 500 | ❌ FAIL | **BUG-001**: Invalid credentials returns 500 instead of 401 |
| TC-BE-AUTH-004 | `/auth/login-init` | POST | `{username:"invalid", password:"wrong"}` | 401 Unauthorized | 500 | ❌ FAIL | **BUG-001**: Same issue — `authenticationManager.authenticate()` throws uncaught exception |
| TC-BE-AUTH-005 | `/auth/identify` | POST | `{"identifier":"notfound@qa.com"}` | 400 Bad Request | 400 | ✅ PASS | — |
| TC-BE-AUTH-006 | `/auth/identify` | POST | `{"identifier":"12345"}` | 400 Bad Request (invalid mobile) | 400 | ✅ PASS | — |
| TC-BE-AUTH-007 | `/auth/verify-otp` | POST | `{tempToken:"invalid", otp:"000000"}` | 401 Unauthorized | 401 | ✅ PASS | — |
| TC-BE-AUTH-008 | `/auth/refresh` | POST | `{refreshToken:"invalid"}` | 500/Error | 500 | ⚠️ PARTIAL | Should return 400/401 not 500 — **BUG-002** |
| TC-BE-AUTH-009 | `/auth/google-login` | POST | Invalid JWT token | 500 Error | 500 | ❌ FAIL | **BUG-003**: Google login does not validate JWT signature — security risk |

---

## 🐛 Bugs Found

### BUG-001 — Auth Login Returns HTTP 500 on Invalid Credentials
- **Severity**: HIGH
- **Endpoint**: `POST /api/v1/auth/login` and `POST /api/v1/auth/login-init`
- **Root Cause**: `authenticationManager.authenticate()` throws `BadCredentialsException` which is not caught by a `@ControllerAdvice` global exception handler — Spring defaults to 500.
- **Response Body**: `{"status":500,"message":"Bad credentials","timestamp":...}`
- **Fix Required**: Add `try/catch` for `BadCredentialsException` in both endpoints and return `ResponseEntity.status(401).body("Invalid username or password")`.
- **Fix Priority**: 🔴 HIGH — Exposes internal error stack to clients

### BUG-002 — Token Refresh Returns 500 on Invalid Token
- **Severity**: MEDIUM
- **Endpoint**: `POST /api/v1/auth/refresh`
- **Root Cause**: `Optional.orElseThrow()` throws RuntimeException which bubbles up as 500.
- **Fix Required**: Catch the exception and return 401 Unauthorized.

### BUG-003 — Google Login Does Not Validate JWT Signature
- **Severity**: HIGH — SECURITY
- **Endpoint**: `POST /api/v1/auth/google-login`
- **Root Cause**: Backend only Base64-decodes the JWT payload without verifying the Google signature. Any forged JWT with valid structure will be accepted.
- **Fix Required**: Use Google's public keys or Firebase Admin SDK to verify the token.
