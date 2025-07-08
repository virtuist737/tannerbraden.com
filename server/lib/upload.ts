import multer from 'multer';

// Configure memory storage for temporary file handling
const storage = multer.memoryStorage();

// Create upload middleware with memory storage for images
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Create upload middleware for audio files
export const audioUpload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for audio
  },
  fileFilter: (req, file, cb) => {
    // Only accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});