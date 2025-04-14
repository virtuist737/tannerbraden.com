#!/bin/bash
# Script to run the Cloudinary to Object Storage migration

echo "Starting image migration from Cloudinary to Replit Object Storage..."
npx tsx server/scripts/migrate-cloudinary-to-objectstorage.ts