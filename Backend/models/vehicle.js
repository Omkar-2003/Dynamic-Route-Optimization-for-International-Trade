const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

// Define the vehicle schema
const vehicleSchema = new Schema(
  {
    vehicleID: {
      type: String,
      default: uuidv4(),
      required: true,
    },
    vehicleType: {
      type: String,
      enum: [
        "truck",
        "van",
        "container",
        "trailer",
        "cargo_ship",
        "cargo_plane",
      ],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    currentLocation: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
    assignedDriver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Vehicle model
const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
