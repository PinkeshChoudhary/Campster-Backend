const GlampingSite = require("../models/glampingSite");

// Get all glamping sites
const  getGlampingSites = async (req, res) => {
  try {
    const sites = await GlampingSite.find();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const glampingsitebyid = async (req, res) => {
  try {
    const { id } = req.params;
    const glamping = await GlampingSite.findById(id);

    if (!glamping) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(glamping);
  } catch (error) {
    console.error('Error fetching place:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new glamping site
const  addGlampingSite = async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path);  // Get image URLs from Cloudinary
    const { name, description, location, pricePerNight, amenities } = req.body;
    const newSite = new GlampingSite({ name, description, location, pricePerNight, amenities, images: imageUrls, });
    await newSite.save();
    res.status(201).json({ message: "Glamping site added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding site" });
  }
};

// Delete a glamping site
const deleteGlampingSite = async (req, res) => {
  try {
    await GlampingSite.findByIdAndDelete(req.params.id);
    res.json({ message: "Glamping site deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting site" });
  }
};

module.exports = { getGlampingSites, addGlampingSite, deleteGlampingSite, glampingsitebyid,  };

