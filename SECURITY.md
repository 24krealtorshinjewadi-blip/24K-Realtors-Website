# 🔒 Security Policy

## Supported Versions

| Version | Support Status |
|---------|---------------|
| `main` (latest) | ✅ Actively supported |
| Older branches | ❌ Not supported |

---

## 🚨 Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub Issues.**

If you discover a security vulnerability in 24K Realtors, please report it responsibly:

### Contact
- **Email:** manishrajapakar@gmail.com
- **Subject Line:** `[SECURITY] <brief description>`
- **Response Time:** We aim to acknowledge within **48 hours** and provide a resolution within **7 days**.

### What to Include
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact (data exposure, privilege escalation, etc.)
4. Suggested fix (optional but appreciated)

---

## 🛡️ Security Scope

### In Scope
- Authentication bypass (OTP, JWT, Google OAuth)
- SQL Injection via API endpoints
- Unauthorized data access (leads, user PII)
- Exposed API keys or credentials in source code
- Cross-Site Scripting (XSS) in the portal
- CSRF on authenticated endpoints

### Out of Scope
- Issues in third-party services (Google, Vercel, Railway)
- Issues requiring physical access
- Social engineering attacks

---

## ✅ Our Security Practices
- All authentication via Spring Security + JWT
- OTP-based verification for login
- No credentials or API keys in source control (`.gitignore` enforced)
- HTTPS-only in production (Vercel + Railway)
- Database credentials managed via environment variables
