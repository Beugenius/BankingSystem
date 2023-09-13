var express = require("express");
var router = express.Router();

/* Get */
router.get("/", (req, res, next) => {
  console.log("changepassword.ejs: inside GET");
  res.render("customer/changepassword", {});
});

/* Post */
router.post("/", (req, res, next) => {
  console.log("changepassword.ejs: inside POST");
  res.render("customer/accounts", {});
});

module.exports = router;