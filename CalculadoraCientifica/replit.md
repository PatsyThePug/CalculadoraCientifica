# Overview

This is a full-stack TypeScript web application built with React frontend and Express backend. The main feature is a calculator application with scientific functions. The project uses modern development tools including Vite for frontend building, Drizzle ORM for database operations, and shadcn/ui for the component library.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage
- **API Structure**: RESTful API design with /api prefix

## Data Layer
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: TypeScript-first schema definitions in shared/schema.ts
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Storage Interface**: Abstracted storage interface with memory-based implementation for development

## Development Setup
- **Monorepo Structure**: Single repository with client/, server/, and shared/ directories
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Path Aliases**: Configured for clean imports (@/, @shared/, etc.)
- **Hot Reload**: Vite HMR for frontend, tsx for backend development

## Authentication & Security
- **Session-based Authentication**: Express sessions stored in PostgreSQL
- **CORS**: Configured for development with credentials support
- **Environment Variables**: DATABASE_URL for database connection

# External Dependencies

## Database
- **Neon PostgreSQL**: Serverless PostgreSQL database via @neondatabase/serverless
- **Connection**: Configured through DATABASE_URL environment variable

## UI Components
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel component for interactive content

## Development Tools
- **Replit Integration**: Configured with replit-specific plugins for development environment
- **Math.js**: Mathematical expression parser and evaluator for calculator functionality
- **date-fns**: Date manipulation library
- **clsx & tailwind-merge**: Utility libraries for conditional CSS classes

## Build Dependencies
- **esbuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **TypeScript**: Type checking and compilation