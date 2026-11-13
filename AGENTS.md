# AGENTS.md - ProfileHub Rules

## Project Overview

- Professional portfolio & identity platform (inspired by LinkedIn, Read.cv, Polywork, Bento)
- Current focus: Authentication + Onboarding + Public Profile system

## Tech Stack

**Backend**: NestJS + TypeScript + PostgreSQL + TypeORM + Supabase
**Frontend**: React + TypeScript + Vite + React Router + Axios

## Core Architecture (Most Important)

- **Backend (Strict Layered Architecture)**: **Controller → Service → Repository → Database**
  - **Controller**: Only handles HTTP requests/responses and calls Services. No business logic, no database queries.
  - **Service**: Contains all business logic and orchestrates Repositories.
  - **Repository**: Only handles TypeORM queries and database operations.
  - Always use DTOs for API responses. Never return raw Entities.
    - **Pragmatic exception (2026-10-26):** CV section entities (`Education`, `Experience`, `Skill`, `SocialLink`) contain no sensitive fields. They `implements` the shared interfaces in `@profilehub/types` and are embedded as-is inside `ProfileResponseDto` (no per-entity `toXxxResponseDto` mappers). CV create/update endpoints return `{ success: true }`. Entities with sensitive data (`User`, tokens, OTP) must still go through DTOs.

- **Frontend (Strict 3-Tier Layered Architecture - HR Systems Standard)**:
  - **Flow:** **UI Component / Dialog → Custom Hook / Service Layer (`src/services/*.service.ts`) → HTTP Client (`apiClient`)**
  - **Rule 1 (Strictly no raw `fetch()`):** All HTTP requests across the application must go through `apiClient` to ensure interceptors (auth token, refresh token mutex, error handling) are never bypassed.
  - **Rule 2 (Components/Dialogs never import `apiClient` directly):** Only files within `src/services/*.service.ts` are permitted to call `apiClient`. UI components and dialogs must strictly call methods from the Service layer (`profileAPI`, `authAPI`, `companiesAPI`, etc.).
  - **Rule 3 (Transparent error handling, no silent swallowing):** Empty `catch {}` blocks in Dialogs/Components are strictly prohibited. Always surface meaningful feedback to the user via Toast notifications or Error alert states.

## Naming Conventions

- Database columns: `snake_case` (e.g. `display_namene`, `avatar_url`)
- TypeScript (entities, variables, functions): `camelCase`
- DTOs & JSON responses: `camelCase`

## Security Rules (Strict)

- Always use DTOs, Guards, and ValidationPipe
- Validate user ownership and active status

## Code Quality Standards

- Write clean, maintainable, production-ready TypeScript
- Prefer small, focused functions and clear naming
- Use Dependency Injection
- Proper error handling with NestJS exceptions
- Use Context API for state management (avoid Redux for now)

## AI Assistant Instructions

When working on this project, ALWAYS:

- Follow the layered architecture strictly
- Separate Entities from DTOs
- Keep `/auth/me` response contract stable
- Prioritize clarity, maintainability, and security
- Write explicit, readable code

NEVER:

- Put database queries in Controllers or Services
- Return raw Entities in API responses (except allowed CV section pragmatism)
- Use generic runtime key converters
- Import or call `apiClient` directly inside UI Components or Dialogs
- Use naked `fetch()` bypassing `apiClient` and its interceptors
- Swallow errors silently with empty `catch {}` blocks

Last updated: 2026-10-27
