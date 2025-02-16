const mongoose = require("mongoose");

const tentSchema = new mongoose.Schema({
  size: { type: String, enum: ["Small", "Medium", "Large"], required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  availability: [{ fromDate: Date, toDate: Date }],
});
module.exports = mongoose.models.Tent || mongoose.model("Tent", tentSchema);
