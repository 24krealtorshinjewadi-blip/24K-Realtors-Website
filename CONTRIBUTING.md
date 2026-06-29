# 🤝 Contributing to 24K Realtors Project

Thank you for contributing to 24K Realtors! To maintain code quality and ensure a smooth development lifecycle, please adhere to the following professional team guidelines.

---

## 🌿 Git Branching Strategy (Git Flow)

We use a structured branch model to keep our production codebase stable:

1. **`main`**: Production-ready code only. Direct commits to `main` are restricted.
2. **`develop`**: Integration branch for new features. All pull requests target `develop`.
3. **`feature/{feature-name}`**: Dedicated branch for a specific feature (e.g., `feature/matterport-tour-modal`).
4. **`bugfix/{bug-name}`**: Dedicated branch to resolve issues (e.g., `bugfix/mobile-menu-overflow`).
5. **`hotfix/{hotfix-name}`**: Urgent production patches merged directly into `main` and back-ported to `develop`.

---

## 📝 Commit Message Guidelines

We enforce **Conventional Commits** formatting to automate changelogs and track code history clearly:

```
<type>(<scope>): <short description>
```

### Types allowed:
*   `feat`: A new user-facing feature.
*   `fix`: A bug fix.
*   `docs`: Documentation changes only.
*   `style`: Code style changes (formatting, missing semi-colons, no functional impact).
*   `refactor`: Code changes that neither fix a bug nor add a feature.
*   `perf`: Performance optimizations.
*   `test`: Adding or correcting tests.
*   `chore`: Updating build scripts, dependencies, or configurations.

### Examples:
*   `feat(portal): add Matterport 3D Tour modal for premium listings`
*   `fix(crm): resolve mobile viewport overlap by adding important to nav-links`
*   `docs(readme): update local networking guide for mobile testing`

---

## 🔍 Pull Request Process

All code changes must undergo a structured pull request (PR) review before integration:

1. **Create Branch:** Create a branch from `develop` following the branching standard.
2. **Local Verification:** Verify that the frontend compiles cleanly (`npm run build`) and the Spring Boot backend builds successfully (`mvn clean compile`).
3. **Open Pull Request:** Open a PR targeting the `develop` branch. Fill out the Pull Request Template completely.
4. **Code Review:** Obtain approval from at least one senior reviewer. Resolve any code quality or linting feedback.
5. **Merge:** Once approved and CI builds pass, the PR is merged via Squash & Merge.

---

## 💻 Coding Standards & Linting

*   **Frontend (JS/React):** Follow standard ES6+ guidelines. Use functional components with hooks, keep styling clean and centralized (avoid inline styles where possible).
*   **Backend (Java):** Adhere to standard Spring Boot architecture. Keep controllers thin, write business logic in service implementations (`ServiceImpl.java`), manage transactions correctly, and use Flyway migrations to update schemas.
*   **HTML/CSS:** Use semantic HTML tags. Follow responsive design best practices (use flex/grid layouts and CSS variables).
