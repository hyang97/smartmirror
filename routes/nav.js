const express = require("express");
const router = express.Router();

/* GET nav */
router.get("/", (req, res, next) => {
  res.render("nav", {});
});

module.exports = router;
