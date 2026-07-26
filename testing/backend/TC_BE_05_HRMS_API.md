# 👥 TC_BE_05 — Backend HRMS & Payroll ERP API Test Cases
**Module**: HRMS Employee Profiles, Geo Attendance & Salary Slips  
**Base URL**: `https://twentyfourk-backend-production.up.railway.app/api/v1`  
**Tested**: 26 July 2026  

---

## Test Cases

| TC ID | Endpoint | Method | Params/Body | Expected | Status | Notes |
|---|---|---|---|---|---|---|
| TC-BE-HR-001 | `/employees` | GET | `?page=0&size=10` | 200 + Employee List | ✅ PASS | Returns active employee profiles |
| TC-BE-HR-002 | `/attendance/check-in` | POST | `{employeeId, latitude, longitude}` | 200 Checked-In | ✅ PASS | Geo-fence check-in logged |
| TC-BE-HR-003 | `/leaves` | POST | `{employeeId, leaveType, startDate, endDate}` | 201 Submitted | ✅ PASS | Leave request submitted |
| TC-BE-HR-004 | `/payroll/calculate` | GET | `?employeeId=1&month=7&year=2026` | 200 + Payslip DTO | ✅ PASS | Salary breakdown calculated |
