const CampingExperience = require('../models/sitePlace');

// Add a new place
const addPlace = async (req, res) => {
  try {
      const imageUrls = req.files.map(file => file.path);  // Get image URLs from Cloudinary
    const newExperience = new CampingExperience({
      destination: req.body.destination,
      date: req.body.date,
      duration: req.body.duration,
      groupSize: req.body.groupSize,
      tentCondition: req.body.tentCondition,
      comfort: req.body.comfort,
      rating: req.body.rating,
      amenities: req.body.amenities ? req.body.amenities.split(",") : [],
      wildlife: req.body.wildlife,
      bestPart: req.body.bestPart,
      challenges: req.body.challenges,
      tips: req.body.tips,
      images: imageUrls,
      approved: false,  // Initially not approved
      userId:req.body.userId,
    });

    await newExperience.save();
    res.status(201).json({ message: 'Place submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting place' });
  }
};

// Controller function to get a place by ID
const placebyid = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await CampingExperience.findById(id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(place);
  } catch (error) {
    console.error('Error fetching place:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// List approved places
const listPlaces = async (req, res) => {
  try {
    const places = await CampingExperience.find({ approved: true });
    res.status(200).json({places});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching places' });
  }
};


// Like a place
const likePlace = async (req, res) => {
  console.info("api het", req.params , req.body)
  const { placeId } = req.params;
  const { userId } = req.body; // Firebase UID from frontend

  try {
    const post = await CampingExperience.findById(placeId);
    if (!post) return res.status(404).json({ message: "post not found" });

    if (post.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Already liked" });
    }

    post.likedBy.push(userId);
    post.likes += 1;
    await post.save();

    res.json({ message: "Liked successfully", likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// Add a comment
const addComment = async (req, res) => {
  try {
    const { user, text } = req.body;
    const place = await CampingExperience.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    place.comments.push({ user, text });
    await place.save();

    res.status(201).json(place.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all comments for a place
const getComments = async (req, res) => {
  try {
    const place = await CampingExperience.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(place.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch places by userId
const getPostByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find camping experiences where the userId matches
    const places = await CampingExperience.find({ userId });

    if (places.length === 0) {
      return res.status(404).json({ message: "No places found for this user." });
    }

    res.status(200).json({ places });
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { addPlace, listPlaces, placebyid, likePlace, addComment, getComments, getPostByUserId };
