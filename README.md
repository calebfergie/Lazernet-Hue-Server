#Lazernet Hue Server

## The LOCAL machine required to pull data from the Hue network hub
by calebfergie

### "Architecture"
Hue Bridge < (local) > <s>THIS CODE</s> < (web) > MongoDB <> Lazernet Hue Frontend

## What does it do?
This express app polls the Hue Bridge on the local network to get information about the lights and sensors in the house.

Made possible by Peter Murray's Node Hue API package 'npm i node-hue-api`
https://github.com/peter-murray/node-hue-api)

It  essentially dials up the Hue Bridge by contacting `192.168.0.XX` asking for information.

Then, the devices' information is uploaded to MongoDB.

I followed this guide to a tee: https://zellwk.com/blog/crud-express-mongodb/

### Key Packages

nodemon is a lifesaver. `npm install` a clone of this to use with `npm run dev`

Once you're ready to deploy or share  your code, you're GONNA WANT SOME `dotenv`
https://medium.com/@pdx.lucasm/dotenv-nodemon-a380629e8bff
https://stackoverflow.com/questions/42335016/dotenv-file-is-not-loading-environment-variables

Finally, added a cron job so the machine running this app can just be on autopilot
https://www.geeksforgeeks.org/how-to-run-cron-jobs-in-node-js/

### Next Up
- Information on more devices
  - Light Levels & Humidity
  - Lights
- Control unterface on Localhost
- Two way connection with mongodb
- Move from CRUD to REST. Peter Murray api is REST. Just expose it!
- Convert programming to be executed on Arduino/Pi (not laptop)

## Related Links
- Tom Igoe stuff, duh! https://github.com/tigoe/hue-control
- https://www.calebfergie.com/portfolio#/budget-nest/
- https://blog.calebfergie.com/2018/02/07/hacking-the-hue-api-interface/
- https://blog.calebfergie.com/2018/02/27/cxd-thermo/
