const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const usersRoute = require("./users/users-route");
const registerRoute = require("./auth/register-route");
const loginRoute = require("./auth/login-route");

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));
server.use("/api/users/", usersRoute);
server.use("/api/register/", registerRoute);
server.use("/api/login/", loginRoute);

server.get("/", (req, res) => {
  res.send(`<h2> Lambda - Authentication Project </h2>`);
});

module.exports = server;
