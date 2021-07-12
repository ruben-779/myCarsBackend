const mongoose = require("mongoose");

// define properties of dealerships collection;

const dealershipsSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [2, "name too short"],
    maxLength: [60, "name too long"],
  },
  address: {
    street: {
      type: String,
      required: [true, "street required"],
    },
    city: {
      type: String,
      required: [true, "city required"],
    },
    zipcode: {
      type: String,
      required: [true, "zipcode required"],
    },
  },
});

const dealership = mongoose.model("dealership", dealershipsSchema);
module.exports = dealership;
