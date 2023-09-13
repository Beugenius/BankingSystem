var express = require("express");
var router = express.Router();

/* Get */
router.get('/', (req, res, next) => {
  console.log("employee/accounts.ejs: inside GET");
  res.render('employee/accounts', {});
});

module.exports = router;