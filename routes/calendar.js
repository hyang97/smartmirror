const express = require("express");
const router = express.Router();
const { spawn } = require('child_process')

/* GET calendar */
router.get("/", (req, res, next) => {
  res.render("calendar", {});

  const child = spawn('python3', ['scripts/test.py']);

  child.stdout.on('data', async function(chunk){
  	let textChunk = chunk.toString('utf-8'); //buffer to string
  	console.log(textChunk)
  })
});

module.exports = router;