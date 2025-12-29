import multer from 'multer';

// Error handler for multer
export const multerErrorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('\n❌ MULTER ERROR DETECTED');
    console.error('Error code:', error.code);
    console.error('Error field:', error.field);
    console.error('Error message:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    console.error('=====================================\n');
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: 'File upload error: ' + error.message });
  }
  next(error);
};

