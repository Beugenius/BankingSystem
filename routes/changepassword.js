var express = require("express");
var router = express.Router();

/* Get */
router.get("/", (req, res, next) => {
  console.log("changepassword.ejs: inside GET");
  res.render("changepassword", {});
});

/* Post */
router.post("/", (req, res, next) => {
  console.log("changepassword.ejs: inside POST");
  res.render("accounts", {});
});

module.exports = router;