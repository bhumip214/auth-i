const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");

const usersRoute = require("./users/users-route");
const registerRoute = require("./auth/register-route");
const loginRoute = require("./auth/login-route");

const server = express();

const sessionConfig = {
  name: "monkey",
  secret: "Keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 60, // in ms
    secure: false // used over the https only
  },
  httpOnly: true, // cannot access the cookie from js using document.cookie
  resave: false,
  saveUninitialized: false // GDPR laws against cookies automatically
};

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));
server.use(session(sessionConfig));
server.use("/api/users/", usersRoute);
server.use("/api/register/", registerRoute);
server.use("/api/login/", loginRoute);

server.get("/", (req, res) => {
  res.send(`<h2> Lambda - Authentication Project </h2>`);
});

module.exports = server;
