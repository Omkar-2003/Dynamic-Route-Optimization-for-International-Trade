
const express=require('express');
app=express();
const sdk = require('api')('@searoutes-docs/v2.0#336s9hc37lnvvag61');
const { Vonage } = require('@vonage/server-sdk');


// Import the Twilio module
const twilio = require('twilio');

// Replace these variables with your own values from your Twilio account
const accountSid = '';
const authToken = '';
const twilioPhoneNumber = '' ;
const recipientPhoneNumber = ''; // Replace with the recipient's phone number


var unirest = require("unirest");

const vonage = new Vonage({
  apiKey: "",
  apiSecret: ""
});

var pdf = require("pdf-creator-node");
var fs = require("fs");

// Read HTML Template
var html = fs.readFileSync("template.html", "utf8");

const data = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  email: 'john.doe@example.com'
};

// Options for PDF generation
const options = {
  format: 'A4',
  orientation: 'portrait',
  border: '10mm'
};

app.get('/', async (req, res) => {
    try {
        // Assuming you have to wait for SDK response
        await sdk.auth('');
        const data = await sdk.getSeaRoute({
            continuousCoordinates: 'true',
            allowIceAreas: 'false',
            avoidHRA: 'false',
            avoidSeca: 'false',
            coordinates: '72.838757,18.934647;-58.373220,-34.609030'
        });
        console.log(data);
        // Send data in the response
        // res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error'); // Send appropriate error response
    }
});


app.get('/sms',async(req,res)=>{


var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

req.query({
  "authorization": "v3VCgYE9eb4IwfasMUBq5TykXS2cmGFN0ZP8ROKr1iujQd6JWp7A6xlLdt4SKIDBgmT2vw1yV0iMnoXb",
  "message": "This is a test message",
  "language": "english",
  "route": "q",
  "numbers": "8369055953",
});

req.headers({
  "cache-control": "no-cache"
});


req.end(function (res) {
    
  if (res.error) console.log(res.error);

  console.log(res.body);
});

})

app.get('/sendtext',async(req,res)=>{
  try {
    const client = new twilio(accountSid, authToken);

    // Send an SMS message
    client.messages
      .create({
        body: 'Hello from Northstar 3.O!', // Message text
        from: twilioPhoneNumber, // Your Twilio phone number
        to: recipientPhoneNumber, // Recipient's phone number
      })
      .then((message) => {
        console.log('Message sent successfully:', message.sid);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
      res.status(500).json({"message":'Message sent successfully'});

  }catch(err){
    res.status(500).json({"error":err});
  }

});


app.listen(5500,function(){
    console.log('server has started at port 5000');
});

