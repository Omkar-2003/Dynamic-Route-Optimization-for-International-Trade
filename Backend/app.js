require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');


const upload = multer();

const app = express();
const mongoose = require("mongoose");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const databaseapi = require("./routes/datasetapi");
const routesapi = require("./routes/optmizedroutes");
const authapi = require("./routes/authentication.routes.js");
const addEntity = require("./routes/entry.js");
const SeaandAirRoute = require("./routes/journeytracking.js");

mongoose
  .connect("", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


app.use("/api", databaseapi);
app.use("/api", routesapi);
app.use("/api", authapi);
app.use("/api/add", addEntity);
app.use("/api", SeaandAirRoute);

app.listen(4000, function () {
  console.log("server has strted at port 4000");
});
