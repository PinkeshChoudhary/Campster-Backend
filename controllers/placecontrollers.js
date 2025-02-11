const CampingExperience = require('../models/sitePlace');

// Add a new place
const addPlace = async (req, res) => {
  try {
      const imageUrls = req.files.map(file => file.path);  // Get image URLs from Cloudinary
      console.info("images", imageUrls)
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
    });
    console.info("newExperience", newExperience);
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

module.exports = { addPlace, listPlaces, placebyid };
