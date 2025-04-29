const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { parse } = require("csv-parse");
const cors = require("cors");
const app = express();
const axios = require("axios");
const fs = require("fs");
const path = require("path")
app.use(cors());
app.use(bodyParser.json());

const geopoliticalConstraint = async (coordinates) => {
  try {
    const genAI = new GoogleGenerativeAI(
      ""
    );

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `These are the route coordinates: ${coordinates}. Is there any geopolitical constraint along this route, such as war or strike? Please provide your answer as a boolean value (0 for no, 1 for yes).`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (err) {
    console.log(err);
  }
};

//Geocoding API 

app.get("/location/:latitude/:longitude", async (req, res) => {
  try {
    const { latitude, longitude } = req.params;

    // Call Google Maps Geocoding API
    const apiKey = "";
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "OK") {
      // Extract the formatted address from the response
      const address = data.results[0].formatted_address;
      res.json({ address });
    } else {
      res.status(500).json({ error: "Geocoding API request failed" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//Gemini API => Geopolitical Constraints 


app.get("/prompt", async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(
      ""
    );
    //long lat
    const route1Coordinates = [
      [73.136518, 19.239625],
      [73.136465, 19.242239],

      [73.100536, 19.251538], //=> middleFirtHalf

      [73.060487, 19.253776], //=>randommiddleFirtHalf

      [73.032119, 19.232686], //middle

      [72.977057, 19.203371], // ==> middle between last and middle last

      [72.970225, 19.193381], // => middleBetweenlastmiddleand last
      [72.970207, 19.192897],
      [72.970457, 19.194264],
    ];
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `These are the route coordinates: ${route1Coordinates}. Is there any geopolitical constraint along this route, such as war or strike? Please provide your answer as a boolean value (0 for no, 1 for yes).`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    res.status(200).json({ mesaage: text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
});



app.get("/verify", async (req, res) => {
  try {
    const coordinatesArray = [
      [73.136518, 19.239625],
      [73.136465, 19.242239],
      [73.100536, 19.251538],
      [73.060487, 19.253776],
      [73.032119, 19.232686],
      [72.977057, 19.203371],
      [72.970225, 19.193381],
      [72.970207, 19.192897],
      [72.970457, 19.194264],
    ];

    console.log("coordinates:" + coordinatesArray);
    res.status(200).json({ coordinates: coordinatesArray });
  } catch (err) {
    res.status(500).json(err);
  }
});

const fetchTrafficData = async (coordinates) => {
  try {
    const apiKey = ""; // Replace this with your TomTom API key
    const apiUrl =
      "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json";
    const roadConditions = [];
    const trafficConditions = [];
    const confidences = [];

    // Make API requests for each coordinate pair
    for (const coordinate of coordinates) {
      const [longitude, latitude] = coordinate;
      const response = await axios.get(apiUrl, {
        params: {
          key: apiKey,
          point: `${latitude},${longitude}`,
        },
      });

      // Extract confidence level from the response
      const roadCondition = response.data.flowSegmentData.frc;
      const trafficCondition = response.data.flowSegmentData.roadClosure;
      const confidence = response.data.flowSegmentData.confidence;

      roadConditions.push(roadCondition);
      trafficConditions.push(trafficCondition);
      confidences.push(confidence);
    }

    // Calculate average confidence level
    const averageConfidence =
      confidences.reduce((acc, curr) => acc + curr, 0) / confidences.length;

    // Calculate average importance
    const importanceMap = {
      FRC0: 5,
      FRC1: 4,
      FRC2: 3,
      FRC3: 2,
      FRC4: 1,
      FRC5: 2, // Balanced importance for local roads of high importance
      FRC6: 1,
    };
    const totalImportance = roadConditions.reduce(
      (acc, code) => acc + importanceMap[code],
      0
    );
    const averageImportance = totalImportance / roadConditions.length;

    // Assign road condition rating based on thresholds
    let roadConditionRating;
    if (averageImportance >= 0.75) {
      roadConditionRating = "Good";
    } else if (averageImportance >= 0.25) {
      roadConditionRating = "Medium";
    } else {
      roadConditionRating = "Bad";
    }

    // Calculate traffic condition rating based on the percentage of true values in trafficConditions
    let totalTrue = trafficConditions.reduce(
      (acc, currentValue) => acc + (currentValue ? 1 : 0),
      0
    );
    totalTrue = totalTrue / trafficConditions.length;
    let trafficConditionRating;
    if (totalTrue >= 0.75) {
      trafficConditionRating = "Good";
    } else if (totalTrue >= 0.25) {
      trafficConditionRating = "Medium";
    } else {
      trafficConditionRating = "Bad";
    }

    // Return the computed data
    return {
      averageConfidence,
      roadConditionRating,
      trafficConditionRating,
    };
  } catch (error) {
    console.log(error);
    // Handle error cases (e.g. return default values or rethrow error)
    return {
      averageConfidence: null,
      roadConditionRating: null,
      trafficConditionRating: null,
    };
  }
};

app.post("/finaldataset22", async (req, res) => {
  try {
    const origin = req.body.origin;
    const destination = req.body.destination;
    console.log(req.body);
    const apiKey =
      "";

    console.log(origin, destination);
    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=true&geometries=geojson&language=en&access_token=${apiKey}`;
    const response = await axios.get(apiUrl);
    // Axios automatically parses response data to JSON, so no need for response.json()
    const data = response.data;

    console.log(data);

    const route1Coordinates = data.routes[0].geometry.coordinates;
    const lastCoordinateIndex = route1Coordinates.length - 1;
    const middleIndex = Math.floor(route1Coordinates.length / 2);
    const middleFirtHalf = (1 + middleIndex) / 2;
    const randommiddle = Math.floor(
      Math.random() * (middleIndex - middleFirtHalf) + middleFirtHalf
    );
    const middleToLastIndex = Math.floor(
      (middleIndex + lastCoordinateIndex) / 2
    );
    const middleBetweenlastandmiddle = Math.floor(
      (middleToLastIndex + lastCoordinateIndex) / 2
    );
    const randommiddle2 = Math.floor(
      Math.random() * (lastCoordinateIndex - middleBetweenlastandmiddle) +
        middleBetweenlastandmiddle
    );

    console.log("lastCoordinateIndex: " + lastCoordinateIndex);
    console.log("middleIndex : ", middleIndex);
    console.log("middleFirtHalf : ", middleFirtHalf);
    console.log("randommiddle : ", randommiddle);
    console.log("middleToLastIndex : ", middleToLastIndex);
    console.log("middleBetweenlastandmiddle : ", middleBetweenlastandmiddle);
   
    res.status(200).json({ "Data success": lastCoordinateIndex });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
});

function appendDataToCSV(dataAttributes, csvFilePath) {
  // Convert dataAttributes object keys to CSV header (comma-separated string)
  const headers = Object.keys(dataAttributes).join(',');

  // Convert dataAttributes object values to CSV row (comma-separated string)
  const values = Object.values(dataAttributes).map(value => {
      // Escape values containing quotes or commas
      let stringValue = value.toString().replace(/"/g, '""');
      if (stringValue.includes(',') || stringValue.includes('"')) {
          stringValue = `"${stringValue}"`;
      }
      return stringValue;
  }).join(',');

  // Prepare the CSV line to be appended (values only, since header might already exist)
  const csvLine = `${values}\n`;

  // Check if the CSV file exists
  if (!fs.existsSync(csvFilePath)) {
      // If file does not exist, create a new file and write the header followed by the values
      fs.writeFileSync(csvFilePath, `${headers}\n${csvLine}`, 'utf8');
  } else {
      // If file exists, append the values to the file
      fs.appendFileSync(csvFilePath, csvLine, 'utf8');
  }

  console.log('Data appended to CSV file successfully.');
}


app.post("/finaldataset", async (req, res) => {
  try {
    const origin = req.body.origin;
    const destination = req.body.destination;
    console.log(req.body);
    const apiKey =
      "";

    console.log(origin, destination);
    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=true&geometries=geojson&language=en&access_token=${apiKey}`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    const route1Coordinates = data.routes[0].geometry.coordinates;
    const lastCoordinateIndex = route1Coordinates.length - 1;
    const middleIndex = Math.floor(route1Coordinates.length / 2);
    const middleFirtHalf =Math.floor( (middleIndex) / 2);
    const randommiddle = Math.floor(
      Math.random() * (middleIndex - middleFirtHalf) + middleFirtHalf
    );
    const middleToLastIndex = Math.floor(
      (middleIndex + lastCoordinateIndex) / 2
    );
    const middleBetweenlastandmiddle = Math.floor(
      (middleToLastIndex + lastCoordinateIndex) / 2
    );
    const randommiddle2 = Math.floor(
      Math.random() * (lastCoordinateIndex - middleBetweenlastandmiddle) +
        middleBetweenlastandmiddle
    );

    const route2Coordinates = data.routes[1].geometry.coordinates;
    const lastCoordinateIndex_2 = route2Coordinates.length - 1;
    const middleIndex_2 = Math.floor(route2Coordinates.length / 2);
    const middleFirtHalf_2 = Math.floor( (middleIndex_2) / 2);;
    const randommiddle_2 = Math.floor(
      Math.random() * (middleIndex_2 - middleFirtHalf_2) + middleFirtHalf_2
    );
    const middleToLastIndex_2 = Math.floor(
      (middleIndex_2 + lastCoordinateIndex_2) / 2
    );
    const middleBetweenlastandmiddle_2 = Math.floor(
      (middleToLastIndex_2 + lastCoordinateIndex_2) / 2
    );
    const randommiddle2_2 = Math.floor(
      Math.random() * (lastCoordinateIndex_2 - middleBetweenlastandmiddle_2) +
        middleBetweenlastandmiddle_2
    );

    const Src_Latitude = data.routes[0].geometry.coordinates[0][1];
    const Src_Longitude = data.routes[0].geometry.coordinates[0][0];

    const Waypoint_1_Lat = data.routes[0].geometry.coordinates[1][1];
    const Waypoint_1_Lon = data.routes[0].geometry.coordinates[1][0];
    const Waypoint_2_Lat = data.routes[0].geometry.coordinates[2][1];
    const Waypoint_2_Lon = data.routes[0].geometry.coordinates[2][0];
    const Waypoint_3_Lat =
      data.routes[0].geometry.coordinates[middleFirtHalf][1];
    const Waypoint_3_Lon =
      data.routes[0].geometry.coordinates[middleFirtHalf][0];
    const Waypoint_4_Lat = data.routes[0].geometry.coordinates[middleIndex][1];
    const Waypoint_4_Lon = data.routes[0].geometry.coordinates[middleIndex][0];
    const Waypoint_5_Lat = data.routes[0].geometry.coordinates[randommiddle][1];
    const Waypoint_5_Lon = data.routes[0].geometry.coordinates[randommiddle][0];
    const Waypoint_6_Lat =
      data.routes[0].geometry.coordinates[middleBetweenlastandmiddle][1];
    const Waypoint_6_Lon =
      data.routes[0].geometry.coordinates[middleBetweenlastandmiddle][0];
    const Waypoint_7_Lat =
      data.routes[0].geometry.coordinates[randommiddle2][1];
    const Waypoint_7_Lon =
      data.routes[0].geometry.coordinates[randommiddle2][0];
    const Waypoint_8_Lat =
      data.routes[0].geometry.coordinates[lastCoordinateIndex - 2][1];
    const Waypoint_8_Lon =
      data.routes[0].geometry.coordinates[lastCoordinateIndex - 2][0];
    const Waypoint_9_Lat =
      data.routes[0].geometry.coordinates[lastCoordinateIndex - 1][1];
    const Waypoint_9_Lon =
      data.routes[0].geometry.coordinates[lastCoordinateIndex - 1][0];

    const route_2_Waypoint_1_Lat = data.routes[1].geometry.coordinates[1][1];
    const route_2_Waypoint_1_Lon = data.routes[1].geometry.coordinates[1][0];
    const route_2_Waypoint_2_Lat = data.routes[1].geometry.coordinates[2][1];
    const route_2_Waypoint_2_Lon = data.routes[1].geometry.coordinates[2][0];
    const route_2_Waypoint_3_Lat =
      data.routes[1].geometry.coordinates[middleFirtHalf_2][1];
    const route_2_Waypoint_3_Lon =
      data.routes[1].geometry.coordinates[middleFirtHalf_2][0];
    const route_2_Waypoint_4_Lat =
      data.routes[1].geometry.coordinates[middleIndex_2][1];
    const route_2_Waypoint_4_Lon =
      data.routes[1].geometry.coordinates[middleIndex_2][0];
    const route_2_Waypoint_5_Lat =
      data.routes[1].geometry.coordinates[randommiddle_2][1];
    const route_2_Waypoint_5_Lon =
      data.routes[1].geometry.coordinates[randommiddle_2][0];
    const route_2_Waypoint_6_Lat =
      data.routes[1].geometry.coordinates[middleBetweenlastandmiddle_2][1];
    const route_2_Waypoint_6_Lon =
      data.routes[1].geometry.coordinates[middleBetweenlastandmiddle_2][0];
    const route_2_Waypoint_7_Lat =
      data.routes[1].geometry.coordinates[randommiddle2_2][1];
    const route_2_Waypoint_7_Lon =
      data.routes[1].geometry.coordinates[randommiddle2_2][0];
    const route_2_Waypoint_8_Lat =
      data.routes[1].geometry.coordinates[lastCoordinateIndex_2 - 2][1];
    const route_2_Waypoint_8_Lon =
      data.routes[1].geometry.coordinates[lastCoordinateIndex_2 - 2][0];
    const route_2_Waypoint_9_Lat =
      data.routes[1].geometry.coordinates[lastCoordinateIndex_2 - 1][1];
    const route_2_Waypoint_9_Lon =
      data.routes[1].geometry.coordinates[lastCoordinateIndex_2 - 1][0];

    const Dest_Latitude =
      data.routes[0].geometry.coordinates[lastCoordinateIndex][1];
    const Dest_Longitude =
      data.routes[0].geometry.coordinates[lastCoordinateIndex][0];

    const coordinates = [];
    const coordinates2 = [];

    coordinates.push([Src_Latitude, Src_Longitude]);
    coordinates.push([Waypoint_1_Lat, Waypoint_1_Lon]);
    coordinates.push([Waypoint_2_Lat, Waypoint_2_Lon]);
    coordinates.push([Waypoint_3_Lat, Waypoint_3_Lon]);
    coordinates.push([Waypoint_4_Lat, Waypoint_4_Lon]);
    coordinates.push([Waypoint_5_Lat, Waypoint_5_Lon]);
    coordinates.push([Waypoint_6_Lat, Waypoint_6_Lon]);
    coordinates.push([Waypoint_7_Lat, Waypoint_7_Lon]);
    coordinates.push([Waypoint_8_Lat, Waypoint_8_Lon]);
    coordinates.push([Waypoint_9_Lat, Waypoint_9_Lon]);
    coordinates.push([Dest_Latitude, Dest_Longitude]);

    const trafficCoordinates = [
        [Src_Longitude, Src_Latitude],
        [Waypoint_1_Lon, Waypoint_1_Lat],
        [Waypoint_2_Lon, Waypoint_2_Lat],
        [Waypoint_3_Lon, Waypoint_3_Lat],
        [Waypoint_4_Lon, Waypoint_4_Lat],
        [Waypoint_5_Lon, Waypoint_5_Lat],
        [Waypoint_6_Lon, Waypoint_6_Lat],
        [Waypoint_7_Lon, Waypoint_7_Lat],
        [Waypoint_8_Lon, Waypoint_8_Lat],
        [Waypoint_9_Lon, Waypoint_9_Lat],
        [Dest_Longitude, Dest_Latitude]
    ]

    const trafficCoordinates2 = [
      [Src_Longitude, Src_Latitude],
      [route_2_Waypoint_1_Lon, route_2_Waypoint_1_Lat],
      [route_2_Waypoint_2_Lon, route_2_Waypoint_2_Lat],
      [route_2_Waypoint_3_Lon, route_2_Waypoint_3_Lat],
      [route_2_Waypoint_4_Lon, route_2_Waypoint_4_Lat],
      [route_2_Waypoint_5_Lon, route_2_Waypoint_5_Lat],
      [route_2_Waypoint_6_Lon, route_2_Waypoint_6_Lat],
      [route_2_Waypoint_7_Lon, route_2_Waypoint_7_Lat],
      [route_2_Waypoint_8_Lon, route_2_Waypoint_8_Lat],
      [route_2_Waypoint_9_Lon, route_2_Waypoint_9_Lat],
      [Dest_Longitude, Dest_Latitude]
  ]
  

    // console.log('coordinates:'+ coordinatesArray);

    const apiKey2 = ""; // Replace this with your TomTom API key
    const apiUrl2 =
      "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json";
    
    const route1_roadConditions = [];
    const route1_trafficConditions = [];
    const route1_confidences = [];

    for (const coordinate of trafficCoordinates) {
      const [longitude, latitude] = coordinate;
      const response = await axios.get(apiUrl2, {
        params: {
          key: apiKey2,
          point: `${latitude},${longitude}`,
        },
      });

      // Extract confidence level from the response
      const roadCondition = response.data.flowSegmentData.frc;
      const trafficCondition = response.data.flowSegmentData.roadClosure;
      const confidence = response.data.flowSegmentData.confidence;
      const freeflow=response.data.flowSegmentData.freeFlowSpeed;
      const currentSpeed=response.data.flowSegmentData.currentSpeed;
      const trafic_per_road=((freeflow-currentSpeed)/freeflow) * 100;

      route1_roadConditions.push(roadCondition);
      route1_trafficConditions.push(trafic_per_road);
      route1_confidences.push(confidence);
    }

    console.log(route1_trafficConditions);
    // Calculate average confidence level
    const route1_averageConfidence =
    route1_confidences.reduce((acc, curr) => acc + curr, 0) / route1_confidences.length;

    // Calculate average importance
    const importanceMap = {
      FRC0: 5,
      FRC1: 4,
      FRC2: 3,
      FRC3: 2,
      FRC4: 1,
      FRC5: 2, 
      FRC6: 1,
    };
    let totalImportance = route1_roadConditions.reduce(
      (acc, code) => acc + importanceMap[code],
      0
    );
    let averageImportance = totalImportance / route1_roadConditions.length;

    let route1_roadConditionRating;
    console.log('averageImportance:' + averageImportance );
    if (averageImportance >= 0.75) {
      route1_roadConditionRating = "Good";
    } else if (averageImportance >= 0.25) {
      route1_roadConditionRating = "Medium";
    } else {
      route1_roadConditionRating = "Bad";
    }


      let total = route1_trafficConditions.reduce((acc, curr) => acc + curr, 0);

      // Calculate the total count of numbers in the array
      let count = route1_trafficConditions.length;
      

      let average1 = (total / count).toFixed(2);
  
      

    const route2_roadConditions = [];
    const route2_trafficConditions = [];
    const route2_confidences = [];

    for (const coordinate of trafficCoordinates2) {
      const [longitude, latitude] = coordinate;
      const response = await axios.get(apiUrl2, {
        params: {
          key: apiKey2,
          point: `${latitude},${longitude}`,
        },
      });

      // Extract confidence level from the response
      const roadCondition = response.data.flowSegmentData.frc;
      const trafficCondition = response.data.flowSegmentData.roadClosure;
      const confidence = response.data.flowSegmentData.confidence;
      const freeflow=response.data.flowSegmentData.freeFlowSpeed;
      const currentSpeed=response.data.flowSegmentData.currentSpeed;
      const trafic_per_road=((freeflow-currentSpeed)/freeflow) * 100;

      route2_roadConditions.push(roadCondition);
      route2_trafficConditions.push(trafic_per_road);
      route2_confidences.push(confidence);
    }
    console.log(route2_trafficConditions);
    // Calculate average confidence level
    const route2_averageConfidence =
    route2_confidences.reduce((acc, curr) => acc + curr, 0) / route2_confidences.length;

    totalImportance = route2_roadConditions.reduce(
      (acc, code) => acc + importanceMap[code],
      0
    );
    
    averageImportance = totalImportance / route2_roadConditions.length;
    averageImportance2 = totalImportance / route2_roadConditions.length;

    // Assign road condition rating based on thresholds
    let route2_roadConditionRating;
    if (averageImportance >= 0.75) {
      route2_roadConditionRating = "Good";
    } else if (averageImportance >= 0.25) {
      route2_roadConditionRating = "Medium";
    } else {
      route2_roadConditionRating = "Bad";
    }

    console.log('averageImportance2:' + averageImportance2 );

    let total2 = route2_trafficConditions.reduce((acc, curr) => acc + curr, 0);

    // Calculate the total count of numbers in the array
    let count2 = route2_trafficConditions.length;
    
    // Calculate the average and round to two decimal places
    let average2 = (total2 / count2).toFixed(2);
    console.log("totalTraffic2 : " + average2 );

    console.log('roadConditionRating: '+ route2_roadConditionRating);
    let geopolitical_route1= await geopoliticalConstraint(trafficCoordinates);
    let geopolitical_route2=await geopoliticalConstraint(trafficCoordinates2);
    geopolitical_route1= parseInt(geopolitical_route1);
    geopolitical_route2= parseInt(geopolitical_route2);
    console.log(geopolitical_route1);
    console.log(geopolitical_route2);

    const dataAttributes = {
      Src_Latitude: Src_Latitude,
      Src_Longitude: Src_Longitude,
      route_1_Waypoint_1_Lat: Waypoint_1_Lat,
      route_1_Waypoint_1_Lon: Waypoint_1_Lon,
      route_1_Waypoint_2_Lat: Waypoint_2_Lat,
      route_1_Waypoint_2_Lon: Waypoint_2_Lon,
      route_1_Waypoint_3_Lat: Waypoint_3_Lat,
      route_1_Waypoint_3_Lon: Waypoint_3_Lon,
      route_1_Waypoint_4_Lat: Waypoint_4_Lat,
      route_1_Waypoint_4_Lon: Waypoint_4_Lon,
      route_1_Waypoint_5_Lat: Waypoint_5_Lat,
      route_1_Waypoint_5_Lon: Waypoint_5_Lon,
      route_1_Waypoint_6_Lat: Waypoint_6_Lat,
      route_1_Waypoint_6_Lon: Waypoint_6_Lon,
      route_1_Waypoint_7_Lat: Waypoint_7_Lat,
      route_1_Waypoint_7_Lon: Waypoint_7_Lon,
      route_1_Waypoint_8_Lat: Waypoint_8_Lat,
      route_1_Waypoint_8_Lon: Waypoint_8_Lon,
      route_1_Waypoint_9_Lat: Waypoint_9_Lat,
      route_1_Waypoint_9_Lon: Waypoint_9_Lon,
      route_2_Waypoint_1_Lat: route_2_Waypoint_1_Lat,
      route_2_Waypoint_1_Lon: route_2_Waypoint_1_Lon,
      route_2_Waypoint_2_Lat: route_2_Waypoint_2_Lat,
      route_2_Waypoint_2_Lon: route_2_Waypoint_2_Lon,
      route_2_Waypoint_3_Lat: route_2_Waypoint_3_Lat,
      route_2_Waypoint_3_Lon: route_2_Waypoint_3_Lon,
      route_2_Waypoint_4_Lat: route_2_Waypoint_4_Lat,
      route_2_Waypoint_4_Lon: route_2_Waypoint_4_Lon,
      route_2_Waypoint_5_Lat: route_2_Waypoint_5_Lat,
      route_2_Waypoint_5_Lon: route_2_Waypoint_5_Lon,
      route_2_Waypoint_6_Lat: route_2_Waypoint_6_Lat,
      route_2_Waypoint_6_Lon: route_2_Waypoint_6_Lon,
      route_2_Waypoint_7_Lat: route_2_Waypoint_7_Lat,
      route_2_Waypoint_7_Lon: route_2_Waypoint_7_Lon,
      route_2_Waypoint_8_Lat: route_2_Waypoint_8_Lat,
      route_2_Waypoint_8_Lon: route_2_Waypoint_8_Lon,
      route_2_Waypoint_9_Lat: route_2_Waypoint_9_Lat,
      route_2_Waypoint_9_Lon: route_2_Waypoint_9_Lon,
      Dest_Latitude: Dest_Latitude,
      Dest_Longitude: Dest_Longitude,
      route1_distance: data.routes[0].distance,
      route1_duration: data.routes[0].duration,
      route1_Road_Type: route1_roadConditionRating,
      route1_Traffic: average1,
      route1_Road_Confidence: route1_averageConfidence,
      route1_Geopolitical_Constraints:geopolitical_route1,
      route2_distance: data.routes[1].distance,
      route2_duration: data.routes[1].duration,
      route2_Road_Type: route2_roadConditionRating,
      route2_Traffic: average2,
      route2_Road_Confidence:  route2_averageConfidence,
      route2_Geopolitical_Constraints: geopolitical_route2,
    };

  //  await appendToCSV(dataAttributes);
// Specify the path to the CSV file where data will be appended
    const csvFilePath = path.join(__dirname, 'data.csv');

    // Call the function to append dataAttributes to the CSV file
    appendDataToCSV(dataAttributes, csvFilePath);


    res.status(200).json({ message: "data added sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
});



app.get("/", async (req, res) => {
  res.status(200).json({ mesaage: "Working properly" });
});

app.get("/prompt", async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyAZRoPOt2AQAp4dh1vWP1Dc-BON9YmhDSc"
    );
    //long lat
    const route1Coordinates = [
      [73.136518, 19.239625],
      [73.136465, 19.242239],

      [73.100536, 19.251538], //=> middleFirtHalf

      [73.060487, 19.253776], //=>randommiddleFirtHalf

      [73.032119, 19.232686], //middle

      [72.977057, 19.203371], // ==> middle between last and middle last

      [72.970225, 19.193381], // => middleBetweenlastmiddleand last
      [72.970207, 19.192897],
      [72.970457, 19.194264],
    ];
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `These are the route coordinates: ${route1Coordinates}. Is there any geopolitical constraint along this route, such as war or strike? Please provide your answer as a boolean value (0 for no, 1 for yes).`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    res.status(200).json({ mesaage: text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
});

// Function to append data to CSV file
async function appendToCSV(data) {
  try {
    // Read existing CSV file content
    const existingData = await fs.promises.readFile("data.csv", "utf8");

    // Parse existing CSV content if any
    let records = [];
    if (existingData) {
      records = await new Promise((resolve, reject) => {
        parse(existingData, { columns: true }, (err, output) => {
          if (err) reject(err);
          resolve(output);
        });
      });
    }

    // Append new data to existing records
    records.push(...data);

    // Convert records back to CSV format
    const csvData = records
      .map((record) => Object.values(record).join(","))
      .join("\n");

    // Write updated content back to the CSV file
    await fs.promises.writeFile("data.csv", csvData);
    console.log("Data appended to CSV file successfully");
  } catch (error) {
    console.error("Failed to append data to CSV file:", error.message);
  }
}

//TomTOM API => TRaffic API 

app.get("/trafficapi", async (req, res) => {
  try {
    const route1Coordinates = [
      [73.136518, 19.239625],
      [73.136465, 19.242239],

      [73.100536, 19.251538], //=> middleFirtHalf

      [73.060487, 19.253776], //=>randommiddleFirtHalf

      [73.032119, 19.232686], //middle

      [72.977057, 19.203371], // ==> middle between last and middle last

      [72.970225, 19.193381], // => middleBetweenlastmiddleand last
      [72.970207, 19.192897],
      [72.970457, 19.194264],
    ];
    const apiKey = ""; // Replace this with your TomTom API key
    const apiUrl =
      "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json";
    const roadconditions = [];
    const trafficconditions = [];
    const confidences = [];
    const currentspeed=[];
    const flow=[];

    // Make API requests for each coordinate pair
    for (const coordinate of route1Coordinates) {
      const [longitude, latitude] = coordinate;
      const response = await axios.get(apiUrl, {
        params: {
          key: apiKey,
          point: `${latitude},${longitude}`,
        },
      });
      // console.log(response);

      // Extract confidence level from the response
      const roadcondition = response.data.flowSegmentData.frc;
      const trafficcondition = response.data.flowSegmentData.roadClosure;
      const freeflow=response.data.flowSegmentData.freeFlowSpeed;
      const currentSpeed=response.data.flowSegmentData.currentSpeed;
      const trafic_per_road=((freeflow-currentSpeed)/freeflow) * 100;
      const confidence = response.data.flowSegmentData.confidence;
      roadconditions.push(roadcondition);
      trafficconditions.push(trafic_per_road);
      confidences.push(confidence);
      currentspeed.push(currentSpeed);
      flow.push(freeflow);
    }

    console.log("trafficconditions:" + trafficconditions);
    console.log("currentspeed:" + currentspeed);
    console.log("trafficconditions:" + flow);

    let total = trafficconditions.reduce((acc, curr) => acc + curr, 0);

    // Calculate the total count of numbers in the array
    let count = trafficconditions.length;
    
    // Calculate the average and round to two decimal places
    let average = (total / count).toFixed(2);
    console.log("totalTraffic : " + average );

    const importanceMap = {
      FRC0: 5,
      FRC1: 4,
      FRC2: 3,
      FRC3: 2,
      FRC4: 1,
      FRC5: 2, // Balanced importance for local roads of high importance
      FRC6: 1,
    };

    // Calculate average importance
    const totalImportance = roadconditions.reduce(
      (acc, code) => acc + importanceMap[code],
      0
    );
    const averageImportance = totalImportance / roadconditions.length;

    // Assign rating based on thresholds
    let rating;
    if (averageImportance >= 0.75) {
      rating = "Good";
    } else if (averageImportance >= 0.25) {
      rating = "Medium";
    } else {
      rating = "Bad";
    }

    console.log("roadconditions: " + averageImportance);

    // Calculate average confidence level
    const averageConfidence =
      confidences.reduce((acc, curr) => acc + curr, 0) / confidences.length;
    console.log("averageConfidence: " + averageConfidence);

    if (averageConfidence >= 0.75) {
      console.log("High");
    } else if (averageConfidence >= 0.5) {
      console.log("Medium");
    } else {
      console.log("Low");
    }
    console.log("averageConfidence: " + averageConfidence);

    res.status(200).json({ data: averageConfidence });
  } catch (error) {
    console.error("Error fetching traffic data:", error.message);
    return null;
  }
});

// Dummy Dataset API =>
app.post("/dataset", async (req, res) => {
  try {
    // Read the JSON file
    const apidata = fetch(
      "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/73.136648%2C19.239674%3B72.970178%2C19.194329?alternatives=true&geometries=geojson&language=en&access_token=pk.eyJ1Ijoib21paWlpIiwiYSI6ImNsZTE1OXB5eTFpZmczcXBya3gxd2p0NWQifQ.2Pajyh5I0dASbvIEJZ8O7g"
    );

    apidata
      .then((res) => res.json())
      .then((data) => {
        console.log(data.routes[0].duration);

        const responseBody = {
          route1distance: data.routes[0].distance,
          route1duration: data.routes[0].duration,
          route1coordinates: data.routes[0].geometry.coordinates,
          route1weather: "weather",
          route1traffic: "Heavy",
          route1news: "restricted",
          avg_speed: 50,
        };

       

        appendToCSV([responseBody]);

        console.log(responseBody);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        res.status(200).json("Data got success"); // Clear the timeout
      });

   

    
  } catch (err) {
    // Handle other errors
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/datasetjson", async (req, res) => {
  try {
    const route1Coordinates = [
      [73.136518, 19.239625],
      [73.136465, 19.242239],
      [73.129642, 19.243723],
      [73.126333, 19.246111],
      [73.120297, 19.2466],
      [73.114329, 19.245587],
      [73.110503, 19.245866],
      [73.100536, 19.251538], //=> middleFirtHalf
      [73.087196, 19.264196],
      [73.083521, 19.269237],
      [73.065725, 19.257817],
      [73.060487, 19.253776], //=>randommiddleFirtHalf
      [73.05086, 19.248447],
      [73.032119, 19.232686], //middle
      [73.020065, 19.224713],
      [73.003994, 19.209019],
      [72.999948, 19.208322],
      [72.982193, 19.211152],
      [72.977316, 19.211736],
      [72.977138, 19.207811],
      [72.977237, 19.207464],
      [72.977639, 19.205489],
      [72.977057, 19.203371], // ==> middle between last and middle last
      [72.972845, 19.200075],
      [72.970207, 19.192897],
      [72.970225, 19.193381], // => middleBetweenlastmiddleand last
      [72.970457, 19.194264],
    ];

    // 27

    // const lastIndex = route1Coordinates.length - 1;
    const lastCoordinateIndex = route1Coordinates.length - 1;
    const middleIndex = Math.floor(route1Coordinates.length / 2);
    const middleFirtHalf = (1 + middleIndex) / 2;
    const middleFromIndex1ToMiddle = route1Coordinates.slice(1, middleIndex);
    const randommiddle = Math.floor(
      Math.random() * (middleIndex - middleFirtHalf) + middleFirtHalf
    );

    const middleToLastIndex = Math.floor(
      (middleIndex + lastCoordinateIndex) / 2
    );

    const middleBetweenlastandmiddle = Math.floor(
      (middleToLastIndex + lastCoordinateIndex) / 2
    );
    const randommiddle2 = Math.floor(
      Math.random() * (lastCoordinateIndex - middleBetweenlastandmiddle) +
        middleBetweenlastandmiddle
    );

    // Get the coordinate at the middleBetweenIndices
    //   const middleBetweenCoordinate = route1Coordinates[middleBetweenIndices];

    const latitude_last_route_1 = route1Coordinates[lastCoordinateIndex][1];
    const longitude_last_route_1 = route1Coordinates[lastCoordinateIndex][0];

    console.log(middleIndex + " " + middleFirtHalf);

    console.log(
      "middleFirtHalf long lat,long  : " +
        route1Coordinates[middleFirtHalf][0] +
        " " +
        route1Coordinates[middleFirtHalf][1]
    );
    console.log(
      "randommiddleFirtHalf long lat,long  : " +
        route1Coordinates[randommiddle][0] +
        " " +
        route1Coordinates[randommiddle][1]
    );
    console.log(
      "middleIndex long lat,long  : " +
        route1Coordinates[middleIndex][0] +
        " " +
        route1Coordinates[middleIndex][1]
    );

    console.log(
      "middleBetweenlastandmiddle long lat,long  : " +
        route1Coordinates[middleBetweenlastandmiddle][0] +
        " " +
        route1Coordinates[middleBetweenlastandmiddle][1]
    );
    console.log(
      "middleBetweenlastmiddle and last  long lat,long  : " +
        route1Coordinates[middleToLastIndex][0] +
        " " +
        route1Coordinates[randommiddle2][1]
    );
    console.log(
      "last  of 1 and middle lat,long => " +
        latitude_last_route_1 +
        " " +
        longitude_last_route_1
    );



 
    res.status(200).json({ mesaage: "latitude_route_1" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
});

app.get("/location/:latitude/:longitude", async (req, res) => {
  try {
    const { latitude, longitude } = req.params;

    // Call Google Maps Geocoding API
    const apiKey = "";
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "OK") {
      // Extract the formatted address from the response
      const address = data.results[0].formatted_address;
      res.json({ address });
    } else {
      res.status(500).json({ error: "Geocoding API request failed" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(4000, function () {
  console.log("server has strted at port 4000");
});
