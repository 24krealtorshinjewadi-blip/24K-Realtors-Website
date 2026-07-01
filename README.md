# 🏡 24K Realtors — Premium Real Estate Platform

<div align="center">

![24K Realtors](https://img.shields.io/badge/24K_Realtors-Premium_Real_Estate-gold?style=for-the-badge&logo=homeadvisor&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=for-the-badge&logo=railway)
![Vercel](https://img.shields.io/badge/Vercel-Live-000000?style=for-the-badge&logo=vercel)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-316192?style=for-the-badge&logo=postgresql)

### 🌐 [Live Website](https://real-estate-digital-marketing.vercel.app) &nbsp;|&nbsp; 🚂 [Railway Backend](https://twentyfourk-backend-production.up.railway.app/api/v1/properties) &nbsp;|&nbsp; 📊 [API Docs](#api-endpoints)

</div>

---

## ✨ Overview

**24K Realtors** is a full-stack, production-grade real estate digital marketing platform built for premium property discovery in Pune. It features a location-centric browsing experience, a real-time lead capture CRM, and an admin dashboard — all deployed on cloud infrastructure.

> Built with Spring Boot 3 (Java 21) + React 18 + PostgreSQL + Railway + Vercel

---

## 🚀 Live Production Links

| Platform | URL | Purpose |
|---|---|---|
| 🌐 **Frontend (Vercel)** | [real-estate-digital-marketing.vercel.app](https://real-estate-digital-marketing.vercel.app) | Client-facing website |
| 🚂 **Backend API (Railway)** | [twentyfourk-backend-production.up.railway.app/api/v1](https://twentyfourk-backend-production.up.railway.app/api/v1/properties) | REST API |
| 🐘 **Database** | Railway PostgreSQL (Internal) | Persistent storage |
| 📦 **GitHub** | [manishrai99-afk/24k-real-Estate-Digital-marketing](https://github.com/manishrai99-afk/24k-real-Estate-Digital-marketing) | Source code |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     PRODUCTION STACK                    │
│                                                         │
│  Browser/Mobile                                         │
│       │                                                 │
│       ▼                                                 │
│  ┌─────────────┐     HTTPS/CORS      ┌──────────────┐  │
│  │   Vercel    │ ──────────────────▶ │   Railway    │  │
│  │  (React 18) │                     │ (Spring Boot)│  │
│  │  Frontend   │                     │   Port 8080  │  │
│  └─────────────┘                     └──────┬───────┘  │
│                                             │ JDBC      │
│                                      ┌──────▼───────┐  │
│                                      │  PostgreSQL  │  │
│                                      │  (Railway)   │  │
│                                      │  Persistent  │  │
│                                      └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 (LTS) | Core language |
| Spring Boot | 3.3.4 | Application framework |
| Spring Security + JWT | Latest | Auth & authorization |
| Spring Data JPA | Latest | Database ORM |
| Flyway | Latest | DB migrations |
| PostgreSQL | 18 (Railway) | Production database |
| Lombok | Latest | Boilerplate reduction |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| React Router | v6 | Navigation |
| Axios | Latest | HTTP client |
| CSS3 | — | Styling (Glassmorphism) |

### DevOps
| Tool | Purpose |
|---|---|
| Railway | Backend + DB hosting |
| Vercel | Frontend hosting |
| GitHub | Source control + CI/CD trigger |
| Docker | Container build (Railway) |
| Nixpacks | Auto-detect build (Railway) |

---

## 📁 Project Structure

```
24K Real Estate JAVA/
├── src/main/java/com/realestate/twentyfourk/
│   ├── config/          # Security, CORS, DB Seeder
│   ├── domain/
│   │   ├── property/    # Property entity, service, controller
│   │   ├── lead/        # Lead capture CRM
│   │   ├── agent/       # Relationship Managers
│   │   ├── user/        # Admin users, JWT
│   │   └── audit/       # Audit logs
│   └── TwentyFourKRealEstateApplication.java
├── src/main/resources/
│   ├── application.yml  # Multi-profile config (dev/railway)
│   └── db/migration/    # Flyway V1-V11 migrations
├── frontend/            # React 18 + Vite
│   ├── src/
│   │   ├── components/  # Portal, Navbar, PropertyCard etc.
│   │   ├── services/    # apiService.js (Railway API)
│   │   └── pages/       # Main pages
│   └── package.json
├── Dockerfile           # Multi-stage Docker build
├── railway.toml         # Railway deployment config
├── Procfile             # Process definition
└── pom.xml              # Maven dependencies
```

---

## 🔌 API Endpoints

### Public (No Auth Required)
```
GET  /api/v1/properties              → All listings (paginated)
GET  /api/v1/properties?location=HINJEWADI  → Filter by area
GET  /api/v1/properties?transactionType=BUY → Filter by type
GET  /api/v1/properties/{id}         → Single property detail
POST /api/v1/leads                   → Submit buyer/seller lead
POST /api/v1/auth/login              → Admin login → JWT token
```

### Protected (JWT Required)
```
GET  /api/v1/leads                   → All leads (CRM)
GET  /api/v1/leads/{id}              → Lead detail
PUT  /api/v1/leads/{id}/status       → Update lead status
GET  /api/v1/dashboard/stats         → Dashboard metrics
GET  /api/v1/audit-logs              → Audit trail
POST /api/v1/properties              → Add new property
PUT  /api/v1/properties/{id}         → Update property
```

---

## 🗄️ Database Migrations (Flyway)

| Version | Description |
|---|---|
| V1 | Initial schema — properties, users |
| V2 | Security schema — roles, permissions |
| V3 | Geolocation — lat/lng columns |
| V4 | Lead routing schema |
| V5 | Property badges (verified, exclusive) |
| V6 | RERA number column |
| V7 | Image, video, furnishing, gas pipeline |
| V8 | Lead score tracking |
| V9 | WhatsApp notification logs |
| V10 | Audit logging + soft delete |
| V11 | Refresh token support |

---

## 🚀 Local Development Setup

### Prerequisites
- Java 21
- Maven 3.9+
- Node.js 20+
- PostgreSQL 15+ (or Docker)

### Backend
```bash
# Clone the repo
git clone https://github.com/manishrai99-afk/24k-real-Estate-Digital-marketing.git
cd "24K Real Estate JAVA"

# Set environment variables (or use defaults in dev profile)
# Dev profile uses H2 in-memory DB by default

# Run Spring Boot
./mvnw spring-boot:run
# → http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## ☁️ Deployment Workflow

### Backend → Railway (Auto-Deploy)
```bash
# Any push to connected branch triggers Railway auto-deploy
git add .
git commit -m "feat: your change"
git push origin fix/vercel-api-endpoint
# ✅ Railway builds + deploys automatically in ~2-3 min
```

### Frontend → Vercel
```bash
cd frontend
npm run build
npx vercel deploy --prod
# ✅ Live at https://real-estate-digital-marketing.vercel.app
```

---

## 🌆 Seeded Properties (20 Premium Pune Listings)

| Area | Properties |
|---|---|
| Hinjewadi | Shapoorji Joyville, Kolte Patil Life Republic, Godrej Infinity |
| Baner | Rohan Uptown, Pristine Prolife, Kumar Prospera |
| Wakad | Vilas Javdekar Yashwin, Majestique Landmarks |
| Tathawade | Lodha Belmondo Golf Villa |
| Kothrud | Mahindra Antheia |
| Koregaon Park | The Address by GS, Panchshil Towers |
| Kalyani Nagar | Nyati Ethos, Kolte Patil 24K Gracia |
| Balewadi | Megapolis Smart Homes |
| Aundh | Kolte Patil 3 BHK |

---

## 🔐 Security

- JWT-based stateless authentication
- BCrypt password hashing
- Environment variable based secrets (no hardcoding)
- CORS restricted to Vercel frontend origin
- Soft-delete for all entities (no hard deletes)
- Full audit trail with `created_by`, `updated_by`

---

## 👨‍💻 Developer

**Manish Rai**  
Full Stack Java Developer  
[GitHub](https://github.com/manishrai99-afk) · [Project Link](https://real-estate-digital-marketing.vercel.app)

---

<div align="center">

**⭐ Star this repo if you found it useful!**

![Made with Spring Boot](https://img.shields.io/badge/Made_with-Spring_Boot-brightgreen?style=flat-square&logo=springboot)
![Deployed on Railway](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?style=flat-square&logo=railway)
![Frontend on Vercel](https://img.shields.io/badge/Frontend-Vercel-000?style=flat-square&logo=vercel)

</div>
