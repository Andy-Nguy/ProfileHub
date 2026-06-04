# AGENTS.md - ProfileHub Rules

## Project Overview

- Professional portfolio & identity platform (inspired by LinkedIn, Read.cv, Polywork, Bento)
- Current focus: Authentication + Onboarding + Public Profile system

## Tech Stack

**Backend**: NestJS + TypeScript + PostgreSQL + TypeORM + Supabase
**Frontend**: React + TypeScript + Vite + React Router + Axios

## Core Architecture (Most Important)

- Strict Layered Architecture: **Controller → Service → Repository → Database**
- **Controller**: Only handles HTTP requests/responses and calls Services. No business logic, no database queries.
- **Service**: Contains all business logic and orchestrates Repositories.
- **Repository**: Only handles TypeORM queries and database operations.
- Always use DTOs for API responses. Never return raw Entities.

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
- Return raw Entities in API responses
- Use generic runtime key converters

Last updated: 2026-05-14
