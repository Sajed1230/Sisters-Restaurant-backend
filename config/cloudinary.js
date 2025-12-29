import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

// Function to configure Cloudinary (call this to ensure env vars are loaded)
const configureCloudinary = () => {
  console.log('🔧 Configuring Cloudinary...');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  console.log('   - Cloud Name:', cloudName ? `${cloudName.substring(0, 3)}...` : 'NOT SET');
  console.log('   - API Key:', apiKey ? `${apiKey.substring(0, 3)}...` : 'NOT SET');
  console.log('   - API Secret:', apiSecret ? 'SET' : 'NOT SET');
  
  if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Cloudinary credentials missing!');
    console.error('   Please check your .env file has:');
    console.error('   - CLOUDINARY_CLOUD_NAME');
    console.error('   - CLOUDINARY_API_KEY');
    console.error('   - CLOUDINARY_API_SECRET');
    throw new Error('Cloudinary credentials not configured');
  }
  
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
  
  console.log('✅ Cloudinary configured successfully');
  return true;
};

// Don't configure immediately - wait for dotenv to load
// Configuration will happen when configureCloudinary() is called

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 [Multer] File filter check:');
    console.log('   - Original name:', file.originalname);
    console.log('   - Mimetype:', file.mimetype);
    console.log('   - Field name:', file.fieldname);
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    console.log('   - Extension check:', extname ? '✅' : '❌');
    console.log('   - Mimetype check:', mimetype ? '✅' : '❌');
    
    if (extname && mimetype) {
      console.log('   ✅ File accepted');
      return cb(null, true);
    } else {
      console.log('   ❌ File rejected - not an image');
      cb(new Error('Only image files are allowed!'));
    }
  }
});

console.log('✅ Multer configured with memory storage');

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'sisters-restaurant') => {
  return new Promise((resolve, reject) => {
    console.log('   [Cloudinary] Creating upload stream...');
    console.log('   [Cloudinary] Buffer size:', buffer.length, 'bytes');
    console.log('   [Cloudinary] Folder:', folder);
    
    // Verify Cloudinary config before upload
    const config = cloudinary.config();
    console.log('   [Cloudinary] Current config:');
    console.log('      - Cloud name:', config.cloud_name || 'NOT SET');
    console.log('      - API key:', config.api_key ? `${config.api_key.substring(0, 3)}...` : 'NOT SET');
    console.log('      - API secret:', config.api_secret ? 'SET' : 'NOT SET');
    
    if (!config.api_key) {
      const error = 'Cloudinary API key is not configured. Please check your .env file.';
      console.error('   [Cloudinary]', error);
      return reject(new Error(error));
    }
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('   [Cloudinary] Upload error:', error);
          console.error('   [Cloudinary] Error details:', JSON.stringify(error, null, 2));
          reject(error);
        } else {
          console.log('   [Cloudinary] Upload successful!');
          console.log('   [Cloudinary] Result:', JSON.stringify(result, null, 2));
          resolve(result);
        }
      }
    );
    
    console.log('   [Cloudinary] Creating readable stream from buffer...');
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    
    console.log('   [Cloudinary] Piping stream to Cloudinary...');
    readableStream.pipe(uploadStream);
    
    uploadStream.on('error', (err) => {
      console.error('   [Cloudinary] Stream error:', err);
    });
    
    readableStream.on('error', (err) => {
      console.error('   [Cloudinary] Readable stream error:', err);
    });
  });
};

export { cloudinary, upload, uploadToCloudinary, configureCloudinary };

