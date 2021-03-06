const mongoose = require("mongoose");

// define properties of cars collection

const carsSchema = mongoose.Schema({
  brand: {
    type: String,
    minLength: [2, "brand too short"],
    maxLength: [60, "brand too long"],
    required: [true, "brand required"],
  },
  model: {
    type: String,
    minLength: [2, "model too short"],
    maxLength: [60, "model too long"],
    required: [true, "model required"],
  },
  colour: {
    type: String,
    minLength: [2, "colour too short"],
    maxLength: [60, "colour too long"],
    required: [true, "colour required"],
  },
  sold: {
    type: Boolean,
    default: false,
  },
  dealership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "dealership",
    required: [true, "dealership require"],
  },
});

const car = mongoose.model("car", carsSchema);
module.exports = car;
