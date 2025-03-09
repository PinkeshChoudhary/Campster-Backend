const place = require('../models/sitePlace');

// Add a new place
const addPlace = async (req, res) => {
  try {
      const imageUrls = req.files.map(file => file.path);  // Get image URLs from Cloudinary
    const newPlace = new place({
      destination: req.body.destination,
      description: req.body.description,
      location: req.body.location,
      locationCoordinates: req.body.locationCoordinates,
      images: imageUrls,
      approved: false,  // Initially not approved
      userId:req.body.userId,
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
    console.info("location", city)
    // ✅ Fix: Check if city is missing
    if (!city || city.trim() === "") {
      return res.status(400).json({ error: "location name is required" });
    }

    // ✅ Fetch only approved places for the given city
    const places = await place.find({approved: true , location: city });

    // ✅ Return an empty array if no places exist
    return res.status(200).json({ places });
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

module.exports = { addPlace, listPlaces, placebyid, likePlace, addComment, getComments, getPostByUserId, getLikes, listPlaceCity };
