const place = require('../models/sitePlace');

// Add a new place or edit existing place
const addPlace = async (req, res) => {
  try {
    // Check if this is an edit operation
    const isEdit = req.body.isEdit === 'true';
    const placeId = req.body.placeId;

    // Handle images from req.files.images (array of files)
    const imageUrls = req.files && req.files.images ? req.files.images.map(file => file.path) : [];
    
    // Handle audio from req.files.audio (single file in array)
    const audioUrl = req.files && req.files.audio && req.files.audio[0] ? req.files.audio[0].path : null;
    
    // Prepare the place data
    const placeData = {
      destination: req.body.destination,
      description: req.body.description,
      location: req.body.location,
      influncerInstaGramProfile: req.body.instagramProfile,
      locationCoordinates: req.body.locationCoordinates,
      userId: req.body.userId,
      paid: req.body.paid,
      typeOfPlace: req.body.typeOfPlace,
    };

    // Only update images and audio if new files are provided
    if (imageUrls.length > 0) {
      if (isEdit && placeId) {
        // For edits: append new images to existing ones
        const existingPlace = await place.findById(placeId);
        if (existingPlace && existingPlace.images) {
          placeData.images = [...existingPlace.images, ...imageUrls];
        } else {
          placeData.images = imageUrls;
        }
      } else {
        // For new places: use the provided images
        placeData.images = imageUrls;
      }
    }
    if (audioUrl) {
      placeData.audioUrl = audioUrl;
    }

    if (isEdit && placeId) {
      // Edit existing place
      const existingPlace = await place.findById(placeId);
      
      if (!existingPlace) {
        return res.status(404).json({ error: 'Place not found' });
      }

      // Check if the user owns this place (optional security check)
      if (existingPlace.userId !== req.body.userId) {
        return res.status(403).json({ error: 'Unauthorized to edit this place' });
      }

      // Update the existing place
      const updatedPlace = await place.findByIdAndUpdate(
        placeId,
        placeData,
        { new: true, runValidators: true }
      );

      res.status(200).json({ message: 'Place updated successfully', place: updatedPlace });
    } else {
      // Create new place
      placeData.approved = false; // Initially not approved for new places
      placeData.images = imageUrls; // Required for new places
      
      const newPlace = new place(placeData);
      await newPlace.save();
      
      res.status(201).json({ message: 'Place submitted successfully', place: newPlace });
    }
  } catch (error) {
    console.error('Error submitting/updating place:', error);
    res.status(500).json({ error: 'Error submitting/updating place', details: error.message });
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
const uploadTodaysVibe = async (req, res) => {
  const placeId = req.params.id;
  // const { uid } = req.user; // from Firebase auth
  const file = req.file;
  const fileUrl = req.file.path;

console.info("file", file)
console.info("placeId", placeId)

  try {
    const Places = await place.findById(placeId);
console.info("place", Places)
    Places.todaysVibe = {
      mediaUrl: fileUrl,
      mediaType: file.mimetype.startsWith("video") ? "video" : "image",
      uploadedAt: new Date(),
      uploadedBy: "uid",
    };
console.info('every thig ok', Places)
    await Places.save();
    res.status(200).json(Places.todaysVibe);
  } catch (err) {
    res.status(500).json({ message: "Upload failed." });
  }
};


module.exports = { addPlace, listPlaces, placebyid, likePlace, addComment, getComments, getPostByUserId, getLikes, listPlaceCity, uploadTodaysVibe };
