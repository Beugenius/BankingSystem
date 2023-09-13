var express = require("express");
var router = express.Router();

/* Get */
router.get("/", (req, res, next) => {
  console.log("transactionhistory.ejs: inside GET");
  res.render("transactionhistory", {});
});

/* Post */
router.post("/", (req, res, next) => {
  console.log("transactionhistory.ejs: inside POST");
  res.render("accounts", {});
});

module.exports = router;