// Middleware to log upload requests
export const uploadLogger = (req, res, next) => {
  if (req.path === '/api/upload') {
    console.log('\n========== UPLOAD REQUEST RECEIVED ==========');
    console.log('📅 Time:', new Date().toISOString());
    console.log('🌐 Method:', req.method);
    console.log('📍 URL:', req.url);
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Content-Type:', req.headers['content-type']);
    console.log('📏 Content-Length:', req.headers['content-length']);
    console.log('==============================================\n');
  }
  next();
};


