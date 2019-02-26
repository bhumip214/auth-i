const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const usersRoute = require("./users/users-route");
const bcrypt = require("bcryptjs");

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));
server.use("/api/users/", usersRoute);

server.get("/", (req, res) => {
  res.send(`<h2> Lambda - Authentication Project </h2>`);
});

module.exports = server;

//Create user and Hash the password
server.post("/api/register", async (req, res) => {
  try {
    if (req.body.username && req.body.password) {
      const hash = await bcrypt.hashSync(req.body.password, 14);
      req.body.password = hash;

      const [id] = await db("users").insert(req.body);
      const user = await db("users")
        .where({ id })
        .first();
      res.status(201).json(user);
    } else {
      res.status(400).json({
        errorMessage: "Please provide username and password to register."
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error while registering."
    });
  }
});

//Create login
server.post("/api/login", async (req, res) => {
  try {
    const { username, password } = await req.body;
    if (username && password) {
      const user = await db("users")
        .where({ username })
        .first();
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    } else {
      res.status(400).json({
        errorMessage:
          "Please provide correct username and password to register."
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error while logging in."
    });
  }
});
