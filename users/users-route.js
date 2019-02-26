const express = require("express");
const router = express.Router();
const db = require("../data/dbConfig");
const bcrypt = require("bcryptjs");

router.use(express.json());

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
router.get("/", restricted, async (req, res) => {
  try {
    const users = await db("users");
    res.status(200).json(users);
  } catch (error) {
    res.status(401).json({
      message: "You shall not pass!"
    });
  }
});

module.exports = router;
