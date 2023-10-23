var express = require("express");
var router = express.Router();
var db = require('../../lib/database');
const { user } = require("../../lib/connectionInfo");

/* Get */
router.get('/', async (req, res, next) => {
  console.log("accounts.ejs: inside GET");
  if(req.session.loggedIn) {
  // get accounts associated with user 
  var userAccounts = await db.GetUserAccountsByUserId(req.session.userId); 
  console.log(userAccounts);
  let totalBalance = 0;
  userAccounts.forEach(element => {
    let elementBalance = parseFloat(element.balance); 
    totalBalance += elementBalance; 
  });
  console.log(totalBalance);
  res.render('customer/accounts', {userAccounts, totalBalance: totalBalance});
  }
  else {
    res.redirect("/login");
  }
});

module.exports = router;