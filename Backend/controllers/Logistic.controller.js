const Logistics = require("../models/logistic.js");
const Vehicle = require("../models/vehicle.js");
const Warehouse = require("../models/warehouse.js");

const addJourney = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      description,
      weight,
      volume,
      sourceLocation,

      finalDestination,
      currentStatus = "pending", // Default to "pending"

      consignee,
      consignor,
      warehouse,

    } = req.body;

    // Create a new logistics entry object using the provided schema
    const logisticsData = {
      description,
      weight,
      volume,
      sourceLocation,
      finalDestination,
      currentStatus,
      consignee,
      consignor,
      warehouse,
    };

    // Create a new Logistics instance
    const newLogistics = new Logistics(logisticsData);

    // Save the new logistics entry to the database
    await newLogistics.save();

    // Return a success response with the new logistics data
    res.status(201).json(newLogistics);
  } catch (error) {
    // Handle any errors that occur during the creation process
    console.error("Error creating new logistics:", error);
    res.status(500).json({ error: "Error creating new logistics" });
  }
};

// Controller function to fetch shipments at a warehouse handled by the current user
const getShipmentsAtWarehouse = async (req, res) => {
  try {
    // Get the current user's ID from the request (assuming it's set in req.user)
    const warehouseHandlerId = req.params.id;

    console.log(warehouseHandlerId);

    // Find all warehouses managed by the current user
    const warehouses = await Warehouse.find({
      warehouseHandler: warehouseHandlerId,
    });

    if (!warehouses || warehouses.length === 0) {
      return res
        .status(404)
        .json({ message: "No warehouses found for the current user" });
    }

    // Extract warehouse IDs from the list of warehouses
    const warehouseIds = warehouses.map((warehouse) => warehouse._id);

    // Fetch shipments associated with the identified warehouse IDs
    const shipments = await Logistics.find({
      warehouse: { $in: warehouseIds },
    }).populate("sourceLocation destinationLocation consignee consignor");

    // Return the shipments in the response
    res.json(shipments);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateLogistic = async (req, res) => {
  try {
    // Extract data from the request body
    const { logisticId, destinationWarehouse, selectedVehicle, journeyType } = req.body;
    console.log(req.body);

    // Find the logistic entry by ID
    const logistic = await Logistics.findById(logisticId);
    if (!logistic) {
      return res.status(404).json({ error: "Logistic entry not found" });
    }

    // Update the finalDestination field with the destination warehouse ID
    logistic.destinationLocation = destinationWarehouse;

    // Update the journey with the new dispatch information
    logistic.journey.push({
      warehouse: destinationWarehouse,
      status: 'pending',
      departureDate: new Date(),
      arrivalDate: null,
    });

    logistic.journeyType = journeyType;

    // Update the source warehouse
    // logistics.sourceLocation = warehouseId;

    // Add the selected vehicle ID to the logistic's vehicle array
    // logistics.vehicle.push(selectedVehicleId);

    // Save the updated logistics shipment
    // await logistics.save();

    // Add the selected vehicle ID to the vehicle array
    logistic.vehicle.push(selectedVehicle);

    logistic.currentStatus = "in transit";

    // Save the updated logistic entry
    const newLogistic = await logistic.save();

    // Send a success response
    console.log(newLogistic)
    res
      .status(200)
      .json({ message: "Logistic updated successfully", logistic });
  } catch (error) {
    // Handle errors and send an error response
    console.error("Error updating logistic:", error);
    res.status(500).json({ error: "Failed to update logistic" });
  }
};


const deliverShipment = async (req, res) => {

  const { logisticsId, selectedVehicleId } = req.body;

  try {
    // Find the logistics shipment by ID
    const logistics = await Logistics.findById(logisticsId);

    if (!logistics) {
      return res.status(404).json({ error: 'Logistics shipment not found' });
    }

    // Find the specific journey segment where the warehouse matches the given warehouse ID
    const journeySegment = logistics.journey.find(segment => segment.warehouse.toString() === logistics.destinationLocation);

    if (!journeySegment) {
      return res.status(404).json({ error: 'Journey segment not found' });
    }

    // Update the journey segment with the delivered status and arrival date
    journeySegment.status = 'delivered';
    journeySegment.arrivalDate = new Date();

    // Update the current status of the logistics shipment
    logistics.currentStatus = 'pending';
    logistics.arrivalDate = new Date();

    // Remove the vehicle ID from the vehicle array when shipment is delivered
    logistics.vehicle = logistics.vehicle.filter(
      (vehicleId) => vehicleId.toString() !== selectedVehicleId
    );

    // Save the updated logistics shipment
    await logistics.save();

    res.status(200).json({ message: 'Shipment delivered successfully', data: logistics.journey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLogisticsForDriver = async (req, res) => {
  try {
    // Retrieve the current user's ID from the request object
    const userId = req.params.id;

    // Find the vehicles assigned to the current user
    const vehicles = await Vehicle.find({ assignedDriver: userId });

    if (!vehicles || vehicles.length === 0) {
      return res
        .status(404)
        .json({ message: "No vehicles assigned to the current user." });
    }

    // Extract vehicle IDs from the vehicles found
    const vehicleIds = vehicles.map((vehicle) => vehicle._id);

    // Find the logistics associated with the vehicle IDs
    const logistics = await Logistics.find({
      vehicle: { $in: vehicleIds },
    }).populate("sourceLocation destinationLocation");

    if (!logistics || logistics.length === 0) {
      return res
        .status(404)
        .json({ message: "No logistics found for the assigned vehicles." });
    }

    // Return the logistics details to the client
    res.status(200).json({ logistics });
  } catch (error) {
    console.error("Error fetching logistics for driver:", error);
    res.status(500).json({ error: "Failed to fetch logistics for driver" });
  }
};
module.exports = {
  addJourney,
  getShipmentsAtWarehouse,
  updateLogistic,
  getLogisticsForDriver,
  deliverShipment
};
