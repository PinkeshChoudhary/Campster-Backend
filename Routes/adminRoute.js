const express = require('express');
const router = express.Router();
const { approvePlace, getPendingPlaces, rejectPlace, getAllBookings } = require('../controllers/admincontrollers');
const webpush = require("../config/webPushConfig");

let adminSubscription = null; // Store subscription



// Route to get all unapproved places
router.get('/pending-places', getPendingPlaces);

// Route to approve a place
router.post('/approve-place/:id', approvePlace);

// Route to reject (delete) a place
router.delete('/reject-place/:id',  rejectPlace);

 // Admin fetch all bookings
 router.get("/allbookings", getAllBookings);

// Save the admin's subscription when they log in
router.post("/subscribe", (req, res) => {
    adminSubscription = req.body;
    res.json({ message: "Admin subscribed to notifications!" });
});

// Send a notification to the admin
router.post("/notify", async (req, res) => {
    console.info()
    if (!adminSubscription) {
        return res.status(400).json({ error: "Admin is not subscribed!" });
    }

    const payload = JSON.stringify({
        title: "New Booking!",
        body: "A new tent booking has been made.",
    });
    try {
        await webpush.sendNotification(adminSubscription, payload);
        res.json({ message: "Notification sent to admin!" });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: "Failed to send notification" });
    }
});

module.exports = router;