var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	console.log("accounts.js: Inside of GET");
	if (req.session.loggedIn) {
        console.log(req.session.roleId);
		if (req.session.roleId == 1) {
            res.redirect("admin/accounts");
		} else if (req.session.roleId == 2) {
            res.redirect("customer/accounts");
		} else {
            res.redirect("employee/accounts");
		}
	}
});

module.exports = router;
