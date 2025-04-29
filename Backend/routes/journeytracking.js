const express = require("express");
const router = require("express").Router();
const multer = require('multer');

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../uploads/'); // Set the destination folder where uploaded files will be stored
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); // Set the file name to the original name of the uploaded file
  }
});

const upload = multer({ storage: storage });


const { FindSearoute } = require("../controllers/SeaAir.controller.js");
router.route("/sea_routes").post(FindSearoute);
// const { addJourney } = require('../controllers/Logistic.contoller.js');

const {getRoutes}  = require('../controllers/Routes.controller.js');
    const {PdfCreator}  = require('../controllers/Createpdf.controller.js');
const {Sendsms,dummy}  = require('../controllers/Realtimeupdate.controller.js');

// router.route('/routejourney').post(addJosea_routesurney);
router.route('/get_routes').post(getRoutes);
router.route('/pdf_creator').post(PdfCreator);
router.route('/send_message').post(Sendsms);
router.route('/check').post(dummy);

module.exports = router;
