var express = require("express");
var router = express.Router();
var db = require("../../lib/database");

router.get("/", async (req, res, next) => {
	console.log("deposit.js: inside get");
	if (req.session.roleId == 3) {
		var userAccounts = await db.GetUserAccountsByUserId(req.session.customerAccountId);
		console.log(userAccounts);
		res.render("employee/deposit", { userAccounts });
	} else {
		res.redirect("/accounts");
	}
});

router.post("/", async (req, res, next) => {
	console.log("deposit.js: inside post");
	let accountNumber = req.body.account;
	let amount = req.body.amount;
	let depositSuccessful = await db.CreateDepositTransfer(accountNumber, amount);
	if (depositSuccessful) {
		res.redirect("../employee/viewfinances");
	} else {
		var userAccounts = await db.GetUserAccountsByUserId(req.session.customerAccountId);
		console.log(userAccounts);
		res.render("employee/deposit", { userAccounts, errorMessage: "Error depositing into account" });
	}
});

module.exports = router;
