const router = require("express").Router();

const {
  getWarehouses,
  getVehicles,
} = require("../controllers/Entity.contoller.js");
const {
  getLogisticsForDriver,
} = require("../controllers/Logistic.controller.js");
const { getRoutes } = require("../controllers/Routes.controller.js");

// router.route('/routejourney').post(addJourney);
router.route("/get_routes").post(getRoutes);

// logistics
router.route("/warehouses").get(getWarehouses);
router.route("/vehicles").get(getVehicles);

router.route("/logistics/:id").get(getLogisticsForDriver);

module.exports = router;
