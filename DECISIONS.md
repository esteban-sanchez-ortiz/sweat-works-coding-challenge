# Technical Decisions

## Database: PostgreSQL

**Choice**: PostgreSQL over MySQL/SQLite

**Rationale**:
- Partial unique indexes (critical for "one active membership" constraint)
- Better JSON support if needed for future features
- Industry standard for production workloads

## ORM: Prisma

**Choice**: Prisma over TypeORM/Knex

**Rationale**:
- Type-safe queries with TypeScript
- Declarative schema with migrations
- Simple transaction API for concurrency handling

## "One Active Membership" Enforcement

**Choice**: Database constraint + application check

**Rationale**:
- Database partial unique index is the ultimate safety net (cannot be bypassed)
- Application-level check provides better error messages
- Transaction ensures atomicity of check + create

**Alternative Considered**: Application-only validation
- Rejected: Race conditions could create duplicate active memberships

## Membership Cancellation Model

**Choice**: Keep membership record with `cancelledAt` effective date

**Rationale**:
- Preserves history for analytics, marketing, and auditing
- Allows grace period (member can check in until effective date)
- Enables future features like win-back campaigns

**Alternative Considered**: Delete membership on cancel
- Rejected: Loses valuable business data

## Frontend State: React Query

**Choice**: TanStack React Query over Redux/Zustand

**Rationale**:
- Server state management (not client state)
- Built-in caching and refetching
- Simpler than Redux for data fetching patterns

## API Design: REST

**Choice**: REST over GraphQL

**Rationale**:
- Simpler for small API surface
- Easier to understand and debug
- No need for flexible queries in this scope

## Styling: TailwindCSS

**Choice**: Tailwind utility classes

**Rationale**:
- Fast to prototype
- No context switching between files
- Challenge allows "unstyled or styled however you like"

## Testing: Vitest

**Choice**: Vitest over Jest

**Rationale**:
- Same test runner for frontend (Vite) and backend
- Faster execution
- Compatible with Jest API

## UUID vs Auto-increment IDs

**Choice**: UUIDs for all primary keys

**Rationale**:
- No information leakage (can't guess record counts)
- Safe for distributed systems
- URL-safe by default

## Money Storage

**Choice**: Store prices as integers (cents)

**Rationale**:
- Avoids floating-point precision issues
- Standard practice for financial data
- Display formatting handled at UI layer
