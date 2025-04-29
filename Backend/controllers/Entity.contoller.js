const Vehicle = require("../models/vehicle.js"); // Assuming your model is in a separate file
const Warehouse = require("../models/warehouse.js");

const addVehicle = async (req, res) => {
  // try {
  //   const newVehicle = new Vehicle({
  //     vehicleType: req.body.vehicleType,
  //     capacity: req.body.capacity,
  //     currentLocation: {
  //       latitude: req.body.latitude,
  //       longitude: req.body.longitude,
  //     },
  //     status: req.body.status,
  //     assignedDriver: req.body.driver, // Assuming you have a user with this ObjectId
  //   });

  //   newVehicle
  //     .save()
  //     .then((vehicle) => {
  //       console.log("Vehicle added successfully:", vehicle);
  //     })
  //     .catch((error) => {
  //       console.error("Error adding vehicle:", error);
  //     });
  // } catch (err) {
  //   res.status(500).json({ message: "Vehicle has been added successfully" });
  // }
  try {
    const {
      vehicleType,
      capacity,
      currentLocation: { latitude, longitude },
      status = "active", // Default to "active" if not provided
      assignedDriver,
    } = req.body;

    // Create a new vehicle object using the provided schema
    const vehicleData = {
      vehicleType,
      capacity,
      currentLocation: {
        latitude,
        longitude,
      },
      status,
      assignedDriver, // Reference to the assigned driver (User ObjectId)
    };

    // Create a new Vehicle instance
    const newVehicle = new Vehicle(vehicleData);

    // Save the new vehicle to the database
    await newVehicle.save();

    // Return a success response with the new vehicle data
    res.status(201).json(newVehicle);
  } catch (error) {
    // Handle any errors that occur during the creation process
    console.error("Error creating new vehicle:", error);
    res.status(500).json({ error: "Error creating new vehicle" });
  }
};

const addWarehouse = async (req, res) => {
  // try {
  //   // const newWarehouse = new Warehouse({
  //   //   warehouseName: req.body.name,
  //   //   warehouseHandler: req.body.handler,
  //   //   type: req.body.type,
  //   //   coordinates: {
  //   //     latitude: req.body.latitude,
  //   //     longitude: req.body.longitude,
  //   //   },
  //   //   capacity: {
  //   //     total: req.body.longitude,
  //   //     available: req.body.longitude,
  //   //   },
  //   //   facilities: {
  //   //     cooling: req.body.cooling,
  //   //     heating: req.body.heating,
  //   //     security: req.body.security,
  //   //   },
  //   //   contact: {
  //   //     phoneNumber: req.body.phoneNumber,
  //   //     email: req.body.email,
  //   //   },
  //   // });

  //   // // Save the new warehouse to the database
  //   // await newWarehouse
  //   //   .save()
  //   //   .then((warehouse) => {
  //   //     console.log("Warehouse added successfully:", warehouse);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error adding warehouse:", error);
  //   //   });

  // } catch (err) {
  //   res.status(500).json({ message: "Warehouse has been added successfully" });
  // }

  try {
    // Extract data from the request body
    const {
      name,
      handler,
      type,
      latitude,
      longitude,
      totalCapacity,
      availableCapacity,
      cooling,
      heating,
      security,
      phoneNumber,
      email,
    } = req.body;

    // Create a new warehouse object
    const warehouseData = {
      warehouseName: name,
      warehouseHandler: handler,
      type: type,
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
      capacity: {
        total: totalCapacity,
        available: availableCapacity,
      },
      facilities: {
        cooling: cooling,
        heating: heating,
        security: security,
      },
      contact: {
        phoneNumber: phoneNumber,
        email: email,
      },
    };

    // Create a new Warehouse instance
    const newWarehouse = new Warehouse(warehouseData);

    // Save the new warehouse to the database
    await newWarehouse.save();

    // Return a success response with the new warehouse data
    res.status(201).json(newWarehouse);
  } catch (error) {
    // Handle any errors that occur during the creation process
    console.error("Error creating new warehouse:", error);
    res.status(500).json({ error: "Error creating new warehouse" });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicleId);

    // Check if the vehicle exists
    if (!vehicle) {
      console.log("Vehicle not found");
    }

    await vehicle.remove();
    console.log("Vehicle deleted successfully:", vehicle);
  } catch (error) {
    console.error("Error deleting vehicle:", error);
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.body.WarehouseId);

    // Check if the vehicle exists
    if (!warehouse) {
      console.log("warehouse not found");
    }

    await vehicle.remove();
    console.log("warehouse deleted successfully:", warehouse);
  } catch (error) {
    console.error("Error deleting warehouse:", error);
  }
};

// Get all warehouses
const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({});
    res.status(200).json(warehouses);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all available vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: "active" });
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addVehicle,
  addWarehouse,
  deleteWarehouse,
  deleteVehicle,
  getWarehouses,
  getVehicles,
};
