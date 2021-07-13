const mongoose = require("mongoose");
const randomWords = require("random-words");

// define properties of users collection

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [2, "name too short"],
    maxLength: [60, "name too long"],
  },
  email: {
    type: String,
    unique: true,
    //email validator
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@domingoalonsogroup.com/.test(v);
      },
      message: "Invalid email",
    },
    required: [true, "email required"],
  },

  role: {
    type: String,
    //only two options
    enum: ["admin", "visitante"],
    default: "visitante",
  },
  password: {
    type: String,
    required: [true, "password required"],
  },
  favouriteCars: [{ type: mongoose.Schema.Types.ObjectId, ref: "car" }],
  verify: {
    type: Boolean,
    default: false,
  },
  safeWord: {
    type: String,
    default: randomWords({ exactly: 2, join: "" }),
  },
});

const user = mongoose.model("user", usersSchema);
module.exports = user;
