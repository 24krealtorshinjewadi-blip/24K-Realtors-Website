# 🔵 TC_BE_02 — Backend Properties API Test Cases
**Module**: Properties CRUD & Filtering  
**Base URL**: `https://twentyfourk-backend-production.up.railway.app/api/v1`  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Endpoint | Method | Params | Expected | Actual Status | Status | Issue |
|---|---|---|---|---|---|---|---|
| TC-BE-PROP-001 | `/properties` | GET | `page=0&size=5` | 200 + paginated list | 200 | ✅ PASS | — |
| TC-BE-PROP-002 | `/properties` | GET | `location=HINJEWADI` | 200 + filtered results | 200 | ✅ PASS | — |
| TC-BE-PROP-003 | `/properties` | GET | `bhk=3` | 200 + 3BHK results | 200 | ✅ PASS | — |
| TC-BE-PROP-004 | `/properties` | GET | `transactionType=RENT` | 200 + RENT listings | 200 | ✅ PASS | — |
| TC-BE-PROP-005 | `/properties` | GET | `transactionType=BUY` | 200 + BUY listings | 200 | ✅ PASS | — |
| TC-BE-PROP-006 | `/properties/{id}` | GET | `id=1` (valid) | 200 + property object | 500 | ❌ FAIL | **BUG-004**: GET by ID 1 returns 500 — possible null pointer or DB mapping issue |
| TC-BE-PROP-007 | `/properties/{id}` | GET | `id=99999` (invalid) | 404 Not Found | 500 | ❌ FAIL | **BUG-005**: Non-existent property returns 500 instead of 404 |
| TC-BE-PROP-008 | `/localities` | GET | — | 200 + locality list | 200 | ✅ PASS | — |
| TC-BE-PROP-009 | `/societies` | GET | `page=0&size=5` | 200 + society list | 200 | ✅ PASS | — |
| TC-BE-PROP-010 | `/blogs` | GET | `page=0&size=3` | 200 + blog list | 200 | ✅ PASS | — |

---

## 🐛 Bugs Found

### BUG-004 — GET Property by ID Returns 500
- **Severity**: HIGH
- **Endpoint**: `GET /api/v1/properties/{id}`
- **Root Cause**: Likely a NullPointerException during entity-to-DTO mapping when some field (e.g., `society`, `media`, `locality`) is null or lazily-loaded fails outside of transaction context.
- **Fix Required**: 
  1. Add `@Transactional(readOnly = true)` on the service method.
  2. Add null-safe checks in the DTO mapper.
  3. Add `@ControllerAdvice` global exception handler to return 404 when entity is not found.

### BUG-005 — Non-Existent Resource Returns 500 Instead of 404
- **Severity**: MEDIUM
- **Endpoint**: `GET /api/v1/properties/{id}` with non-existent ID
- **Root Cause**: `orElseThrow()` throws unhandled RuntimeException.
- **Fix Required**: Global `@ControllerAdvice` + custom `ResourceNotFoundException` class returning 404.
