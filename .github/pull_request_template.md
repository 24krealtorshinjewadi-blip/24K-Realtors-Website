## 📋 Summary
<!-- Describe what this PR does and WHY. Link the related issue if applicable. -->

Closes #<!-- issue number -->

---

## 🔧 Type of Change
<!-- Check all that apply -->
- [ ] 🐛 Bug fix — non-breaking fix
- [ ] ✨ New feature — non-breaking addition
- [ ] 💥 Breaking change — alters existing behavior
- [ ] ♻️ Refactor — internal code improvement, no functional change
- [ ] 🎨 UI/UX — visual or layout change
- [ ] 📖 Documentation — README, comments, docs update
- [ ] 🔒 Security — fixes a vulnerability or hardens access control
- [ ] ⚡ Performance — speed or memory improvement
- [ ] 🔧 CI/CD — workflow or pipeline change

---

## 🧪 Testing & Verification
<!-- Explain exactly how you tested these changes -->

**Automated Tests:**
```
# Commands run:
./mvnw test
npm run lint && npm run build
```

**Manual Verification:**
- [ ] Tested locally with `npm run dev` + Spring Boot running
- [ ] Tested on mobile viewport (375px)
- [ ] Tested API endpoints via Postman / browser
- [ ] Verified no console errors in browser DevTools

---

## 🗄️ Database Changes
<!-- If no DB changes, write "None" -->
- [ ] No database changes in this PR
- [ ] Added Flyway migration: `V__<description>.sql`
- [ ] Migration is backward-compatible (no destructive changes)
- [ ] Rollback strategy documented (if breaking)

---

## 🌍 Environment Variables
<!-- List any new env vars introduced -->
- [ ] No new environment variables
- [ ] New variables added to `application.yml` with safe defaults
- [ ] New frontend vars prefixed with `VITE_` and documented in README

New variables (if any):
```
VARIABLE_NAME=description_of_value
```

---

## 📸 Screenshots / Demo
<!-- Attach screenshots or a Loom link for UI changes. Delete if not applicable. -->

| Before | After |
|--------|-------|
| <!-- screenshot --> | <!-- screenshot --> |

---

## ✅ PR Checklist
- [ ] Code follows project conventions (Conventional Commits, clean code)
- [ ] Self-reviewed my own changes
- [ ] No hardcoded secrets, credentials, or API keys
- [ ] No `console.log` or debug statements left in code
- [ ] Branch is up to date with `main`
- [ ] CI checks pass (all green)
- [ ] PR title follows Conventional Commits: `feat:`, `fix:`, `chore:`, etc.
