const router = require('express').Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { parse } = require("csv-parse");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path")

//geopolitical news api constraints
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
  

  // Function to append data to CSV file
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
  
  

  router.post("/finaldataset", async (req, res) => {
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

      var trafficCoordinates=[];

      if( data.routes[0].geometry.coordinates<=10){

        trafficCoordinates=data.routes[0].geometry.coordinates;

      }else{
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
  
        var Src_Latitude = data.routes[0].geometry.coordinates[0][1];
        var Src_Longitude = data.routes[0].geometry.coordinates[0][0];
    
        var Waypoint_1_Lat = data.routes[0].geometry.coordinates[1][1];
        var Waypoint_1_Lon = data.routes[0].geometry.coordinates[1][0];
        var Waypoint_2_Lat = data.routes[0].geometry.coordinates[2][1];
        var Waypoint_2_Lon = data.routes[0].geometry.coordinates[2][0];
        var Waypoint_3_Lat = data.routes[0].geometry.coordinates[middleFirtHalf][1];
        var Waypoint_3_Lon = data.routes[0].geometry.coordinates[middleFirtHalf][0];
        var Waypoint_4_Lat = data.routes[0].geometry.coordinates[middleIndex][1];
        var Waypoint_4_Lon = data.routes[0].geometry.coordinates[middleIndex][0];
        var Waypoint_5_Lat = data.routes[0].geometry.coordinates[randommiddle][1];
        var Waypoint_5_Lon = data.routes[0].geometry.coordinates[randommiddle][0];
        var Waypoint_6_Lat = data.routes[0].geometry.coordinates[middleBetweenlastandmiddle][1];
        var Waypoint_6_Lon = data.routes[0].geometry.coordinates[middleBetweenlastandmiddle][0];
        var Waypoint_7_Lat = data.routes[0].geometry.coordinates[randommiddle2][1];
        var Waypoint_7_Lon = data.routes[0].geometry.coordinates[randommiddle2][0];
        var Waypoint_8_Lat =data.routes[0].geometry.coordinates[lastCoordinateIndex - 2][1];
        var Waypoint_8_Lon =data.routes[0].geometry.coordinates[lastCoordinateIndex - 2][0];
        var Waypoint_9_Lat =data.routes[0].geometry.coordinates[lastCoordinateIndex - 1][1];
        var Waypoint_9_Lon =data.routes[0].geometry.coordinates[lastCoordinateIndex - 1][0];
  
        var Dest_Latitude = data.routes[0].geometry.coordinates[lastCoordinateIndex][1];
        var Dest_Longitude = data.routes[0].geometry.coordinates[lastCoordinateIndex][0];
    
  
           trafficCoordinates = [
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
  
      }

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
        FRC5: 2, // Balanced importance for local roads of high importance
        FRC6: 1,
      };
      let totalImportance = route1_roadConditions.reduce(
        (acc, code) => acc + importanceMap[code],
        0
      );
      let averageImportance = totalImportance / route1_roadConditions.length;
  
      // Assign road condition rating based on thresholds
    
      let geopolitical_route1= await geopoliticalConstraint(trafficCoordinates);
       geopolitical_route1= parseInt(geopolitical_route1);
  
        // Calculate traffic condition rating based on the percentage of true values in trafficConditions
       
        let total = route1_trafficConditions.reduce((acc, curr) => acc + curr, 0);
  
        // Calculate the total count of numbers in the array
        let count = route1_trafficConditions.length;
        
        // Calculate the average and round to two decimal places
        let average1 = (total / count).toFixed(2);
        console.log("totalTraffic : " + average1 );
        // console.log('roadConditionRating: '+ route1_roadConditionRating);


        const dataAttributes_OneRoute = {
          route1_distance: data.routes[0].distance,
          route1_duration: data.routes[0].duration,
          route1_Road_Type: averageImportance,
          route1_Traffic: average1,
          route1_Road_Confidence: route1_averageConfidence,
          route1_Geopolitical_Constraints:geopolitical_route1,
        };


        const structuredata={
          coordinates:trafficCoordinates,
          dataAttributes:dataAttributes_OneRoute
        }
  
       if (data.routes.length === 1) {
        if(data.routes[0].geometry.coordinates<=10){
           return res.status(200).json({ message: "One Route Exists", data:structuredata  });
        }else{
          return res.status(200).json({ message: "Final coordinates", data:structuredata });
        }
      }
  
  
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
      
     var  averageImportance2 = totalImportance / route2_roadConditions.length;
      console.log('averageImportance2:' + averageImportance2 );
  
      let total2 = route2_trafficConditions.reduce((acc, curr) => acc + curr, 0);
  
      // Calculate the total count of numbers in the array
      let count2 = route2_trafficConditions.length;
      
      // Calculate the average and round to two decimal places
      let average2 = (total2 / count2).toFixed(2);
      console.log("totalTraffic2 : " + average2 );
  
      // console.log('roadConditionRating: '+ route2_roadConditionRating);
      // let geopolitical_route1= await geopoliticalConstraint(trafficCoordinates);
      let geopolitical_route2=await geopoliticalConstraint(trafficCoordinates2);
      // geopolitical_route1= parseInt(geopolitical_route1);
      geopolitical_route2= parseInt(geopolitical_route2);
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
        route1_Road_Type: averageImportance,
        route1_Traffic: average1,
        route1_Road_Confidence: route1_averageConfidence,
        route1_Geopolitical_Constraints:geopolitical_route1,
        route2_distance: data.routes[1].distance,
        route2_duration: data.routes[1].duration,
        route2_Road_Type: averageImportance2,
        route2_Traffic: average2,
        route2_Road_Confidence:  route2_averageConfidence,
        route2_Geopolitical_Constraints: geopolitical_route2,
      };
  
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
  


module.exports=router;