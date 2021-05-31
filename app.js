const express = require("express");
const bodyParser = require('body-parser');
const cron = require("node-cron");
const MongoClient = require('mongodb').MongoClient;

// dotenv baby
const dotenv = require("dotenv");
dotenv.config();

//HUE STUFF
const v3 = require('node-hue-api').v3
  , discovery = v3.discovery
  , hueApi = v3.api;

const model = require('node-hue-api').v3.model;
const LightState = v3.lightStates.LightState;
const USERNAME = process.env.HUEID //env baby
  // The name of the light we wish to retrieve by name
  , COLOR_GLOBE = 3
  , SENSOR = 10;

// future steps
// const http = require("http");
// const socketIo = require("socket.io");

const port = process.env.PORT || 4001;

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

//FIRE IT UP
updateDB();

// Creating a cron job which runs on every minute
cron.schedule("*/1 * * * *", function() {
    console.log("running a task every 1 minutes");
    updateDB();
});

//not really used rn
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

// listen baby
app.listen(port, () => console.log(`Listening on port ${port}`));

//FUNCTIONS

// convert data to Fahrenheit
function HueToFahrenheit(HueTemp){
  // Hue provides temp values in Celcius x 1000 eg 1942 = 19.4 degree celcius
  // 🇺🇸 uses F
  tempF = (HueTemp/100*(9/5))+32;
  return tempF
};

// Send Sensor Data to MongoDB
function updateDB() {
  // Connect to MongDB - using dotenv - https://medium.com/@pdx.lucasm/dotenv-nodemon-a380629e8bff + https://stackoverflow.com/questions/42335016/dotenv-file-is-not-loading-environment-variables
  MongoClient.connect("mongodb+srv://"+process.env.MONGOUN+":"+ process.env.MONGOPW + ".HIRT@huecluster0.i6cxh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
      useUnifiedTopology: true
    })
    .then(client => {
      console.log('Connected to Mongo Database')
      const db = client.db('HueData')
      const HueDataSensor1 = db.collection('HueDataSensor1')
      // app.use( /* ... */ )
      // app.get( /* ... */ )
      // app.post( /* ... */ )
      // app.listen( /* ... */ )

      //WRITE SENSOR DATA TO THE DATABASE
      v3.discovery.nupnpSearch()
        .then(searchResults => {
          const host = searchResults[0].ipaddress;
          return v3.api.createLocal(host).connect(USERNAME);
        })
        .then(api => {
          // The Hue Daylight software sensor is identified as id 1
          return api.sensors.getSensor(SENSOR);
        })
        .then(sensor => {
          // Display the details of the sensors we got back
          console.log(sensor._data.state.temperature);
          let temp = HueToFahrenheit(sensor._data.state.temperature);
          console.log(temp);
          sensor._data.state["TempF"] = temp;
          console.log(sensor._data.state)
          HueDataSensor1.insertOne(sensor._data.state)
        });

      app.post('/', (req, res) => {
        HueDataSensor1.insertOne(req.body)
          .then(result => {
            console.log("insterted into DB: " + result)
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })
    })
    .catch(error => console.error(error))
}
