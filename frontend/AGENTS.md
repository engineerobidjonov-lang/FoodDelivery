# Repository Guidelines

## Project Structure & Module Organization
This repository is currently a minimal frontend scaffold. The root contains `README.md` and this guide; no application source, test, or asset directories are committed yet. When adding the app, keep the root clean and group code by responsibility:

- `src/` for UI code and feature modules
- `public/` for static assets served as-is
- `tests/` or `src/**/*.test.*` for automated tests
- `docs/` for design notes or architecture decisions

Prefer small, focused modules over large shared files. Name folders after features (`src/cart/`, `src/menu/`) instead of generic buckets when possible.

## Build, Test, and Development Commands
There is no `package.json` or build script in the repository yet, so contributors should add project commands together with the tooling they introduce. Once a Node-based frontend is added, expose the standard scripts below:

- `npm install` to install dependencies
- `npm run dev` to start the local development server
- `npm run build` to create a production bundle
- `npm test` to run the automated test suite

Do not document commands in PRs without also adding them to `package.json` and `README.md`.

## Coding Style & Naming Conventions
Use 2-space indentation for frontend source files. Prefer:

- `PascalCase` for React components
- `camelCase` for variables, functions, and hooks
- `kebab-case` for asset filenames
- one component or module per file when practical

Add a formatter and linter with the first substantive code contribution. If Prettier or ESLint is introduced, commit their config files and run them before opening a PR.

## Testing Guidelines
No test framework is configured yet. Add tests alongside the code you change and keep naming consistent, such as `Component.test.tsx` or `feature.spec.ts`. New features should include at least one happy-path test and one failure or edge-case test.

## Commit & Pull Request Guidelines
Git history currently starts with `first commit`, so use short, imperative commit subjects such as `add menu page scaffold` or `configure eslint`. Keep commits focused on one change.

PRs should include:

- a brief summary of what changed
- linked issue or task reference, if available
- screenshots or short recordings for UI changes
- notes on new commands, config, or follow-up work
