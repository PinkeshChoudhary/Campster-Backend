const Tent = require("../models/TentSchema.js");

// Get available tents with correct quantity calculation
const getAvailableTents = async (req, res) => {
  const { fromDate, toDate, size, color, quantity } = req.query;

  try {
    // Find all tents matching size & color
    let tents = await Tent.find({ size, color });

    // Filter tents based on remaining available quantity
    let availableTents = tents.filter((tent) => {
      // Calculate booked quantity for the given date range
      let bookedQuantity = tent.availability.reduce((count, booking) => {
        if (new Date(fromDate) < booking.toDate && new Date(toDate) > booking.fromDate) {
          return count + (booking.quantity || 1);
        }
        return count;
      }, 0);

      // Check if the requested quantity can be fulfilled
      let remainingQuantity = tent.quantity - bookedQuantity;
      return remainingQuantity >= quantity; // Tent is available if enough quantity remains
    });

    res.json(availableTents);
  } catch (error) {
    console.error("Error fetching available tents:", error);
    res.status(500).json({ error: "Error fetching available tents" });
  }
};

module.exports = { getAvailableTents };
