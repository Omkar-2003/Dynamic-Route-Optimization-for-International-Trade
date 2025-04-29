const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

// Define the logistics schema
const logisticsSchema = new Schema(
  {
    shipmentID: {
      type: String,
      default: uuidv4(),
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: false,
    },
    sourceLocation: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    destinationLocation: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      // required: true,
    },
    finalDestination: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse"
    },
    currentStatus: {
      type: String,
      enum: ["pending", "in transit", "delivered", "cancelled"],
      default: "pending",
    },
    vehicle: {
      type: [Schema.Types.ObjectId],
      ref: "Vehicle",
      // required: true,
    },
    consignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    consignor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: false,
    },
    departureDate: {
      type: Date,
      required: false,
    },
    arrivalDate: {
      type: Date,
      required: false,
    },
    trackingDetails: {
      type: [{
        status: String,
        timestamp: Date,
        location: {
          latitude: Number,
          longitude: Number,
        },
        warehouse: {
          type: Schema.Types.ObjectId,
          ref: 'Warehouse',
        },
      }],
      required: false,
      default: [],
    },
    journeyType: {
      type: String,
      required: false
    },
    // Define multiple warehouses for the journey
    journey: {
      type: [{
        warehouse: {
          type: Schema.Types.ObjectId,
          ref: 'Warehouse',
        },
        status: String,
        arrivalDate: Date,
        departureDate: Date,
      }],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create the Logistics model
const Logistics = mongoose.model("Logistics", logisticsSchema);

module.exports = Logistics;
