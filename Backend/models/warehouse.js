const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

// Define the warehouse schema
const warehouseSchema = new Schema({
  warehouseID: {
    type: String,
    default: uuidv4(),
    required: true,
  },
  warehouseName: {
    type: String,
    required: true,
    trim: true,
  },
  warehouseHandler: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["airport", "seaport", "road_side"],
    required: true,
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  capacity: {
    total: {
      type: Number,
    },
    available: {
      type: Number,
    },
  },
  facilities: {
    cooling: {
      type: Boolean,
      default: false,
    },
    heating: {
      type: Boolean,
      default: false,
    },
    security: {
      type: Boolean,
      default: true,
    },
  },
  contact: {
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Warehouse model
const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;
