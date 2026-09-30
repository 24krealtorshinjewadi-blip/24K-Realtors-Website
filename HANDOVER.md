# 🏛️ 24K Realtors — Official Production Handover Document

**Recipient Organization:** 24K Realtors Hinjewadi (`24krealtorshinjewadi-blip`)  
**Repository:** [24K-Realtors-Website](https://github.com/24krealtorshinjewadi-blip/24K-Realtors-Website)  
**Handover Date:** September 2026  
**Platform Status:** ✅ Production Live & Verified

---

## 📌 Executive Summary

This repository contains the complete, production-grade source code for the **24K Realtors Digital Ecosystem**, comprising:
1. **Luxury Consumer Web Portal (Frontend):** Modern, ultra-responsive React 18 + Vite SPA with interactive MahaRERA verified project showcases, dynamic EMI calculator, micro-location landing pages (Hinjewadi Phase 1, Phase 2, Phase 3, Mahalunge), AI property search, and dynamic e-brochure generator.
2. **Enterprise Property & CRM API (Backend):** Robust Spring Boot 3.3 (Java 21) REST API managing property intelligence, RERA dossiers, lead ingestion pipelines, role-based authentication (JWT), and automated sync.
3. **Voice TTS Microservice (`tts-service`):** Node.js Express audio generator for automated property audio summaries.
4. **Google Apps Script Automation (`google-apps-script`):** Bi-directional webhook integration for real-time lead capture into Google Sheets.

---

## 🌐 Production Deployments

| Component | Platform | URL / Endpoint |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel Edge | `https://real-estate-digital-marketing.vercel.app` |
| **Backend REST API** | Railway | `https://twentyfourk-backend-production.up.railway.app` |
| **Master Lead Database** | PostgreSQL 15 | Hosted on Railway Cloud Database Cluster |
| **Lead Tracking Sheet** | Google Sheets | Connected via Google Apps Script Webhook |

---

## 🏗️ Architecture & Tech Stack

- **Frontend:** React 18.3, Vite 5.4, Vanilla CSS Design System, Lucide Icons, Google Fonts (Cinzel, Montserrat).
- **Backend:** Spring Boot 3.3.x, Java 21 LTS, Spring Data JPA, Hibernate, Flyway Migrations, Spring Security 6 (Stateless JWT).
- **Database:** PostgreSQL 15 with automated Flyway versioned migrations (`V1` through `V24`).
- **Integrations:**
  - Resend HTTP API (Transactional customer & advisor emails)
  - Fast2SMS / Twilio (Indian SMS OTP delivery)
  - Meta WhatsApp Cloud API (Automated lead introduction notifications)
  - Google Gemini 1.5 Flash (AI conversational real estate search)
  - AWS S3 (High-resolution media and brochure storage)

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Java 21 LTS** or higher
- **Node.js 20 LTS** or higher (`npm` v10+)
- **PostgreSQL 15** (or Docker for local container)

### 2. Environment Configuration
Template files with detailed parameter instructions have been provided:
- **Backend Template:** [`.env.backend.example`](./.env.backend.example)
- **Frontend Template:** [`frontend/.env.example`](./frontend/.env.example)

> ⚠️ **Security Notice:** Real production secrets (API keys, DB credentials, JWT secrets) are never committed to version control. Set them in your hosting environment variables (Railway & Vercel) or copy to `.env.local` for local development.

### 3. Running Backend Locally
```bash
cd backend
# Uses Maven wrapper included in repo
./mvnw clean spring-boot:run
```
Default API port: `http://localhost:8080/api/v1`  
Actuator health check: `http://localhost:8080/actuator/health`

### 4. Running Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Default frontend port: `http://localhost:5173`

### 5. Running TTS Microservice (Optional)
```bash
cd tts-service
npm install
node server.js
```
Default port: `http://localhost:5000`

---

## 🔒 Security & Credential Rotation Guidelines

Before transferring full operational ownership:
1. **JWT Secret:** Generate a new 64-character base64 secret using `openssl rand -base64 64` and set `JWT_SECRET` in Railway.
2. **Admin Credentials:** Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Railway environment variables.
3. **Resend / Meta / Fast2SMS API Keys:** Replace developer testing tokens with company-owned enterprise API keys.
4. **AWS S3 Credentials:** Ensure the S3 bucket policy is locked to `ap-south-1` (Mumbai) and rotate `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`.

---

## 📁 Repository Cleanliness & Handover Compliance

This repository has been sanitized strictly for production handover:
- ✅ Zero build artifacts committed (`target/`, `dist/` excluded).
- ✅ Zero `node_modules` committed across all microservices and frontend.
- ✅ Zero plaintext secret keys or database passwords committed.
- ✅ Strict `.gitignore` enforced across root, backend, frontend, and tts-service.
- ✅ Complete test case documentation included in [`testing/`](./testing/).
