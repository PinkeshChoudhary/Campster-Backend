const mongoose = require("mongoose");

const glampingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  typeOfStay: { 
    type: String,
    enum: ['Resort', 'Tent & Camp', 'Villa', 'Cafes',],
    required: true },
  location: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  images: [{ type: String, required: true }], // Store Cloudinary URLs
  amenities: {
    wifi: Boolean,
    pool: Boolean,
    bbq: Boolean,
    parking: Boolean,
    hotWater: Boolean,
    privateBathroom: Boolean,
    outdoorShower: Boolean,
    airConditioner: Boolean,
    heater: Boolean,
    kitchenAccess: Boolean,
    breakfastIncluded: Boolean,
    mountainView: Boolean,
    lakeView: Boolean,
    hammock: Boolean,
    boardGames: Boolean,
    bikeRental: Boolean,
    miniFridge: Boolean,
    chargingPorts: Boolean,
    mosquitoNet: Boolean,
    yogaDeck: Boolean,
    firePit: Boolean,
    swing: Boolean,
    firstAidKit: Boolean,
    campfireCooking: Boolean,
  },
  permissions: {
    pets: Boolean,
    music: Boolean,
    bonfire: Boolean,
    open24hrs: Boolean,
  },
});

module.exports = mongoose.model("GlampingSite", glampingSchema);
