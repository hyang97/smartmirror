const express = require("express");
const router = express.Router();
const geoip = require("geoip-lite");
const publicIP = require("public-ip");
const request = require("request");

// Put this in an ENV file later.. or not at all lmao
const API_KEY = "5de0956332b3fe9c5acd614b069e03e1";

/* GET weather */
router.get("/", (req, res, next) => {
  publicIP.v4().then(ip => {
    const city = geoip.lookup(ip).city;
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${API_KEY}`;
    request(url, (err, response, data) => {
      if (err) {
        res.render("error", { message: err });
      } else {
        res.render("weather", { weatherData: JSON.parse(data), city });
        console.log(JSON.parse(data).list[0]);
      }
    });
  });
});

module.exports = router;
