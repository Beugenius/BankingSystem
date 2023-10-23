var express = require("express");
var router = express.Router();
var db = require("../../lib/database");

/* Get */
router.get("/", async (req, res, next) => {
	console.log("transfer.ejs: inside GET");
	if (req.session.loggedIn) {
		var userAccounts = await db.GetUserAccountsByUserId(req.session.userId);
		console.log(userAccounts);
		res.render("customer/transfer", { userAccounts });
	} else {
		res.redirect("/login");
	}
});

/* Post */
router.post("/", async (req, res, next) => {
	console.log("transfer.ejs: inside POST");
	// verify account has enough to transfer
	let fromAccountNumber = req.body.transferFrom;
	let toAccountNumber = req.body.transferTo;
	let amount = req.body.amount;
	let memo = req.body.memo;
  console.log("from account num: " + fromAccountNumber);
  console.log("to Account num: " + toAccountNumber);
  console.log("Right before the call");
	let fromAccountHasEnoughFunds = await db.AccountHasEnoughToTransfer(amount, fromAccountNumber);
  console.log(fromAccountHasEnoughFunds); 
	if (fromAccountHasEnoughFunds) {
		let transferSuccess = await db.TransferBetweenAccounts(
			fromAccountNumber,
			toAccountNumber,
			amount,
			memo
		);
		if (transferSuccess) {
			res.redirect("/accounts");
		} else {
			var userAccounts = await db.GetUserAccountsByUserId(req.session.userId);
			res.render("customer/transfer", { userAccounts, errorMessage: "Error processing transfer" });
		}
	} else {
		var userAccounts = await db.GetUserAccountsByUserId(req.session.userId);
		res.render("customer/transfer", { userAccounts, errorMessage: "Insufficient funds" });
	}
});

module.exports = router;
