const Event = require("../models/eventSchema");

const  getEvent = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getEventbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const eventTicket = await Event.findById(id);

    if (!eventTicket) {
      return res.status(404).json({ message: 'event not found' });
    }

    res.json(eventTicket);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new glamping site
const  addEvent = async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path); 
    console.info("imagrurl", imageUrls );
     // Get image URLs from Cloudinary
    const { name, description, location, date, time, organizer, ticketType, price, category, totalTickets, availableTickets, instagramLink, youtubeLink, organizerUID, organizerPhone } = req.body;
    const newEvent = new Event({ name, description, location, date, time, organizer, ticketType, price, category, totalTickets, availableTickets,  instagramLink, youtubeLink, organizerUID, organizerPhone, images: imageUrls, });
    console.info("newEvent", newEvent )
    await newEvent.save();
    res.status(201).json({ message: "Event Upload successful" });
  } catch (error) {
    res.status(500).json({ message: "Error adding event" });
  }
};

// Delete a glamping site
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: " event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
};

const  verifiyEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventverify = await Event.findById(eventId);

    if (!eventverify) {
      return res.status(404).json({ message: 'event not found' });
    }

    eventverify.isverified = true;
    await eventverify.save();

    res.json({ message: 'event verified', eventverify });
  } catch (error) {
    console.error('Error verifinf event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCategories = (req, res) => {
  try {
    const categories = Event.schema.path("category").enumValues;
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getEvent, addEvent, deleteEvent, getEventbyid, verifiyEvent, getCategories  };

