# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PLP Portal** — a healthcare monitoring and incentive management system where facilities submit raw field values that auto-calculate performance indicators and determine health worker incentives.

## Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack on port 3007
npm run build        # Production build
npm run start        # Start production server on port 3007
```

### Database
```bash
npm run db:push      # Push schema changes (no migration files generated)
npm run db:reset     # Full reset + reseed (destructive)
npm run db:studio    # Open Prisma Studio
npm run seed:master  # Seed master/reference data only
npm run seed:complete # Seed everything (fields, indicators, facilities, mappings)
```

### Tests
```bash
npm run test                    # Run all tests
npm run test:watch              # Watch mode
npm run test:unit               # DTO unit tests (src/lib/dto/__tests__/)
npm run test:integration        # API integration tests (src/app/api/__tests__/)
npm run test:components         # Component tests (src/components/__tests__/)
npm run test:e2e                # End-to-end tests (src/__tests__/e2e/)
npm run test:coverage           # Coverage report
```

### Data Operations
```bash
npm run recalculate:incentives  # Recalculate all incentives from stored field values
npm run import-data             # Import data from external source
```

## Architecture

### Core Data Flow

1. **Field Submission** — facility users submit `field_value` records for a month
2. **Auto-Calculation** — `src/lib/calculations/auto-indicator-calculator.ts` triggers on submit, evaluates formulas
3. **Indicator Results** — stored as computed `indicator` achievement values
4. **Remuneration** — `src/lib/calculations/remuneration-calculator.ts` determines incentives based on achievement % vs targets

The formula engine is in `src/lib/calculations/formula-calculator/`. Formulas reference other fields by code (e.g., `FIELD_CODE / ANOTHER_FIELD`). The `parse-formula.ts` file tokenizes formulas; `extract-field-value.ts` resolves field codes to actual stored values.

### Auth

- NextAuth 4 with **Credentials Provider** (username/password), JWT sessions, 30-day expiry
- Config: `src/lib/auth-options.ts`; session helper: `src/lib/auth.ts`
- Two roles: `admin` and `facility`. Facility users are linked to a specific `facility` record.
- Middleware (`middleware.ts`) gates `/admin/*` to admin role and `/facility/*` to facility role.

### Prisma Client

Generated client lives in `src/generated/prisma/` (not the default `node_modules` location). Import from:
```ts
import { PrismaClient } from '@/generated/prisma'
```
The singleton is at `src/lib/db.ts`. Always use this singleton, not `new PrismaClient()` directly.

### API Routes

All routes are under `src/app/api/`:
- `/api/admin/*` — admin-only operations (user management, indicator config, reports)
- `/api/facility/*` — facility user operations (field submission, reports, long-roll)
- `/api/auth/*` — NextAuth handlers

Pattern: Each route file checks session role at the top; admin routes call `getServerSession` and verify `session.user.role === 'admin'`.

### Field Types (Enum in schema)

| Type | Meaning |
|------|---------|
| `MONTHLY_COUNT` | Facility submits this each month |
| `FACILITY_SPECIFIC` | Facility-entered, not monthly |
| `CALCULATED` | Auto-derived from formula, never submitted |
| `CONSTANT` | Fixed value in config |
| `BINARY` | Yes/No |
| `INDICATOR_REFERENCE` | References an indicator result |
| `FACILITY_TYPE_SPECIFIC` | Value depends on facility type |

### Facility Types

`PHC`, `UPHC`, `SC_HWC`, `U_HWC`, `A_HWC` — each has its own set of applicable fields and indicators, configured via `facility_field_mapping` and `facility_type` records.

### Long-Roll

A separate sub-system under `/facility/long-roll/` tracking village → section → family → family_member hierarchy. These are handled by dedicated API routes (`/api/facility/long-roll/*`) and do not interact with the indicator calculation pipeline.

### CSRF Protection

Mutation API routes use `src/lib/csrf-protection.ts`. POST/PUT/DELETE handlers call `validateCsrfToken(request)` before processing. The client must include a CSRF token header, obtained from the CSRF endpoint.

### Submission Deadline

`src/lib/submission-deadline.ts` manages monthly cutoff dates. The `SubmissionDeadlineGuard` component (`src/components/SubmissionDeadlineGuard.tsx`) wraps facility submission pages and blocks submission after the deadline.

## Environment Variables

```
DATABASE_URL=         # PostgreSQL connection string
NEXTAUTH_SECRET=      # JWT signing secret
NEXTAUTH_URL=         # App URL (http://localhost:3007 in dev)
```

## Key Config Notes

- **TypeScript and ESLint errors are ignored during `next build`** (`next.config.ts` sets `ignoreBuildErrors: true`). Run `tsc --noEmit` and `eslint` separately to check types.
- Path alias `@/*` resolves to `src/*`.
- Jest uses SWC (`@swc/jest`) with a separate `tsconfig.jest.json`.
- The dev server runs on **port 3007**, not the default 3000.
