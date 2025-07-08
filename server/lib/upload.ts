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
    fileSize: 50 * 1024 * 1024 // 50MB limit for audio
  },
  fileFilter: (req, file, cb) => {
    // Only accept audio files
    const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-wav'];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});