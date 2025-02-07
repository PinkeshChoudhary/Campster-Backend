const multer = require("multer");

// Set storage engine (memoryStorage to store files in memory)
const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: 5MB limit for each file
}).array("images", 8);  // 'images' is the name attribute in the frontend form, and max 8 images

module.exports = upload;
