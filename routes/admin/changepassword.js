var express = require("express");
var router = express.Router();

/* Get */
router.get("/", (req, res, next) => {
  console.log("admin/changepassword.ejs: inside GET");
  res.render("admin/changepassword", {});
});

/* Post */
router.post("/", (req, res, next) => {
  console.log("admin/changepassword.ejs: inside POST");
  res.render("admin/accounts", {});
});

module.exports = router;