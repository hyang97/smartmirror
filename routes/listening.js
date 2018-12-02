const express = require("express");
const router = express.Router();

/* GET calendar */
router.get("/", (req, res, next) => {
  res.render("listening", {});
});

module.exports = router;
