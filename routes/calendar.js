const express = require("express");
const router = express.Router();

/* GET calendar */
router.get("/", (req, res, next) => {
  res.render("calendar", {});
});

module.exports = router;
