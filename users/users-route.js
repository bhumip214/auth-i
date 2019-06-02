const express = require("express");
const router = express.Router();
const db = require("../data/dbConfig");

router.use(express.json());

//middleware
function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!" });
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
