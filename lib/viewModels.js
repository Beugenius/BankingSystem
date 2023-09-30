class Account {
    constructor(accountNumber, balance, accountType, openingDate, userId) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.accountType = accountType;
        this.openingDate = openingDate;
        this.userId = userId; 
    }
}

module.exports = {
    Account
}