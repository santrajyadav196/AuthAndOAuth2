require("dotenv").config();
require("./config/db").connectDB();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
// var cookieParser = require("cookie-parser");
var logger = require("morgan");
// var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var bodyParser = require("body-parser");

// import router
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");

var app = express();

// app.use(bodyParser.urlencoded());

// app.use(bodyParser.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session-config

// const sessionConfig = {
//   name: "noone knows dude!!!",
//   secret: "This is secret!!",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//   },
// };

// app.use(session(sessionConfig));

// set up passport

app.use(passport.initialize()); //Passport is an authentication middleware for Node js that authenticates requests So basically passport.initialize() initialises the authentication module.
// app.use(passport.session()); //passport.session() is another middleware that alters the request object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object

passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy

passport.serializeUser(User.serializeUser()); // use static serialize and deserialize of model for passport session support
passport.deserializeUser(User.deserializeUser());

// set up router
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
