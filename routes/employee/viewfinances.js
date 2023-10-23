var express = require("express");
var router = express.Router();
var db = require("../../lib/database");

/* Get */
router.get("/", async (req, res, next) => {
	console.log("employee/viewfinances.ejs: inside GET");
    console.log("Role Id: " + req.session.roleId);
	if (req.session.roleId == 3) {
		// get accounts associated with user
		var userAccounts = await db.GetUserAccountsByUserId(req.session.customerAccountId);
		let totalBalance = 0;
		userAccounts.forEach(element => {
			let elementBalance = parseFloat(element.balance);
			totalBalance += elementBalance;
		});
		console.log(totalBalance);
		res.render("employee/viewfinances", { userAccounts, totalBalance: totalBalance });
	} else {
		res.redirect("/accounts");
	}
});

module.exports = router;
