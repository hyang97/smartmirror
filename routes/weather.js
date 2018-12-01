const express = require("express");
const router = express.Router();
const iplocation = require("iplocation").default;
const publicIP = require("public-ip");
const request = require("request");

// Put this in an ENV file later.. or not at all lmao
const API_KEY = "5de0956332b3fe9c5acd614b069e03e1";

/* GET weather */
router.get("/", (req, res, next) => {
  publicIP.v4().then(ip => {
    iplocation(ip, [], (error, loc) => {
      const { city } = loc;
      const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${API_KEY}`;
      request(url, (err, response, data) => {
        if (err) {
          res.render("error", { message: err });
        } else {
          res.render("weather", { weatherData: JSON.parse(data), city });
        }
      });
    });
    /* res:
          {
              as: 'AS11286 KeyBank National Association',
              city: 'Cleveland',
              country: 'United States',
              countryCode: 'US',
              isp: 'KeyBank National Association',
              lat: 41.4875,
              lon: -81.6724,
              org: 'KeyBank National Association',
              query: '156.77.54.32',
              region: 'OH',
              regionName: 'Ohio',
              status: 'success',
              timezone: 'America/New_York',
              zip: '44115'
          }
      */
  });
});

module.exports = router;
