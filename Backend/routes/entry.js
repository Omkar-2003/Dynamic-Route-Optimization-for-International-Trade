const express = require("express");
const router = require("express").Router();
const {
  addVehicle,
  addWarehouse,
  deleteWarehouse,
  deleteVehicle,
} = require("../controllers/Entity.contoller.js");

const {
  addJourney,
  getShipmentsAtWarehouse,
  updateLogistic,
} = require("../controllers/Logistic.controller.js");

router.route("/vehicle").post(addVehicle);
router.route("/warehouse").post(addWarehouse);

router.route("/logistics").post(addJourney);
router.route("/logistics/:id").get(getShipmentsAtWarehouse);
router.route("/logistics").put(updateLogistic);

router.route("/deletewarehouse").post(deleteWarehouse);
router.route("/deletevehicle").post(deleteVehicle);

module.exports = router;
