# Changelog

All notable changes to 24K Realtors are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- SaaS-level GitHub setup (CI/CD workflows, issue templates, Dependabot, CODEOWNERS)
- Professional README with CI badges, architecture diagram, and tech stack
- Security policy and contributor guide
- PR auto-labeler workflow based on branch naming
- Stale issue/PR management bot

---

## [0.9.0] — 2026-07-11

### Added
- OTP-based SMS authentication for login
- Google OAuth2 login integration
- Gemini AI-powered chat widget for property visitors
- WhatsApp notification on lead assignment and site visit booking
- Email service (JavaMail) for lead confirmation and welcome messages
- Netflix-style luxury amenity cards in property detail view
- 3D interactive amenity cards with cinematic hover effects
- Hero section with full-screen luxury property background
- Follow-up task management for agents (FollowUpTask module)
- Lead journey stepper — visual pipeline status tracker
- Attendance tracking module for agents
- Property listing with advanced filters (BHK, budget, locality, type)
- Society, Builder, and Locality detail pages

### Changed
- Dark overlay opacity reduced for hero section (image now visible)
- ThemeSelector removed — locked to premium dark theme
- Floating chat + WhatsApp buttons hidden on sub-detail pages

### Fixed
- Hero background image CORS issue — now served from `/public` folder
- Sticky bottom enquiry bar overlap on property detail sub-pages

---

## [0.5.0] — 2026-07-09

### Added
- Initial Spring Boot + PostgreSQL backend
- Flyway database migrations (V1–V22)
- JWT authentication with Spring Security
- Lead management CRUD API (`/api/v1/leads`)
- Property CRUD API (`/api/v1/properties`)
- React 18 + Vite frontend scaffold
- Portal layout with PortalNavbar
- Basic property listing and search UI

---

[Unreleased]: https://github.com/24krealtorshinjewadi-blip/24K-Realtors-Website/compare/v0.9.0...HEAD
[0.9.0]: https://github.com/24krealtorshinjewadi-blip/24K-Realtors-Website/compare/v0.5.0...v0.9.0
[0.5.0]: https://github.com/24krealtorshinjewadi-blip/24K-Realtors-Website/releases/tag/v0.5.0

