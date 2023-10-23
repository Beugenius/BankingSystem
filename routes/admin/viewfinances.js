var express = require("express");
var router = express.Router();
var db = require("../../lib/database");

/* Get */
router.get("/", async (req, res, next) => {
	console.log("accounts.ejs: inside GET");
	if (req.session.roleId == 1) {
		// get accounts associated with user
		var userAccounts = await db.GetUserAccountsByUserId(req.session.customerAccountId);
		let totalBalance = 0;
		userAccounts.forEach(element => {
			let elementBalance = parseFloat(element.balance);
			totalBalance += elementBalance;
		});
		console.log(totalBalance);
		res.render("admin/viewfinances", { userAccounts, totalBalance: totalBalance });
	} else {
		res.redirect("/accounts");
	}
});

module.exports = router;
