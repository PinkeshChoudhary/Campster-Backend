// Import necessary modules
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Ensure dotenv is loaded (this should already be in server.js, but let's confirm here)
require('dotenv').config();


// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Set up multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campster-places',  // Folder to store the images
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'avif'],
    resource_type: 'auto', // Automatically detects images/videos
  },
});

// Set up multer with the Cloudinary storage configuration
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
 });

// Export the upload function to be used in routes
module.exports = upload;
