const Tent = require("../models/TentSchema.js");

// Get available tents with correct quantity calculation
const getAvailableTents = async (req, res) => {
  const { fromDate, toDate, size, color, quantity = 1 } = req.query; // Default quantity to 1 if not provided

  try {
    // Convert dates to Date objects
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    // Find all tents that match size & color
    let tents = await Tent.find({ size, color });

    // Filter available tents
    let availableTents = tents.filter((tent) => {
      // Sum up the booked quantity for the given date range
      let bookedQuantity = tent.availability.reduce((count, booking) => {
        const bookingStart = new Date(booking.fromDate);
        const bookingEnd = new Date(booking.toDate);

        // Check for overlapping dates
        if (start < bookingEnd && end > bookingStart) {
          return count + (booking.quantity || 1);
        }
        return count;
      }, 0);

      // Calculate remaining tents
      let remainingQuantity = tent.quantity - bookedQuantity;

      // Tent is available only if the requested quantity can be fulfilled
      return remainingQuantity >= quantity;
    });

    res.json(availableTents);
  } catch (error) {
    console.error("Error fetching available tents:", error);
    res.status(500).json({ error: "Error fetching available tents" });
  }
};

module.exports = { getAvailableTents };
