var express = require("express");
var router = express.Router();

/* Get */
router.get("/", (req, res, next) => {
  console.log("transactionhistory.ejs: inside GET");
  res.render("customer/transactionhistory", {});
});

/* Post */
router.post("/", (req, res, next) => {
  console.log("transactionhistory.ejs: inside POST");
  res.render("customer/accounts", {});
});

module.exports = router;