const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const WebSocketServer = require("ws").Server;

const indexRouter = require("./routes/index");
const calendarRouter = require("./routes/calendar");
const weatherRouter = require("./routes/weather");
const { spawn } = require("child_process");

const app = express();

const smartMirror = require("./middleware/smartMirror");
const WEB_SOCKET_PORT = require("./config");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/$", smartMirror);
app.use("/", indexRouter);
app.use("/calendar", calendarRouter);
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

// Set up web socket connection
const wss = new WebSocketServer({ port: WEB_SOCKET_PORT });
let ws_client;
wss.on("connection", function(ws) {
  ws_client = ws;
  ws.on("message", function(message) {
    console.log("received: %s", message);
  });
});

const child = spawn("python3", [
  // "assistant/examples/voice/assistant_grpc_demo.py"
  "/home/pi/AIY-projects-python/src/examples/voice/test_grpc.py"
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
  console.log(textChunk);
  ws_client.send(textChunk);
});

module.exports = app;
