const { default: mongoose } = require("mongoose");
const Booking = require("../models/bookingSchema");
const Tent = require("../models/TentSchema");
const axios = require("axios");

let io; // Store Socket.io instance

// Function to set Socket.io instance
const setSocket = (socketIoInstance) => {
  io = socketIoInstance;
};

// Rent multiple tents
const rentTent = async (req, res) => {
  const { userPhone, userId, tentId, fromDate, toDate, quantity } = req.body;

  try {
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    
    if (!mongoose.Types.ObjectId.isValid(tentId)) {
      return res.status(400).json({ error: "Invalid Tent ID" });
    }

    const tent = await Tent.findById(tentId);
    if (!tent) return res.status(404).json({ error: "Tent not found" });

    const overlappingBookings = tent.availability.reduce((count, booking) => {
      if (new Date(fromDate) < booking.toDate && new Date(toDate) > booking.fromDate) {
        return count + (booking.quantity || 1);
      }
      return count;
    }, 0);

    const availableTents = tent.quantity - overlappingBookings;
    if (quantity > availableTents) {
      return res.status(400).json({ error: "Not enough tents available for selected dates" });
    }


    const booking = new Booking({ userPhone, userId, tentId, fromDate, toDate, quantity });
    await booking.save();

    tent.availability.push({ fromDate, toDate });
    await tent.save();

    // Emit real-time notification to admins
    if (io) {
      io.emit("bookingNotification", {
        message: `New booking: ${quantity} tent(s) rented`,
        userId,
        tentId,
        fromDate,
        toDate,
      });
    }
    //     // Send notification to admin
    //     await axios.post("http://localhost:5000/api/admin/notify", JSON.stringify({
    //       message: "New tent booking",
    //   }), { headers: { "Content-Type": "application/json" } });
    res.json({ message: `Successfully booked ${quantity} tent(s)`, booking });

  } catch (error) {
    console.error("Error booking tent(s):", error);
    res.status(500).json({ error: "Error booking tent(s)" });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const tent = await Tent.findById(booking.tentId);
    if (!tent) return res.status(404).json({ error: "Tent not found" });

    tent.availability = tent.availability.filter(avail =>
      !(avail.fromDate.getTime() === booking.fromDate.getTime() &&
        avail.toDate.getTime() === booking.toDate.getTime())
    );

    await tent.save();

    booking.status = "Cancelled";
    await booking.save();

    if (io) {
      io.emit("bookingNotification", {
        message: `Booking cancelled: ${booking.quantity} tent(s)`,
        userId: booking.userId,
        tentId: booking.tentId,
      });
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Error cancelling booking" });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate("tentId");
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Error fetching bookings" });
  }
};

module.exports = { rentTent, cancelBooking, getUserBookings, setSocket };
