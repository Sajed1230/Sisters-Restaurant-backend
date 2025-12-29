import { uploadToCloudinary, configureCloudinary } from '../config/cloudinary.js';

// Upload image to Cloudinary
export const uploadImage = async (req, res) => {
  try {
    console.log('📤 Processing upload request...');
    console.log('📁 Request body keys:', Object.keys(req.body));
    console.log('📁 Request file:', req.file ? 'Present' : 'Missing');
    
    if (!req.file) {
      console.log('❌ No file in request');
      console.log('📋 Request body:', req.body);
      console.log('📋 Request files:', req.files);
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    console.log('✅ File received successfully!');
    console.log('📁 File details:');
    console.log('   - Original name:', req.file.originalname);
    console.log('   - Mimetype:', req.file.mimetype);
    console.log('   - Size:', req.file.size, 'bytes');
    console.log('   - Buffer length:', req.file.buffer ? req.file.buffer.length : 'No buffer');
    console.log('   - Field name:', req.file.fieldname);
    
    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    console.log('\n☁️ Cloudinary Configuration Check:');
    console.log('   - Cloud Name:', cloudName ? `${cloudName.substring(0, 3)}...` : 'NOT SET');
    console.log('   - API Key:', apiKey ? 'SET' : 'NOT SET');
    console.log('   - API Secret:', apiSecret ? 'SET' : 'NOT SET');
    
    if (!cloudName || !apiKey || !apiSecret || 
        cloudName === 'your_cloud_name' || 
        apiKey === 'your_api_key' || 
        apiSecret === 'your_api_secret') {
      console.log('❌ Cloudinary not properly configured');
      return res.status(400).json({ 
        error: 'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file, or use an image URL instead of uploading a file.' 
      });
    }
    
    console.log('✅ Cloudinary credentials validated');
    
    // Re-configure Cloudinary to ensure it has the latest env vars
    console.log('🔧 Re-configuring Cloudinary with current env vars...');
    try {
      configureCloudinary();
    } catch (configError) {
      console.error('❌ Failed to configure Cloudinary:', configError);
      return res.status(500).json({ error: 'Cloudinary configuration error: ' + configError.message });
    }
    
    console.log('☁️ Starting upload to Cloudinary...');
    console.log('   - Folder: sisters-restaurant');
    console.log('   - Buffer size:', req.file.buffer.length, 'bytes');
    
    const uploadStartTime = Date.now();
    const result = await uploadToCloudinary(req.file.buffer);
    const uploadDuration = Date.now() - uploadStartTime;
    
    console.log('✅ Upload successful!');
    console.log('   - Duration:', uploadDuration, 'ms');
    console.log('   - Image URL:', result.secure_url);
    console.log('   - Cloudinary ID:', result.public_id);
    console.log('   - Format:', result.format);
    console.log('   - Width:', result.width);
    console.log('   - Height:', result.height);
    console.log('   - Bytes:', result.bytes);
    
    const response = {
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id
    };
    
    console.log('📤 Sending response:', JSON.stringify(response, null, 2));
    console.log('========== UPLOAD COMPLETE ==========\n');
    
    res.json(response);
  } catch (error) {
    console.error('\n❌ ERROR UPLOADING IMAGE');
    console.error('Error type:', typeof error);
    console.error('Error:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error stack:', error?.stack);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error || {}), 2));
    console.error('=====================================\n');
    
    // Handle both Error objects and string errors
    const errorString = typeof error === 'string' ? error : (error?.message || String(error) || 'Unknown error');
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to upload image';
    
    if (errorString.includes('Must supply api_key') || errorString.includes('api_key')) {
      errorMessage = 'Cloudinary API key is missing. Please check your CLOUDINARY_API_KEY in .env file.';
      console.error('🔍 Issue: Cloudinary API key not found in environment variables');
    } else if (errorString.includes('Invalid cloud_name') || errorString.includes('cloud_name')) {
      errorMessage = 'Invalid Cloudinary cloud name. Please check your CLOUDINARY_CLOUD_NAME in .env';
    } else if (errorString.includes('Invalid API Key')) {
      errorMessage = 'Invalid Cloudinary API key. Please check your CLOUDINARY_API_KEY in .env';
    } else if (errorString.includes('Invalid API Secret') || errorString.includes('api_secret')) {
      errorMessage = 'Invalid Cloudinary API secret. Please check your CLOUDINARY_API_SECRET in .env';
    } else if (errorString.includes('Unauthorized')) {
      errorMessage = 'Cloudinary authentication failed. Please check your API credentials.';
    } else {
      errorMessage = errorString;
    }
    
    res.status(500).json({ error: errorMessage });
  }
};

