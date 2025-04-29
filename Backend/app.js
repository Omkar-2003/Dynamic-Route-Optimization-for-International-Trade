require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/') // Specify the directory where files should be uploaded
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname) // Use the original filename for uploaded files
//   }
// });

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
  .connect("mongodb+srv://omkar:OMKAR@cluster0.duiwp6o.mongodb.net/NorthStar", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


  // app.post('/file', upload.single('data'), async (req, res) => {
  //   try {
  //     console.log(req.file); // This will log information about the uploaded file
  //     console.log(req.body.data); // This will log the value of the 'data' field in form-data
  //     res.status(200).json('success');
  //   } catch (err) {
  //     res.status(500).json('err: ' + err);
  //   }
  // });

app.use("/api", databaseapi);
app.use("/api", routesapi);
app.use("/api", authapi);
app.use("/api/add", addEntity);
app.use("/api", SeaandAirRoute);

app.listen(4000, function () {
  console.log("server has strted at port 4000");
});
