var express = require("express");
var router = express.Router();

/* Get */
router.get("/", (req, res, next) => {
  console.log("login.ejs: inside GET");
  res.render("login", {});
});

/* Post */
router.post("/", (req, res, next) => {
  console.log("login.ejs: inside POST");
  res.render("accounts", {});
});

module.exports = router;