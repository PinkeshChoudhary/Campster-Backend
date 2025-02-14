const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true  },
  tentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tent", required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  quantity: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Confirmed" },
});

module.exports = mongoose.model("Booking", bookingSchema);
