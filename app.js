const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const v3 = require('node-hue-api').v3
  , discovery = v3.discovery
  , hueApi = v3.api
;
const model = require('node-hue-api').v3.model;

const LightState = v3.lightStates.LightState;
const USERNAME = '-kMVkteI-VJ2C8zI3fRzoqB4guO7KHBfFnc-n8Lf' //need to put in env
  // The name of the light we wish to retrieve by name
  , COLOR_GLOBE = 3
  , SENSOR = 10
;

const server = http.createServer(app);

const io = socketIo(server);

let interval;
let batstatus;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("batCall", () => {
    console.log("someone pressed the bat signal button");
    });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  console.log("getting light status");
  v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Get the daylight sensor for the bridge, at id 1
          console.log(api.lights.getLight(COLOR_GLOBE));
          return api.lights.getLight(COLOR_GLOBE);
          })
    .then(result => {
      const resultstring = (`${result.toStringDetailed()}`);
      const resultjson = (`${JSON.stringify(result, null, 2)}`);
      socket.emit("batStatus", `${resultjson}`);    // globeON(socket);
})
  const response = new Date();
  const responseTemp = 8765;
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
  socket.emit("temp", responseTemp);
};

const getBatStatus = socket => {
  console.log("request to get bat status");
  v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Get the daylight sensor for the bridge, at id 1
          console.log("hell0");
          return api.lights.getLight(COLOR_GLOBE);
          })
    .then(result => {
      console.log(`${result.toStringDetailed()}`);
      socket.emit("batStatus", `${result}`);
    })
};


    const globeON = socket => {
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
        })};



server.listen(port, () => console.log(`Listening on port ${port}`));
