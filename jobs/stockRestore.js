const cron = require("node-cron");
const mongoose = require("mongoose");
const Tent = require("../models/tentSchema");
const Booking = require("../models/bookingSchema");

cron.schedule("*/20 * * * * *", async () => { // Runs every hour
    try {
        console.log("Checking and removing expired availability...");

        const now = new Date();

        // Find all bookings that have expired
        const expiredBookings = await Booking.find({ 
            toDate: { $lt: now },
           
        });
        // console.info("expiring booking", expiredBookings )
        for (let booking of expiredBookings) {
            // Find the tent associated with the booking
            const tent = await Tent.findById(booking.tentId);
            if (!tent) continue;

            // Remove the expired availability entry
            await Tent.updateOne(
                { _id: tent._id },
                { 
                    $pull: { availability: { toDate: { $lt: now } } },
                }
            );

            // Update booking status to "completed"
            await Booking.updateOne({ _id: booking._id }, { status: "completed" });
        }

        console.log("Expired availability removed and quantity updated.");
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});
