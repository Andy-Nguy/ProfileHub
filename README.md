# ProfileHub

> A modern, professional portfolio and identity platform built with **NestJS**, **React**, **PostgreSQL**, and **Nx Monorepo**. Inspired by Bento, Read.cv, and LinkedIn.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Monorepo** | [Nx](https://nx.dev/) (Workspace orchestration) |
| **Backend** | [NestJS 10](https://nestjs.com/) + [TypeScript](https://www.typescriptlang.org/) + [TypeORM](https://typeorm.io/) + [PostgreSQL](https://www.postgresql.org/) |
| **Authentication** | JWT Access Token (header) + HTTP-Only Refresh Token Cookie (rotation) + Email OTP via Nodemailer |
| **API Documentation** | [Swagger / OpenAPI](https://swagger.io/) (`/api/docs`) |
| **Frontend** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/) |
| **Internationalization** | [i18next](https://www.i18next.com/) (English & Tiếng Việt) |
| **Cloud Storage** | [Supabase Storage](https://supabase.com/storage) (Avatars, Company Logos, Institution Logos) |

---

## 🏗 Architecture & Design Principles

### Backend Architecture (Strict Layered Architecture)
```
Request ──► Controller ──► Service ──► Repository ──► Database (PostgreSQL)
                │              │
                ▼              ▼
           Swagger Docs     Data Transfer Objects (DTOs)
```
- **Controller:** Strictly responsible for HTTP request parsing, routing, and Swagger metadata. No database queries.
- **Service:** Encapsulates business logic, orchestrates repositories, and performs permission / ownership checks.
- **Repository:** Manages TypeORM entity interactions and raw SQL / QueryBuilder optimization.
- **DTOs & Type Safety:** Input validation via `class-validator` / `class-transformer`. Response contracts implement shared interfaces from `@profilehub/types`.

### Frontend Architecture (Strict 3-Tier Layered Architecture)
```
UI Components / Dialogs ──► Custom Hooks / Services (`src/services/*.ts`) ──► `apiClient` (Axios Interceptors)
```
- **UI Components & Dialogs:** Presentational layer. Never call `apiClient` or naked `fetch()` directly.
- **Service Layer (`profileAPI`, `authAPI`, `educationAPI`, `companiesAPI`):** Single source of truth for all API calls and typed responses.
- **HTTP Client (`apiClient`):** Centralized interceptors managing Bearer tokens, token refresh mutex, error handling, and timeout policies.
- **Code Splitting:** Dynamic route loading (`React.lazy`) with manual vendor chunking in Vite for initial bundle sizes `< 150 KB`.

> 💡 **Engineering & Refactor History:** Detailed execution plans, architectural decisions, and performance benchmarks are documented under [`docs/refactors/`](./docs/refactors/README.md).

---

## 📁 Project Structure

```
profilehub/
├── apps/
│   ├── client/                  # React + Vite Single Page Application
│   │   ├── src/
│   │   │   ├── components/      # UI components, layout, dialogs
│   │   │   ├── contexts/        # AuthContext, ThemeContext
│   │   │   ├── hooks/           # useApi, useDebounce, etc.
│   │   │   ├── i18n/            # Locales (en / vi)
│   │   │   ├── pages/           # ProfilePage, DiscoveryPage, OnboardingPage, etc.
│   │   │   └── services/        # Service layer (auth, profile, education, etc.)
│   └── service/                 # NestJS REST API backend
│       ├── src/
│       │   ├── common/          # Filters (AllExceptionsFilter), decorators, guards
│       │   ├── entities/        # TypeORM entities (User, Profile, Skill, etc.)
│       │   └── modules/         # Auth, Profile, Companies, Education, Storage, User
├── libs/
│   └── shared/
│       ├── types/               # Shared TypeScript interfaces & enums (@profilehub/types)
│       ├── ui/                  # Reusable UI primitives (@profilehub/ui)
│       └── data-access/         # Shared data utilities (@profilehub/data-access)
├── docs/
│   └── refactors/               # Engineering refactor history & decision logs
├── database/
│   ├── schema/                  # SQL schema migrations (apply manually in sequence)
│   └── seed-profiles.sql        # Demo seed data for testing
├── docker-compose.yml           # PostgreSQL container for local development
└── .env.example                 # Environment variables template
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker & Docker Compose** (for running PostgreSQL locally)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Andy-Nguy/ProfileHub.git
cd ProfileHub

# Install dependencies
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
Ensure your database credentials, JWT secrets, and Supabase keys (optional for local image storage) are configured.

### 4. Database Setup
Start the local PostgreSQL container:
```bash
docker-compose up -d
```

Apply the database schema files located in `database/schema/` in chronological order:
```bash
# Example using psql:
psql -h localhost -U postgres -d profilehub -f database/schema/20260505-Initial-schema.sql
psql -h localhost -U postgres -d profilehub -f database/schema/20260516-Core-Profile-CV-Schema.sql
psql -h localhost -U postgres -d profilehub -f database/schema/20260524-skill-category-universal.sql
psql -h localhost -U postgres -d profilehub -f database/schema/20260525-create-companies-table.sql
psql -h localhost -U postgres -d profilehub -f database/schema/20260907-auth-hardening.sql
```

*(Optional) Seed test profile data:*
```bash
psql -h localhost -U postgres -d profilehub -f database/seed-profiles.sql
```

### 5. Running the Application
```bash
# Start both Backend and Frontend in development mode
npm run dev

# Or run them individually:
npm run start:service   # Backend  → http://localhost:3000/api
npm run start:client    # Frontend → http://localhost:5173
```

---

## 📖 API Documentation & Swagger

Interactive Swagger documentation is available out of the box when running the backend service:
- **Swagger UI:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Core API Endpoints

#### Authentication (`/api/auth`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/verify-email` | Verify email address with 6-digit OTP | No |
| `POST` | `/api/auth/login` | Login with email & password | No |
| `POST` | `/api/auth/refresh` | Refresh access token using HTTP-only cookie | No |
| `POST` | `/api/auth/logout` | Logout and revoke active refresh token | No |
| `GET` | `/api/auth/me` | Bootstrap current user session & profile status | Bearer JWT |

#### Profiles & CV Sections (`/api/profiles`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/profiles/mine` | Get full profile of authenticated user | Bearer JWT |
| `GET` | `/api/profiles/discover` | Paginated discovery feed (`?page=1&limit=20&search=`) | No |
| `GET` | `/api/profiles/u/:username` | View public profile by username | No |
| `GET` | `/api/profiles/:id` | View profile by UUID | Bearer JWT |
| `PATCH` | `/api/profiles/me` | Update basic profile information | Bearer JWT |
| `PATCH` | `/api/profiles/onboarding` | Complete first-time profile onboarding | Bearer JWT |
| `POST` | `/api/profiles/me/skills` | Add a skill | Bearer JWT |
| `PUT` | `/api/profiles/me/skills/:id` | Update a skill | Bearer JWT |
| `DELETE` | `/api/profiles/me/skills/:id` | Delete a skill | Bearer JWT |
| `POST` | `/api/profiles/me/experiences` | Add a work experience | Bearer JWT |
| `PUT` | `/api/profiles/me/experiences/:id` | Update a work experience | Bearer JWT |
| `DELETE` | `/api/profiles/me/experiences/:id` | Delete a work experience | Bearer JWT |
| `POST` | `/api/profiles/me/educations` | Add education history | Bearer JWT |
| `PUT` | `/api/profiles/me/educations/:id` | Update education history | Bearer JWT |
| `DELETE` | `/api/profiles/me/educations/:id` | Delete education history | Bearer JWT |
| `POST` | `/api/profiles/me/social-links` | Add a social link | Bearer JWT |
| `PUT` | `/api/profiles/me/social-links/:id` | Update a social link | Bearer JWT |
| `DELETE` | `/api/profiles/me/social-links/:id` | Delete a social link | Bearer JWT |

#### Companies & Institutions (`/api/companies`, `/api/education`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/companies/search` | Search companies by name or domain (`?q=`) | Bearer JWT |
| `POST` | `/api/companies` | Create a company with optional logo upload | Bearer JWT |
| `GET` | `/api/companies/:id` | Get company details by ID | Bearer JWT |
| `GET` | `/api/education/search` | Search institutions by name (`?q=`) | Bearer JWT |

#### Cloud Storage (`/api/storage`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/storage/avatar` | Upload and crop user avatar (multipart) | Bearer JWT |
| `POST` | `/api/storage/institution-logo` | Upload institution logo (`?institutionName=`) | Bearer JWT |

---

## 🛡 Quality Gates & Verification

Run these commands to verify code quality, type safety, and build integrity:

```bash
# 1. Type-check all workspace projects (Client, Service, Shared Libs)
npm run typecheck

# 2. Run ESLint across all monorepo projects
npm run lint

# 3. Build Client and Service applications for production
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
