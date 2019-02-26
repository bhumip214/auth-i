const express = require("express");
const router = express.Router();
const db = require("../data/dbConfig");
const bcrypt = require("bcryptjs");

router.use(express.json());

//Create login
router.post("/", async (req, res) => {
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

module.exports = router;
