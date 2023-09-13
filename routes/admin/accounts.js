var express = require("express");
var router = express.Router();

/* Get */
router.get('/', (req, res, next) => {
  console.log("admin/accounts.ejs: inside GET");
  res.render('admin/accounts', {});
});

router.post('/', (req, res, next) => {
    console.log("admin/accounts.ejs: inside POST");
    res.render('admin/changepassword', {});
});

module.exports = router;