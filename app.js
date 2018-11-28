const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const WebSocketServer = require("ws").Server;

const indexRouter = require("./routes/index");
const calendarRouter = require("./routes/calendar");
const weatherRouter = require("./routes/weather");

const app = express();

const smartMirror = require("./middleware/smartMirror");
const SOCKET_PORT = 40510;

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
const wss = new WebSocketServer({ port: SOCKET_PORT });
wss.on("connection", function(ws) {
  ws.on("message", function(message) {
    console.log("received: %s", message);
  });
});

module.exports = app;
