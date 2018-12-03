const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const WebSocketServer = require("ws").Server;

const indexRouter = require("./routes/index");
const calendarRouter = require("./routes/calendar");
const weatherRouter = require("./routes/weather");
const listeningRouter = require("./routes/listening");
const navRouter = require("./routes/nav");
const { spawn } = require("child_process");

const app = express();

const { WEB_SOCKET_PORT, KEYWORDS } = require("./config");

// Start Google assistant stuff
const child = spawn("python3", [
  "/home/pi/AIY-projects-python/src/examples/voice/test_library.py"
]);

console.log("spawned assistant");

child.on("error", err => {
  console.log("Failed to spawn process");
});

child.on("close", code => {
  console.log("Process exited with code " + code);
});

child.stdout.on("data", async function(chunk) {
  let textChunk = chunk.toString("utf-8"); //buffer to string
  textChunk = textChunk.toLowerCase();
  console.log(textChunk);
  
  for (let i = 0; i < KEYWORDS.length; i++) {
    // Send first encountered keyword
    const word = KEYWORDS[i].page;
    if (textChunk.includes(word)) {
      if (ws_client) {
        ws_client.send(word);
      }
      break;
    }
    else {
      const words = KEYWORDS[i].keywords;
      for (let j = 0; j < words.length; j++)  {
        const word2 = words[j];
        if (textChunk.includes(word2)) {
          if (ws_client) {
            ws_client.send(word);
          }
          break;
        }
      }
    }
  }
});

// Set up server
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up web socket connection. We have a single client at any point which is just the most recently requested connection
const wss = new WebSocketServer({ port: WEB_SOCKET_PORT });
let ws_client;
wss.on("connection", function(ws) {
  // Close current connection
  if (ws_client) {
    ws_client.terminate();
  }
  ws_client = ws;
  ws.on("message", function(message) {
    console.log("received: %s", message);
  });
});

app.use("/", indexRouter);
app.use("/nav", navRouter);
app.use("/calendar", calendarRouter);
app.use("/listening", listeningRouter);
app.use("/weather", weatherRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
