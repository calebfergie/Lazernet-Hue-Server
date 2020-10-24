const express = require("express");
const router = express.Router();
const hueRL = "http://192.168.0.10/api/srcynzPBOFaHySxbldPzZgDjQBDwyXBdMMy1DTpd/sensors/10";

const v3 = require('node-hue-api').v3
  , discovery = v3.discovery
  , hueApi = v3.api
;

const LightState = v3.lightStates.LightState;

const USERNAME = '-kMVkteI-VJ2C8zI3fRzoqB4guO7KHBfFnc-n8Lf'
  // The name of the light we wish to retrieve by name
  , COLOR_GLOBE = 3
;

// const appName = 'node-hue-api';
// const deviceName = 'example-code';

// async function discoverBridge() {
//   const discoveryResults = await discovery.nupnpSearch();
//
//   if (discoveryResults.length === 0) {
//     console.error('Failed to resolve any Hue Bridges');
//     return null;
//   } else {
//     // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
//     return discoveryResults[0].ipaddress;
//   }
// }
//
// async function discoverAndCreateUser() {
//   const ipAddress = await discoverBridge();
//
//   // Create an unauthenticated instance of the Hue API so that we can create a new user
//   const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect();
//
//   let createdUser;
//   try {
//     createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);
//     console.log('*******************************************************************************\n');
//     console.log('User has been created on the Hue Bridge. The following username can be used to\n' +
//                 'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
//                 'YOU SHOULD TREAT THIS LIKE A PASSWORD\n');
//     console.log(`Hue Bridge User: ${createdUser.username}`);
//     console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
//     console.log('*******************************************************************************\n');
//
//     // Create a new API instance that is authenticated with the new user we created
//     const authenticatedApi = await hueApi.createLocal(ipAddress).connect(createdUser.username);
//
//     // Do something with the authenticated user/api
//     const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
//     console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);
//
//   } catch(err) {
//     if (err.getHueErrorType() === 101) {
//       console.error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
//     } else {
//       console.error(`Unexpected Error: ${err.message}`);
//     }
//   }
// }
//
// // Invoke the discovery and create user code
// discoverAndCreateUser();

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
  // try something quick here - get within a get
});

router.get("/globe/on", (req, res) => {
  console.log("request to turn globe on");
  v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      const state = new LightState()
        .on()
        .ct(200)
        .brightness(100)
      ;

      return api.lights.setLightState(COLOR_GLOBE, state);
    })
    .then(result => {
      console.log(`Light state change was successful? ${result}`);
      res.send({response: `Light state change was successful? ${result}`}).status(200);
      // try something quick here - get within a get
    })
  ;
});

router.get("/globe/off", (req, res) => {
  console.log("request to turn globe on");
  v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      const state = new LightState()
        .off()
        .ct(200)
        .brightness(0)
      ;

      return api.lights.setLightState(COLOR_GLOBE, state);
    })
    .then(result => {
      console.log(`Light state change was successful? ${result}`);
      // res.send({response: `Light state change was successful? ${result}`}).status(200);
      // try something quick here - get within a get
    })
  ;
});

router.get("/temp", (req, res) => {
  console.log("where we at");
  res.send({ response: "Temp goes here" }).status(200);
  // try something quick here - get within a get
});


module.exports = router;
