var express = require("express");
var router = express.Router();

/* Get */
router.get("/", (req, res, next) => {
  console.log("accounts.ejs: inside GET");
  res.render("accounts", {});
});

module.exports = router;