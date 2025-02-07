const Place = require('../models/sitePlace');

// Add a new place
const addPlace = async (req, res) => {
  try {
      const imageUrls = req.files.map(file => file.path);  // Get image URLs from Cloudinary
    const newPlace = new Place({
      name: req.body.name,
      description: req.body.description,
      images: imageUrls,
      approved: false,  // Initially not approved
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
    if (mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid place ID' });
    }
    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(place);
  } catch (error) {
    console.error('Error fetching place:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Like a place
const likePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    place.likes += 1;
    await place.save();
    res.json({ message: 'Liked successfully', likes: place.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Comment on a place
const commentOnPlace = async (req, res) => {
  try {
    const { user, text } = req.body;
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    place.comments.push({ user, text });
    await place.save();
    res.json({ message: 'Comment added successfully', comments: place.comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// List approved places
const listPlaces = async (req, res) => {
  try {
    const places = await Place.find({ approved: true });
    res.status(200).json({places});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching places' });
  }
};

module.exports = { addPlace, listPlaces,  likePlace, commentOnPlace, placebyid };
