<div align="center">

# 🏠 24K Realtors — Premium Real Estate Platform

**Pune's Most Trusted Real Estate Consultants**

[![CI — Build & Test](https://github.com/manishrai99-afk/24k-real-Estate-Digital-marketing/actions/workflows/ci.yml/badge.svg)](https://github.com/manishrai99-afk/24k-real-Estate-Digital-marketing/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://real-estate-digital-marketing.vercel.app)

[🌐 Live Demo](https://real-estate-digital-marketing.vercel.app) · [🐛 Report Bug](https://github.com/manishrai99-afk/24k-real-Estate-Digital-marketing/issues/new?template=bug_report.yml) · [✨ Request Feature](https://github.com/manishrai99-afk/24k-real-Estate-Digital-marketing/issues/new?template=feature_request.yml)

</div>

---

## 📖 About

24K Realtors is a **full-stack SaaS real estate platform** built for Pune's premium property market. It combines a consumer-facing property portal with a powerful internal CRM for managing leads, follow-ups, site visits, and agent operations.

### Key Capabilities
- 🏘️ **Property Portal** — Search, filter, and explore premium Pune properties
- 📋 **Lead CRM** — Full lead lifecycle management with WhatsApp integration
- 🔒 **OTP Authentication** — SMS-based OTP login with JWT sessions
- 🤖 **AI Chat Assistant** — Gemini-powered property advisor for visitors
- 📊 **Analytics Dashboard** — Live lead funnel, conversion stats, attendance
- 📱 **WhatsApp Notifications** — Automated messages for site visits and follow-ups

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│   React 18 + Vite  →  Deployed on Vercel CDN    │
└────────────────────┬────────────────────────────┘
                     │ HTTPS REST API
┌────────────────────▼────────────────────────────┐
│                   BACKEND                        │
│   Spring Boot 3 + Java 21  →  Railway.app       │
│   Spring Security + JWT + OTP                   │
└────────────────────┬────────────────────────────┘
                     │ JDBC / JPA
┌────────────────────▼────────────────────────────┐
│                  DATABASE                        │
│   PostgreSQL 15  →  Railway Managed DB          │
│   Schema managed by Flyway migrations           │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Vanilla CSS |
| **Backend** | Spring Boot 3, Java 21, Maven |
| **Database** | PostgreSQL 15, Flyway Migrations |
| **Auth** | Spring Security, JWT, OTP (SMS), Google OAuth |
| **AI** | Google Gemini API |
| **Notifications** | Fast2SMS (WhatsApp/SMS), JavaMail (Email) |
| **Hosting** | Vercel (Frontend), Railway (Backend + DB) |
| **CI/CD** | GitHub Actions |

---

## 🚀 Quick Start

### Prerequisites
- Java 21+, Node.js 20+, Docker (for local DB)

### 1. Clone
```bash
git clone https://github.com/manishrai99-afk/24k-real-Estate-Digital-marketing.git
cd "24k-real-Estate-Digital-marketing"
```

### 2. Start Database
```bash
docker run -d --name 24k-postgres \
  -e POSTGRES_DB=twentyfourk_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 postgres:15
```

### 3. Start Backend
```bash
cd backend
# Configure application.yml with your DB credentials
./mvnw spring-boot:run
# API available at: http://localhost:8080/api/v1
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Portal available at: http://localhost:5173
```

---

## 🌍 Environment Variables

### Backend (`backend/src/main/resources/application.yml`)
| Variable | Description |
|----------|-------------|
| `spring.datasource.url` | PostgreSQL JDBC URL |
| `spring.datasource.username` | DB username |
| `spring.datasource.password` | DB password |
| `app.jwt.secret` | JWT signing secret (min 32 chars) |
| `fast2sms.api.key` | Fast2SMS API key for OTP/WhatsApp |
| `spring.mail.*` | Gmail SMTP credentials for email |
| `google.oauth.client-id` | Google OAuth2 Client ID |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI chat |

---

## 📁 Project Structure

```
24k-real-Estate-Digital-marketing/
├── backend/                  # Spring Boot application
│   ├── src/main/java/
│   │   └── com/realestate/twentyfourk/
│   │       ├── config/       # Spring Security, CORS config
│   │       ├── domain/       # Feature modules (lead, property, etc.)
│   │       └── security/     # Auth, JWT, OTP
│   └── src/main/resources/
│       └── db/migration/     # Flyway SQL migrations
├── frontend/                 # React + Vite application
│   ├── public/               # Static assets
│   └── src/
│       ├── components/       # All UI components
│       ├── layouts/          # Page layouts (Navbar, etc.)
│       └── constants.js      # API endpoints and constants
├── .github/
│   ├── workflows/            # CI/CD GitHub Actions
│   ├── ISSUE_TEMPLATE/       # Bug & Feature issue forms
│   ├── CODEOWNERS            # Code ownership
│   ├── dependabot.yml        # Auto dependency updates
│   └── pull_request_template.md
├── CONTRIBUTING.md
├── SECURITY.md
└── CHANGELOG.md
```

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a PR.

**Branch naming:** `feature/*`, `fix/*`, `hotfix/*`, `chore/*`  
**Commit format:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `chore:`, etc.

---

## 🔒 Security

Found a vulnerability? Please read our [Security Policy](./SECURITY.md) and report responsibly via email — **do not open a public issue.**

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

**Built with ❤️ for Pune's real estate market**  
[24K Realtors](https://real-estate-digital-marketing.vercel.app) · Hinjewadi, Wakad, Baner & Beyond

</div>
