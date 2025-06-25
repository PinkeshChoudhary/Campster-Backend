const cron = require('node-cron');
const place = require('../models/sitePlace');

// Function to clean up expired todaysVibe content
const cleanupExpiredTodaysVibe = async () => {
  try {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000); // 6 hours ago
    
    // Find places with todaysVibe older than 6 hours
    const result = await place.updateMany(
      {
        'todaysVibe.uploadedAt': { $lt: sixHoursAgo },
        'todaysVibe.mediaUrl': { $exists: true }
      },
      {
        $unset: {
          'todaysVibe.mediaUrl': '',
          'todaysVibe.mediaType': '',
          'todaysVibe.uploadedAt': '',
          'todaysVibe.uploadedBy': ''
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Cleaned up ${result.modifiedCount} expired todaysVibe entries at ${new Date().toISOString()}`);
    } else {
      console.log(`ℹ️ No expired todaysVibe entries found at ${new Date().toISOString()}`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error cleaning up expired todaysVibe:', error);
    throw error;
  }
};

// Function to get places with active todaysVibe (not expired)
const getActiveTodaysVibe = async () => {
  try {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    
    const activePlaces = await place.find({
      'todaysVibe.uploadedAt': { $gte: sixHoursAgo },
      'todaysVibe.mediaUrl': { $exists: true }
    });
    
    return activePlaces;
  } catch (error) {
    console.error('❌ Error fetching active todaysVibe:', error);
    throw error;
  }
};

// Schedule cleanup job to run every hour
const startTodaysVibeCleanupJob = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('🧹 Running todaysVibe cleanup job...');
    await cleanupExpiredTodaysVibe();
  });
  
  console.log('📅 TodaysVibe cleanup job scheduled to run every hour');
};

// Manual cleanup function for immediate execution
const runManualCleanup = async () => {
  console.log('🧹 Running manual todaysVibe cleanup...');
  return await cleanupExpiredTodaysVibe();
};

module.exports = {
  cleanupExpiredTodaysVibe,
  getActiveTodaysVibe,
  startTodaysVibeCleanupJob,
  runManualCleanup
};