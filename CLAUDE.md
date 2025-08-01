# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
pnpm dev

# Production build
pnpm build

# Database setup (creates .env file)
pnpm db:setup

# Database operations
pnpm db:migrate    # Run database migrations
pnpm db:seed       # Seed database with test user (test@test.com / admin123)
pnpm db:generate   # Generate Drizzle schema files
pnpm db:studio     # Open Drizzle Studio for database management

# Stripe webhook testing (local development)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Architecture Overview

### Authentication & Authorization
- **JWT-based authentication** with cookies (`session` cookie)
- **Global middleware** (`middleware.ts`) protects `/dashboard` routes and refreshes JWT tokens
- **Local middleware** (`lib/auth/middleware.ts`) provides validation wrappers:
  - `validatedAction()` - Zod schema validation for Server Actions
  - `validatedActionWithUser()` - Requires authenticated user
  - `withTeam()` - Requires user with team access
- **RBAC system** with `owner` and `member` roles at team level

### Data Layer
- **PostgreSQL** with **Drizzle ORM**
- **Core entities**: `users`, `teams`, `teamMembers`, `activityLogs`, `invitations`
- **Relational queries** via Drizzle relations
- **Activity logging** for all user actions (sign in/out, team changes, etc.)
- **Soft deletes** for user accounts

### Route Structure
- **Public routes**: `/` (home), `/pricing`, `/sign-in`, `/sign-up`
- **Protected routes**: `/dashboard/*` (requires authentication)
- **API routes**: `/api/user`, `/api/team`, `/api/stripe/*`
- **Route groups**: `(dashboard)` for protected pages, `(login)` for auth pages

### UI & Styling
- **ShadCN/UI v4** components with "new-york" style
- **Tailwind CSS v4** with custom theme system using `@theme` directive
- **Theme support**: Light/dark mode with `next-themes`
- **Custom color mappings**: Gray colors map to semantic theme tokens for consistent theming

### Payments Integration
- **Stripe integration** for subscriptions and checkout
- **Webhook handling** at `/api/stripe/webhook`
- **Customer portal** for subscription management
- **Team-based billing** with Stripe customer/subscription IDs stored in teams table

### Key Patterns
- **Server Actions** for form handling with validation middleware
- **SWR** for client-side data fetching with fallback data
- **Activity logging** automatically tracks user actions with team context
- **Team-centric architecture** where users belong to teams with roles
- **Invitation system** for team member management

### Layout System
- **Simplified dashboard layout**: Single layout at `/dashboard/layout.tsx` with ShadCN sidebar
- **Home page header**: Includes navigation to pricing, theme toggle, and sign up
- **Dashboard sidebar**: Integrated user menu with avatar dropdown and working sign out

### Component Organization
- **UI components**: `/components/ui/*` (ShadCN components)
- **Custom components**: `/components/*` (ThemeProvider, ThemeToggle, etc.)
- **Page-specific components**: Colocated with pages (e.g., Terminal component in dashboard)

## Environment Setup
Database URL should be set in `.env` file. Use `pnpm db:setup` to generate initial configuration, then add your actual database credentials.

## Testing
Default seeded user for development:
- Email: `test@test.com`
- Password: `admin123`

For Stripe testing, use card number `4242 4242 4242 4242` with any future expiration date.