# Cloudinary to Replit Object Storage Migration Guide

## Overview

This document explains how we migrated our application's image storage from Cloudinary to Replit Object Storage.

## What Was Changed

### Core Components
1. **Object Storage Implementation**:
   - Created `server/lib/objectStorage.ts` with:
     - `uploadToObjectStorage`: Handles file upload to Replit Object Storage
     - `deleteFromObjectStorage`: Removes files from storage
     - `getObjectPathFromUrl`: Extracts object paths from URLs

2. **Image Serving**:
   - Added endpoint at `/api/objects/:path(*)` to serve files from Object Storage
   - Files are cached for better performance

3. **Image Upload**:
   - Updated all image upload handlers to use Object Storage
   - Maintained the same API interface for client compatibility

### Migration Process
We created a migration script (`server/scripts/migrate-cloudinary-to-objectstorage.ts`) that:
1. Fetches all entities with image URLs from the database
2. Downloads each image from Cloudinary
3. Uploads the image to Replit Object Storage
4. Updates the entity's image URL in the database

## How to Run the Migration

To migrate existing images from Cloudinary to Replit Object Storage:

```bash
# Run the migration script
./migrate-images.sh
```

## Technical Details

### URL Format Changes
- Cloudinary URLs: `https://res.cloudinary.com/{cloud_name}/{resource_type}/{type}/{version}/{public_id}.{format}`
- Object Storage URLs: `https://{replid}.id.repl.co/api/objects/portfolio/{folder}/{timestamp}-{random}{extension}`

### Key Differences
1. Object Storage doesn't have built-in image transformations
2. Files are served directly from our API instead of a CDN
3. Files are more straightforward to manage with direct access to storage

## Benefits
1. Keeps all assets in the Replit ecosystem
2. Reduces external dependencies
3. Simplified configuration (no API keys needed for Object Storage)
4. More direct control over the storage and retrieval process

## Cleanup
After confirming the migration is complete, you can:
1. Remove Cloudinary-related packages:
   ```bash
   npm uninstall cloudinary multer-storage-cloudinary
   ```
2. Delete the Cloudinary configuration files