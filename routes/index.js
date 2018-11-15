const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Hello, Henry. What can I do for you today?" });
});

module.exports = router;
