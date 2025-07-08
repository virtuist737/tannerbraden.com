# Replit.md

## Overview

This is a web-based music creation platform designed to revolutionize digital audio production through an innovative, user-friendly interface. The application provides musicians and producers with powerful tools for creating, manipulating, and exploring sound using modern web technologies including React, TypeScript, Tone.js, and the Web Audio API.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme configuration
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Routing**: Wouter for client-side routing
- **Audio Engine**: Tone.js for audio synthesis and Web Audio API
- **State Management**: React hooks for component state
- **Animations**: Framer Motion for smooth transitions
- **Grid Sequencer**: Interactive 16-step drum sequencer
- **Virtual Synthesizer**: Real-time audio synthesis with effects

### Audio Features
- **Tone.js Integration**: Professional audio synthesis engine
- **Web Audio API**: Low-latency audio processing
- **Real-time Synthesis**: Interactive synthesizer with ADSR envelope
- **Grid Sequencer**: 16-step drum machine with multiple tracks
- **Effects Chain**: Filters, distortion, and reverb processing
- **Keyboard Control**: Computer keyboard and virtual piano interface

### Core Components
Key music creation components include:
- **GridSequencer**: 16-step drum sequencer with pattern programming
- **Synthesizer**: Virtual synthesizer with oscillators and envelope controls
- **MusicStudio**: Main application interface with tabbed layout
- **Audio Engine**: Tone.js integration for real-time audio synthesis
- **Virtual Keyboard**: Interactive piano interface with computer keyboard mapping
- **Effects Chain**: Audio processing with filters, distortion, and reverb

## Key Components

### Music Creation Tools
- **Grid Sequencer**: 16-step drum sequencer with 8 tracks for creating rhythmic patterns
- **Virtual Synthesizer**: Real-time audio synthesis with oscillator types, ADSR envelope, and effects
- **Audio Effects**: Filter controls, distortion, and reverb processing
- **Interactive Controls**: Real-time parameter adjustment with visual feedback

### User Interface
- **Tabbed Layout**: Switch between full studio, synthesizer-only, and sequencer-only modes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between visual themes
- **Visual Feedback**: Real-time step indicators and parameter displays

### Audio Technology
- **Tone.js Integration**: Professional-grade audio synthesis and scheduling
- **Web Audio API**: Low-latency audio processing and effects
- **Real-time Processing**: Immediate audio feedback for all user interactions
- **Cross-platform**: Works in all modern web browsers

## Data Flow

1. **User Interaction**: User clicks sequencer grid, plays keyboard, or adjusts controls
2. **Audio Processing**: Tone.js processes audio synthesis and scheduling
3. **Real-time Feedback**: Visual updates show current playback state and parameters
4. **Audio Output**: Web Audio API delivers low-latency audio to speakers/headphones
5. **State Management**: React hooks manage component state and UI updates

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

- July 8, 2025. Built Web-based Music Creation Platform
  - Created GridSequencer component with 16-step drum sequencer
  - Built Synthesizer component with ADSR envelope and effects
  - Implemented Tone.js integration for audio synthesis
  - Added virtual keyboard with computer keyboard mapping
  - Created MusicStudio main interface with tabbed layout
  - Added audio effects: filters, distortion, and reverb
  - Implemented responsive design with dark/light theme support
  - Added real-time visual feedback for sequencer and synthesizer
- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.