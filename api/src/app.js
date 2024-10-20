const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const usersRouter = require("./routes/users");
const authenticationRouter = require("./routes/authentication");
const recipeRouter = require("./routes/recipes");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// Allow requests from any client
// docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// docs: https://expressjs.com/en/resources/middleware/cors.html

const whitelist =
  process.env.NODE_ENV === "production"
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json());

app.use(cookieParser());

// API Routes
app.use("/users", usersRouter);
app.use("/tokens", authenticationRouter);
app.use("/recipes", tokenChecker, recipeRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = app;
