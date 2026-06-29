# Project-Scoped Rules for 24K Realtors Workspace

This document defines the behavior and guidelines that AI agents must follow when collaborating on this workspace.

## GIT & GITHUB WORKFLOW
1. **Main Branch Stability:** The `main` (or `master`) branch must remain clean, stable, and ready for deployment at all times. Do not perform direct commits to `main`.
2. **Feature Branching Model:** All changes must be developed in dedicated branches:
   - `feature/<name>` for new features
   - `fix/<name>` for bug fixes
   - `hotfix/<name>` for urgent production fixes
   - `chore/<name>` for cleanups, dependency upgrades, or configuration changes
3. **Pull Requests:** Merge changes into `main` only through pull requests and reviews.
4. **Commit Messages:** Commit messages must be concise, clear, and meaningful (specifying what changed and why).
5. **Branch Cleanup:** Delete feature branches locally and remotely once they are merged.
6. **Git Ignored Assets:** Maintain a strict `.gitignore` to prevent committing `.env`, `node_modules`, build directories (`dist/`, `target/`), or local database files.

## CODE QUALITY
7. **Architectural Decisions:** Explain the technical approach and rationale before writing code.
8. **File Summaries:** Provide a brief summary of changes for every modified file.
9. **Environment Variables:** Do not hardcode sensitive keys, credentials, or environment-specific URLs. Use environment variables (via `.env` files in frontend or property bindings in Spring Boot).
10. **Production Grade:** Deliver clean, structured, and production-ready code with complete error handling.

## DEPLOYMENT & SAFETY
11. **Release Checklists:** Provide a validation checklist (environment variables, build verification, database migrations) before deployment.
12. **Breaking Changes:** Issue clear warnings before applying breaking changes.
13. **Rollback Strategy:** Document a rollback plan for any major architectural or database schema changes.

## COMMUNICATION
14. **Actionable Commands:** Provide copy-paste ready, step-by-step terminal commands.
15. **Autonomous Decisions:** Make technical decisions (architecture, libraries) autonomously and document the justification, rather than repeatedly asking for user decisions.
16. **Hinglish/Direct Tone:** Talk in Hinglish. Keep communications direct, practical, and highly concise. Avoid academic lectures.
17. **Next Steps:** Clearly outline the immediate next actions after completing a deliverable.
