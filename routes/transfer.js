var express = require("express");
var router = express.Router();

/* Get */
router.get("/", (req, res, next) => {
  console.log("transfer.ejs: inside GET");
  res.render("transfer", {});
});

/* Post */
router.post("/", (req, res, next) => {
  console.log("transfer.ejs: inside POST");
  res.render("accounts", {});
});

module.exports = router;