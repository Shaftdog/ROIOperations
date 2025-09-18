# Overview

ROI Operations is a comprehensive appraisal company management system built with Next.js 14. The application provides order management, client tracking, document handling, and workflow automation for appraisal businesses. It features a modern React-based frontend with TypeScript, comprehensive UI components, and integrations for external services like Supabase, Google Maps, payment processing, and communication tools.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 14 with App Router for modern React server components and client-side interactivity
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming and dark mode support
- **UI Components**: Custom component library built on Radix UI primitives with consistent design patterns
- **State Management**: Zustand for client-side state with persistence middleware for user preferences and recent searches
- **Data Fetching**: TanStack Query (React Query) for server state management with caching and optimistic updates
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Tables**: TanStack Table for advanced data grid functionality with sorting, filtering, and infinite scroll

## Backend Architecture
- **API Layer**: Next.js API routes providing RESTful endpoints for order management, document handling, and integrations
- **Database Integration**: Supabase client with TypeScript types generated from database schema
- **Caching**: Redis integration for performance optimization with configurable cache expiration
- **File Storage**: Document upload and management system with support for multiple file types
- **Validation**: Zod schemas for runtime type checking and API request validation

## Data Storage Solutions
- **Primary Database**: Supabase (PostgreSQL) for orders, clients, documents, notes, and audit history
- **Caching Layer**: Redis for frequently accessed data like order lists and search results
- **Client Storage**: Local storage for form drafts, user preferences, and offline functionality
- **File Storage**: Integrated document management with metadata tracking

## Authentication and Authorization
- **Provider**: Supabase Auth with Next.js helpers for seamless server/client integration
- **Session Management**: Server-side session handling with automatic token refresh
- **Route Protection**: Middleware-based authentication checks for protected routes

## External Dependencies

### Core Services
- **Supabase**: Primary database, authentication, and real-time subscriptions
- **Google Maps API**: Property location mapping and geocoding services
- **Redis**: Performance caching and session storage

### Communication Services
- **Twilio**: SMS notifications for order updates and client communication
- **SendGrid**: Email delivery for reports, notifications, and client correspondence
- **Google Calendar**: Appointment scheduling and inspection calendar management

### Payment Processing
- **Stripe**: Payment processing for invoicing and fee collection

### Development and Monitoring
- **React Query Devtools**: Development debugging for data fetching
- **Service Worker**: Offline functionality and caching for improved user experience
- **Sonner**: Toast notifications for user feedback
- **Framer Motion**: Smooth animations and transitions throughout the interface

### UI and UX Libraries
- **Tremor**: Data visualization components for charts and analytics
- **Lucide React**: Consistent icon system throughout the application
- **React Dropzone**: File upload handling with drag-and-drop support
- **React Infinite Scroll**: Performance optimization for large data sets