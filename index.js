const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");

const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(morgan("dev"));

server.get("/", (req, res) => {
  res.send(`<h2> Lambda - Authentication Project </h2>`);
});

//middleware
function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    db("users")
      .where({ username })
      .first()
      .then(user => {
        // check that passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: "Ran into an unexprected errors" });
      });
  } else {
    res.status(500).json({ message: "NO credentials provided" });
  }
}

//Get users only if the user is logged in
server.get("/api/users", restricted, async (req, res) => {
  try {
    const users = await db("users");
    res.status(200).json(users);
  } catch (error) {
    res.status(401).json({
      message: "You shall not pass!"
    });
  }
});

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

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
