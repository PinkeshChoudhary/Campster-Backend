const place = require('../models/sitePlace');
const { cleanupExpiredTodaysVibe, getActiveTodaysVibe } = require('../jobs/todaysVibeCleanup');

// Add a new place
const addPlace = async (req, res) => {
  try {
      const imageUrls = req.files.map(file => file.path);  // Get image URLs from Cloudinary
    const newPlace = new place({
      destination: req.body.destination,
      description: req.body.description,
      location: req.body.location,
      influncerInstaGramProfile:req.body.instagramProfile,
      locationCoordinates: req.body.locationCoordinates,
      images: imageUrls,
      approved: false,  // Initially not approved
      userId:req.body.userId,
      paid: req.body.paid,
      typeOfPlace: req.body.typeOfPlace,
    });
    await newPlace.save();
    res.status(201).json({ message: 'Place submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting place' });
  }
};

// Controller function to get a place by ID
const placebyid = async (req, res) => {
  try {
    const { id } = req.params;
    const Place = await place.findById(id);

    if (!Place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(Place);
  } catch (error) {
    console.error('Error fetching place:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// List approved places
const listPlaces = async (req, res) => {
  try {
    const places = await place.find({ approved: true });
    res.status(200).json({places});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching places' });
  }
};

const listPlaceCity = async (req, res) => {
 try {
    const { city } = req.query;
    // console.info("location", city)
    //  Fix: Check if city is missing
    if (!city || city.trim() === "") {
      return res.status(400).json({ error: "location name is required" });
    }

    //  Fetch only approved places for the given city
    const places = await place.find({approved: true , location: { $regex: new RegExp(city, "i") } });
    console.log("Places found:", places); // Debugging

    //  Return an empty array if no places exist
    return res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Like a place
const likePlace = async (req, res) => {
  const { placeId } = req.params;
  const { userId } = req.body; // Firebase UID from frontend

  try {
    const post = await place.findById(placeId);
    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Already liked" });
    }

    const updatedPost = await place.findByIdAndUpdate(
      placeId,
      { 
        $push: { likedBy: userId }, 
        $inc: { likes: 1 } 
      },
      { new: true } // Return updated document
    );

    res.json({ message: "Liked successfully", updatedPost });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// Add a comment
const addComment = async (req, res) => {
  try {
    const { user, text } = req.body;
    const Place = await place.findById(req.params.id);

    if (!Place) {
      return res.status(404).json({ message: "Place not found" });
    }

    Place.comments.push({ user, text });
    await Place.save();
     
    res.status(201).json(Place.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all comments for a place
const getComments = async (req, res) => {
  try {
    const Place = await place.findById(req.params.id);
    if (!Place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(Place.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all likes for place
const getLikes = async (req, res) => {
  try {
    const Place = await place.findById(req.params.id);
    if (!Place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(Place.likes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch places by userId
const getPostByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find camping experiences where the userId matches
    const places = await place.find({ userId });

    if (places.length === 0) {
      return res.status(404).json({ message: "No places found for this user." });
    }

    res.status(200).json({ places });
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Middleware to check and clean expired todaysVibe before fetching
const checkExpiredTodaysVibe = async (placeData) => {
  if (placeData.todaysVibe && placeData.todaysVibe.uploadedAt) {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    if (placeData.todaysVibe.uploadedAt < sixHoursAgo) {
      // Remove expired todaysVibe
      placeData.todaysVibe = undefined;
    }
  }
  return placeData;
};

const uploadTodaysVibe = async (req, res) => {
  const placeId = req.params.id;
  const { userId } = req.body; // Get userId from request body
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  
  const fileUrl = req.file.path;

  console.info("file", file);
  console.info("placeId", placeId);

  try {
    const Places = await place.findById(placeId);
    
    if (!Places) {
      return res.status(404).json({ message: "Place not found." });
    }

    // Check if there's already a todaysVibe that's not expired
    if (Places.todaysVibe && Places.todaysVibe.uploadedAt) {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      if (Places.todaysVibe.uploadedAt >= sixHoursAgo) {
        return res.status(400).json({
          message: "TodaysVibe already exists and hasn't expired yet.",
          expiresAt: new Date(Places.todaysVibe.uploadedAt.getTime() + 6 * 60 * 60 * 1000)
        });
      }
    }

    Places.todaysVibe = {
      mediaUrl: fileUrl,
      mediaType: file.mimetype.startsWith("video") ? "video" : "image",
      uploadedAt: new Date(),
      uploadedBy: userId || "anonymous",
    };
    
    await Places.save();
    
    res.status(200).json({
      message: "TodaysVibe uploaded successfully!",
      todaysVibe: Places.todaysVibe,
      expiresAt: new Date(Places.todaysVibe.uploadedAt.getTime() + 6 * 60 * 60 * 1000)
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed." });
  }
};

// Get all places with active (non-expired) todaysVibe
const getActiveTodaysVibes = async (req, res) => {
  try {
    const activePlaces = await getActiveTodaysVibe();
    res.status(200).json({
      count: activePlaces.length,
      places: activePlaces
    });
  } catch (error) {
    console.error("Error fetching active todaysVibes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manual cleanup endpoint (for admin use)
const manualCleanupTodaysVibe = async (req, res) => {
  try {
    const result = await cleanupExpiredTodaysVibe();
    res.status(200).json({
      message: "Cleanup completed successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Manual cleanup error:", error);
    res.status(500).json({ message: "Cleanup failed" });
  }
};

// Get todaysVibe for a specific place (with expiry check)
const getTodaysVibe = async (req, res) => {
  try {
    const { id } = req.params;
    const Places = await place.findById(id);
    
    if (!Places) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Check if todaysVibe exists and is not expired
    if (Places.todaysVibe && Places.todaysVibe.uploadedAt) {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      if (Places.todaysVibe.uploadedAt < sixHoursAgo) {
        // Remove expired todaysVibe
        Places.todaysVibe = undefined;
        await Places.save();
        return res.status(404).json({ message: "No active todaysVibe found" });
      }
      
      // Return active todaysVibe with expiry info
      const expiresAt = new Date(Places.todaysVibe.uploadedAt.getTime() + 6 * 60 * 60 * 1000);
      const timeLeft = expiresAt - new Date();
      
      res.status(200).json({
        todaysVibe: Places.todaysVibe,
        expiresAt,
        timeLeftMs: timeLeft,
        timeLeftHours: Math.floor(timeLeft / (1000 * 60 * 60)),
        timeLeftMinutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      });
    } else {
      res.status(404).json({ message: "No active todaysVibe found" });
    }
  } catch (error) {
    console.error("Error fetching todaysVibe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addPlace,
  listPlaces,
  placebyid,
  likePlace,
  addComment,
  getComments,
  getPostByUserId,
  getLikes,
  listPlaceCity,
  uploadTodaysVibe,
  getActiveTodaysVibes,
  manualCleanupTodaysVibe,
  getTodaysVibe,
  checkExpiredTodaysVibe
};
