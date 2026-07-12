# 🤝 Contributing to 24K Realtors

Thank you for your interest in contributing! This guide covers everything you need to work on this codebase effectively.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Branch Naming Convention](#branch-naming-convention)
4. [Commit Message Format](#commit-message-format)
5. [Pull Request Process](#pull-request-process)
6. [Code Style Guidelines](#code-style-guidelines)
7. [Database Migrations](#database-migrations)

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Java (JDK) | 21+ | Spring Boot backend |
| Maven | 3.9+ | Build tool (use `./mvnw`) |
| Node.js | 20+ | React frontend |
| npm | 9+ | Package management |
| PostgreSQL | 15+ | Database (or Docker) |
| Docker | Latest | Local containerized DB |
| Git | 2.40+ | Version control |

---

## Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/manishrai99-afk/24k-real-Estate-Digital-marketing.git
cd "24k-real-Estate-Digital-marketing"

# 2. Start PostgreSQL (Docker)
docker run -d \
  --name 24k-postgres \
  -e POSTGRES_DB=twentyfourk_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  postgres:15

# 3. Configure backend environment
# Edit application.yml with your local DB credentials

# 4. Start backend
cd backend && ./mvnw spring-boot:run

# 5. Start frontend (new terminal)
cd frontend && npm install && npm run dev
```

Frontend: http://localhost:5173 | Backend: http://localhost:8080/api/v1

---

## Branch Naming Convention

```
feature/<description>     New features
fix/<description>         Bug fixes
hotfix/<description>      Urgent production fixes
chore/<description>       Maintenance, deps, CI
docs/<description>        Documentation only
refactor/<description>    Internal code restructure
```

**Examples:**
```
feature/whatsapp-lead-notification
fix/otp-expiry-validation
chore/upgrade-spring-boot-3.3
```

---

## Commit Message Format

We follow **Conventional Commits** spec: `<type>(<scope>): <subject>`

| Type | When to Use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `hotfix` | Urgent production fix |
| `chore` | Build, deps, tooling |
| `docs` | Documentation |
| `refactor` | Code restructure (no behavior change) |
| `test` | Adding/fixing tests |
| `ci` | CI/CD pipeline changes |
| `perf` | Performance improvements |
| `design` | UI/UX visual changes |

**Examples:**
```
feat(leads): add WhatsApp notification on lead assignment
fix(auth): resolve OTP not expiring after 5 minutes
design(hero): set luxury Pune property as homepage background
```

---

## Pull Request Process

1. Create branch from `main` following naming convention
2. Make focused, atomic commits
3. Run CI locally: `./mvnw test` + `npm run lint && npm run build`
4. Open PR to `main` — fill the PR template completely
5. Wait for all CI checks to pass
6. Merge via **Squash & Merge**

> ⚠️ **Never push directly to `main`.** All changes must go through a PR.

---

## Code Style Guidelines

### Backend (Java)
- Use `@Service`, `@Repository`, `@Controller` annotations properly
- All new endpoints must have `@PreAuthorize` security annotations
- Use `ResponseEntity<>` for all controller return types
- No hardcoded credentials anywhere

### Frontend (React)
- Functional components only
- Use descriptive `id` attributes on all interactive elements
- Use CSS variables from `index.css` — no ad-hoc inline colors
- Keep components under 300 lines

---

## Database Migrations

We use **Flyway** for all schema changes.

```
backend/src/main/resources/db/migration/
  V1__initial_schema.sql
  V23__create_otp_verification_table.sql  ← always increment version
```

**Rules:**
1. Never modify an existing migration file
2. Always create a new file: `V<N+1>__<description>.sql`
3. Migrations must be backward-compatible where possible
4. Document rollback steps in PR if destructive

---

## Questions?

Open a [Discussion](https://github.com/manishrai99-afk/24k-real-Estate-Digital-marketing/discussions) or reach out to [@manishrai99-afk](https://github.com/manishrai99-afk).
