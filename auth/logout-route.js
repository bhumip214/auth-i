const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("There was an error logging out, please try again!");
      } else {
        res.send("Thanks for visiting!");
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
