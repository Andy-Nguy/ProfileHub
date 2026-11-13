# ProfileHub — Baseline Quality Report

- **Date:** 2026-10-25
- **Branch:** `guardrails-typecheck-lint`
- **Commit:** Baseline prior to Refactor PR-01

---

## 1. Summary of Baseline Metrics

| Metric | Baseline Value | Target | Status |
|---|---|---|---|
| **Client TypeScript (`tsc`)** | **12 errors** (8 files) | 0 errors | ❌ Failing |
| **Service TypeScript (`tsc`)** | **0 errors** (`apps/service/tsconfig.json`) | 0 errors | ✅ Passing |
| **ESLint (`npm run lint`)** | **No-op / 0 projects run** (missing target & missing dependency `@typescript-eslint/eslint-plugin`) | Runs on all projects, 0 errors | ❌ Broken |
| **Client Build (`npm run build:client`)** | **Failed** (blocked by 12 type errors) | 0 errors | ❌ Failing |
| **Client Vite JS Bundle Size** | **943.85 kB** (single minified chunk, gzip: 244.91 kB) | < 500 kB initial | ⚠️ Warning |

---

## 2. Details of Client TypeScript Errors (12 Errors)

1. `apps/client/src/components/layout/SideNav.tsx:5:22` - TS2459: Module declares 'ProfileResponse' locally, but it is not exported.
2. `apps/client/src/components/profile/dialogs/AboutDialog.tsx:5:10` - TS2459: Module declares 'ProfileResponse' locally, but it is not exported.
3. `apps/client/src/components/profile/dialogs/BasicInfoDialog.tsx:5:10` - TS2459: Module declares 'ProfileResponse' locally, but it is not exported.
4. `apps/client/src/components/profile/dialogs/SkillsDialog.tsx:4:10` - TS2459: Module declares 'ProfileResponse' locally, but it is not exported.
5. `apps/client/src/hooks/useApi.ts:4:10` - TS2459: Module declares 'DiscoveryFeedResponse' locally, but it is not exported.
6. `apps/client/src/hooks/useApi.ts:4:33` - TS2459: Module declares 'ProfileResponse' locally, but it is not exported.
7. `apps/client/src/hooks/useApi.ts:105:78` - TS7006: Parameter 'old' implicitly has an 'any' type.
8. `apps/client/src/hooks/useApi.ts:109:31` - TS7006: Parameter 'p' implicitly has an 'any' type.
9. `apps/client/src/pages/DiscoveryPage.tsx:8:10` - TS2459: Module declares 'ProfileResponse' locally, but it is not exported.
10. `apps/client/src/pages/ProfilePage.tsx:14:10` - TS2459: Module declares 'ProfileResponse' locally, but it is not exported.
11. `apps/client/src/pages/ProfilePage.tsx:84:19` - TS7006: Parameter 'prev' implicitly has an 'any' type.
12. `apps/client/src/pages/PublicProfilePage.tsx:4:22` - TS2459: Module declares 'ProfileResponse' locally, but it is not exported.

---

## 3. ESLint State

- `eslint.config.mjs` imports `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`.
- `@typescript-eslint/eslint-plugin` is missing from devDependencies.
- `apps/client/project.json` and `apps/service/project.json` do not configure any `lint` target.
- `nx run-many --target=lint --all` exits 0 with message: `NX No tasks were run`.
