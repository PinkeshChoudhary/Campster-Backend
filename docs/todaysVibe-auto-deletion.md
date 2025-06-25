# TodaysVibe Auto-Deletion System

## Overview
The TodaysVibe feature allows users to upload temporary media (images/videos) to places that automatically expire and get deleted after 5-6 hours, similar to Instagram/Snapchat stories.

## Implementation Details

### 1. Database Schema Changes
- **File**: `models/sitePlace.js`
- **Changes**: Added TTL (Time To Live) index to `todaysVibe.uploadedAt` field
- **Expiry**: 21600 seconds (6 hours)

```javascript
todaysVibe: {
  mediaUrl: String,
  mediaType: String, // 'image' or 'video'
  uploadedAt: { 
    type: Date, 
    default: Date.now,
    expires: 21600 // 6 hours in seconds
  },
  uploadedBy: String, // Firebase UID or name
}
```

### 2. Automated Cleanup Job
- **File**: `jobs/todaysVibeCleanup.js`
- **Schedule**: Runs every hour using cron job
- **Function**: Removes expired todaysVibe entries from database

#### Key Functions:
- `cleanupExpiredTodaysVibe()`: Removes expired content
- `getActiveTodaysVibe()`: Fetches only non-expired content
- `startTodaysVibeCleanupJob()`: Starts the scheduled cleanup
- `runManualCleanup()`: Manual cleanup trigger

### 3. Enhanced Controllers
- **File**: `controllers/placecontrollers.js`
- **New Functions**:
  - `uploadTodaysVibe()`: Enhanced with expiry validation
  - `getTodaysVibe()`: Get specific place's todaysVibe with expiry info
  - `getActiveTodaysVibes()`: Get all active todaysVibes
  - `manualCleanupTodaysVibe()`: Manual cleanup endpoint
  - `checkExpiredTodaysVibe()`: Middleware for real-time expiry checks

### 4. New API Endpoints
- **File**: `Routes/placesRoute.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/:id/todays-vibe` | Upload todaysVibe media |
| GET | `/:id/todays-vibe` | Get todaysVibe for specific place |
| GET | `/todays-vibes/active` | Get all active todaysVibes |
| POST | `/todays-vibes/cleanup` | Manual cleanup trigger |

## API Usage Examples

### 1. Upload TodaysVibe
```javascript
POST /api/places/:placeId/todays-vibe
Content-Type: multipart/form-data

Body:
- media: [file] (image or video)
- userId: [string] (Firebase UID)

Response:
{
  "message": "TodaysVibe uploaded successfully!",
  "todaysVibe": {
    "mediaUrl": "cloudinary_url",
    "mediaType": "image",
    "uploadedAt": "2025-06-25T12:00:00.000Z",
    "uploadedBy": "user123"
  },
  "expiresAt": "2025-06-25T18:00:00.000Z"
}
```

### 2. Get TodaysVibe with Expiry Info
```javascript
GET /api/places/:placeId/todays-vibe

Response:
{
  "todaysVibe": {
    "mediaUrl": "cloudinary_url",
    "mediaType": "image",
    "uploadedAt": "2025-06-25T12:00:00.000Z",
    "uploadedBy": "user123"
  },
  "expiresAt": "2025-06-25T18:00:00.000Z",
  "timeLeftMs": 18000000,
  "timeLeftHours": 5,
  "timeLeftMinutes": 0
}
```

### 3. Get All Active TodaysVibes
```javascript
GET /api/places/todays-vibes/active

Response:
{
  "count": 5,
  "places": [
    {
      "_id": "place_id",
      "destination": "Beach Resort",
      "todaysVibe": {
        "mediaUrl": "cloudinary_url",
        "mediaType": "video",
        "uploadedAt": "2025-06-25T14:00:00.000Z",
        "uploadedBy": "user456"
      }
    }
  ]
}
```

### 4. Manual Cleanup (Admin)
```javascript
POST /api/places/todays-vibes/cleanup

Response:
{
  "message": "Cleanup completed successfully",
  "modifiedCount": 3
}
```

## Features

### ✅ Automatic Expiry
- Content automatically expires after 6 hours
- MongoDB TTL index handles database-level cleanup
- Scheduled job provides additional cleanup layer

### ✅ Real-time Validation
- Prevents duplicate uploads before expiry
- Real-time expiry checks when fetching content
- Provides time remaining information

### ✅ Multiple Cleanup Mechanisms
1. **MongoDB TTL Index**: Database-level automatic deletion
2. **Scheduled Cron Job**: Runs every hour for additional cleanup
3. **Real-time Checks**: Validates expiry when accessing content
4. **Manual Cleanup**: Admin endpoint for immediate cleanup

### ✅ Enhanced Error Handling
- Validates file uploads
- Checks for existing non-expired content
- Provides detailed expiry information
- Graceful handling of expired content

## Monitoring & Logs

The system provides comprehensive logging:
- ✅ Successful cleanup operations
- ℹ️ No expired content found
- ❌ Error messages for failed operations
- 📅 Job scheduling confirmations

## Configuration

### Expiry Time
To change the expiry time, update these values:
1. `models/sitePlace.js`: `expires: 21600` (seconds)
2. `jobs/todaysVibeCleanup.js`: `6 * 60 * 60 * 1000` (milliseconds)
3. Controllers: `6 * 60 * 60 * 1000` (milliseconds)

### Cleanup Schedule
To change cleanup frequency, modify the cron pattern in `jobs/todaysVibeCleanup.js`:
```javascript
cron.schedule('0 * * * *', ...) // Every hour
cron.schedule('*/30 * * * *', ...) // Every 30 minutes
cron.schedule('0 */2 * * *', ...) // Every 2 hours
```

## Server Integration

The cleanup job automatically starts when the server starts:
```javascript
// server.js
const { startTodaysVibeCleanupJob } = require("./jobs/todaysVibeCleanup");

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startTodaysVibeCleanupJob(); // Starts the cleanup job
});
```

## Best Practices

1. **Frontend Implementation**: Always check `expiresAt` and `timeLeft` fields
2. **Error Handling**: Handle 404 responses for expired content gracefully
3. **User Experience**: Show countdown timers for active todaysVibes
4. **Performance**: Use the active todaysVibes endpoint for feed displays
5. **Admin Tools**: Use manual cleanup for maintenance operations

## Troubleshooting

### Content Not Expiring
1. Check if MongoDB TTL index is created
2. Verify cron job is running (check server logs)
3. Run manual cleanup endpoint
4. Check system time synchronization

### Performance Issues
1. Monitor cleanup job frequency
2. Check database index performance
3. Consider adjusting cleanup schedule
4. Monitor file storage cleanup (Cloudinary)

## Security Considerations

- Validate user permissions before upload
- Sanitize file uploads
- Rate limit todaysVibe uploads
- Secure admin cleanup endpoints
- Monitor storage usage and costs