const express = require("express");
const router = express.Router();
const {rentTent, cancelBooking, getUserBookings } = require("../controllers/bookingControllers.js");

// Rent a tent
router.post("/rent", rentTent);

// Cancel a booking
router.patch("/cancel/:bookingId", cancelBooking);

// Route to get user's bookings
router.get("/my-bookings/:userId", getUserBookings);

module.exports = router;
