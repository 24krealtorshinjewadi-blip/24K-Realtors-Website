# 📞 TC_BE_03 — Backend Leads API Test Cases
**Module**: Lead Capture & WhatsApp Integration API  
**Base URL**: `https://twentyfourk-backend-production.up.railway.app/api/v1/leads`  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Endpoint | Method | Payload | Expected | Actual Status | Status | Notes |
|---|---|---|---|---|---|---|---|
| TC-BE-LEAD-001 | `/leads/callback` | POST | `{"name":"QA Lead","phone":"9876543210"}` | 200 OK | 403 / 200 | ⚠️ PARTIAL | Public endpoint requires CORS/Security permit |
| TC-BE-LEAD-002 | `/leads/callback` | POST | `{"name":"QA Lead","phone":"123"}` | 400 Bad Request | 400 | ✅ PASS | Validation works |
| TC-BE-LEAD-003 | `/leads` | GET | `?page=0&size=10` | 200 (Authenticated) | 200 | ✅ PASS | Authenticated RM view |
| TC-BE-LEAD-004 | `/leads/{id}/status` | PUT | `{"status":"IN_CONVERSATION"}` | 200 Updated | 200 | ✅ PASS | Pipeline status updated |
