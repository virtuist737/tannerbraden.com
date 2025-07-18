# Replit.md

## Overview

This is a full-stack web application built for a digital creator's portfolio and blog. The application features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database using Drizzle ORM. The system includes blog functionality with the ability to attach audio files to blog posts for song playback.

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
- **File Storage**: Replit Object Storage for audio files and images
- **Development**: Hot reload with Vite integration
- **Build**: esbuild for production bundling

### Database Schema
Key entities include:
- **users**: Authentication and user management
- **blog_posts**: Blog content with SEO fields and song attachments (songTitle, songAudioUrl, songCoverUrl)
- **projects**: Portfolio projects with technologies and buttons
- **ventures**: Company/venture information
- **interests**: Personal interests categorized by type
- **favorites**: Curated favorites by category
- **timeline**: Personal timeline events
- **newsletter_subscriptions**: Email subscription management

## Key Components

### Blog Audio Features
- **Audio Upload**: Upload audio files (MP3, WAV, OGG) for song attachments
- **Song Metadata**: Song title and cover image for each audio attachment
- **Audio Player**: Custom audio player component with playback controls
- **File Validation**: Server-side validation for audio file types and sizes
- **Storage Integration**: Audio files stored in Replit Object Storage

### Content Management
- **Blog System**: Full CRUD operations with rich text editing, SEO optimization, and song attachments
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
4. **File Operations**: Object Storage handles audio and image uploads
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

- July 18, 2025. Security Updates
  - Updated Multer from 2.0.1 to 2.0.2 to address DoS vulnerability (CVE affecting versions >= 1.4.4-lts.1, < 2.0.2)
  - Applied npm audit fixes to resolve vulnerabilities in @babel/helpers and on-headers
  - Updated esbuild to 0.25.6 to address development server security issue
  - Remaining vulnerabilities in nested dependencies (drizzle-kit, vite) require major version updates
  - All file upload functionality using Multer is now secure against malformed request DoS attacks
- July 8, 2025. Enhanced SEO and Social Media Metadata System
  - Completely overhauled SEO metadata system for better social media previews
  - Created custom SVG social media preview images (1200x630 optimized for Open Graph)
  - Fixed blog post pages to use proper SEO generation functions
  - Added structured data (JSON-LD) for better search engine understanding
  - Improved Open Graph tags with proper image dimensions and alt text
  - Enhanced Twitter Card metadata with creator and site information
  - Added homepage-specific social media image and metadata
  - Updated all pages (home, about, blog, projects, contact) to use improved SEO system
  - Fixed image URL resolution for social media sharing
  - Added rich snippets support for blog posts and person schema
- July 8, 2025. Added Blog Song Attachment Functionality
  - Added song fields to blog_posts table (songTitle, songAudioUrl, songCoverImage)
  - Created AudioUpload component for uploading audio files with progress tracking
  - Built SongPlaybackCard component with custom audio player featuring volume controls
  - Added audio file upload endpoint at /api/upload/audio with validation
  - Integrated audio upload into blog form with all three song fields
  - Updated blog post display to show song playback card
  - Implemented file validation for audio formats (MP3, WAV, OGG) with 50MB limit
  - Added Object Storage integration for audio file storage
  - Fixed database schema synchronization with manual ALTER TABLE
- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.