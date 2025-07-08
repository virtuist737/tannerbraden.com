# Replit.md

## Overview

This is a full-stack web application built for a digital creator's portfolio and blog. The application features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database using Drizzle ORM. The system recently migrated from Cloudinary to Replit Object Storage for image management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme configuration
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy using session-based auth
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: Replit Object Storage (migrated from Cloudinary)
- **Development**: Hot reload with Vite integration
- **Build**: esbuild for production bundling

### Database Schema
Key entities include:
- **users**: Authentication and user management
- **blog_posts**: Blog content with SEO fields
- **projects**: Portfolio projects with technologies and buttons
- **ventures**: Company/venture information
- **interests**: Personal interests categorized by type
- **favorites**: Curated favorites by category
- **timeline**: Personal timeline events
- **newsletter_subscriptions**: Email subscription management

## Key Components

### Content Management
- **Blog System**: Full CRUD operations with rich text editing, SEO optimization, and category management
- **Portfolio Management**: Project showcase with image uploads, technology tags, and action buttons
- **Timeline Management**: Personal timeline with drag-and-drop reordering
- **Interests & Favorites**: Categorized content management with sorting capabilities

### Image Management
- **Object Storage Integration**: Custom implementation using Replit Object Storage
- **Upload System**: Multer-based file upload with memory storage
- **Image Serving**: Custom API endpoints for serving images with caching

### Authentication & Security
- **Session-based Authentication**: Using express-session with PostgreSQL store
- **Password Security**: Scrypt-based password hashing
- **Protected Routes**: Client and server-side route protection

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle requests with authentication middleware
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **File Operations**: Object Storage handles image uploads and serving
5. **Response Handling**: Structured JSON responses with error handling

## External Dependencies

### Core Dependencies
- **@replit/object-storage**: File storage service
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: UI component primitives

### Development Tools
- **Vite**: Development server and bundling
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **tsx**: TypeScript execution for scripts

## Deployment Strategy

- **Platform**: Replit with Cloud Run deployment
- **Build Process**: Vite builds client assets, esbuild bundles server
- **Environment**: Production mode with NODE_ENV=production
- **Port Configuration**: Internal port 5000, external port 80
- **Database**: PostgreSQL 16 with connection pooling

## Changelog

- July 8, 2025. Implemented blog image optimization system with Sharp
  - Added multi-size image processing (thumbnail, medium, large)
  - Optimized JPEG compression with progressive loading
  - Responsive image serving with srcset and sizes attributes
  - Automatic cleanup of old optimized images
  - Database schema updated to store optimized image URLs
  - Frontend components updated to use responsive images
- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.