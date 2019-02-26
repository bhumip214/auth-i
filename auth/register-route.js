const express = require("express");
const router = express.Router();
const db = require("../data/dbConfig");
const bcrypt = require("bcryptjs");

router.use(express.json());

//Create user and Hash the password
router.post("/", async (req, res) => {
  try {
    if (req.body.username && req.body.password) {
      const hash = await bcrypt.hashSync(req.body.password, 14);
      req.body.password = hash;

      const [id] = await db("users").insert(req.body);
      const user = await db("users")
        .where({ id })
        .first();
      req.session.user = user;
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

module.exports = router;
