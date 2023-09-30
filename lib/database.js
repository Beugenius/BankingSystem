//#region requires
let mysql = require('mysql2');
var dbConnectionInfo = require('./connectionInfo');
//#endregion

//#region server connection
var serverConnection = mysql.createConnection({
  host: dbConnectionInfo.host,
  user: dbConnectionInfo.user,
  password: dbConnectionInfo.password,
  port: dbConnectionInfo.port,
  multipleStatements: true
});

serverConnection.connect((error) => {
    if(error) {
        throw error;
    }
    else {
        console.log("database.js: Connected to server")

        serverConnection.query("DROP DATABASE IF EXISTS banking_system",
            (error, result) => {
                if(error) {
                    console.log(error.message);
                    throw error; 
                }
                console.log("database.js DROPPED");
        });
        serverConnection.query("CREATE DATABASE IF NOT EXISTS banking_system",
            (error, result) => {
                if(error) {
                    console.log(error.message);
                    throw error; 
                }
                console.log("\tdatabase.js banking_system database created if not exists");
                selectDatabase();
        });
    }
});
//#endregion

//#region select database
function selectDatabase() {
    let sql = "USE banking_system";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        else {
            console.log("\tdatabase.js: banking_system selected as database");
            createTables();
            createStoredProcedures();
            addTableData();
        }
    })
}
//#endregion

//#region create tables 
function createTables() {
    // create role table 
    let sql = "CREATE TABLE IF NOT EXISTS role (\n" +
                        "role_id INT NOT NULL AUTO_INCREMENT, \n" +
                        "role VARCHAR(50) NOT NULL,\n" +
                        "PRIMARY KEY (role_id)\n" +
                    ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\nCreating Tables\n***********************************************");
            console.log("\tdatabase.js: Role table created successfully if it didn't previously exist");
        });
    // create account_type table 
    sql = "CREATE TABLE IF NOT EXISTS account_type (\n" +
                        "account_type_id INT NOT NULL AUTO_INCREMENT, \n" +
                        "account_type VARCHAR(50) NOT NULL,\n" +
                        "PRIMARY KEY (account_type_id)\n" +
                    ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\nCreating Tables\n***********************************************");
            console.log("\tdatabase.js: Role table created successfully if it didn't previously exist");
        });
    // create user table 
    sql = "CREATE TABLE IF NOT EXISTS user (\n" +
                    "user_id INT NOT NULL AUTO_INCREMENT, \n" +
                    "first_name VARCHAR(50) NOT NULL,\n" +
                    "last_name VARCHAR(50) NOT NULL,\n" +
                    "email VARCHAR(255) NOT NULL UNIQUE,\n" +
                    "date_of_birth DATE NOT NULL,\n" +
                    "social_security VARCHAR(11) NOT NULL,\n" +
                    "hashed_password VARCHAR(255) NOT NULL,\n" +
                    "salt VARCHAR(255) NOT NULL,\n" +
                    "role_id INT NOT NULL,\n" +
                    "PRIMARY KEY (user_id),\n" +
                    "FOREIGN KEY (role_id) REFERENCES role(role_id)\n" +
                ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\tdatabase.js: User table created successfully if it didn't previously exist");
    });
    // alter user table to set increment number
    sql = "ALTER TABLE user AUTO_INCREMENT=1000000"; 
    serverConnection.execute(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\tdatabase.js: User table altered successfully to AUTO_INCREMENT = 1000000");
    });

    // create account table 
    sql = "CREATE TABLE IF NOT EXISTS account (\n" +
                        "account_number INT NOT NULL AUTO_INCREMENT, \n" +
                        "balance decimal(15,2) NOT NULL,\n" +
                        "account_type_id INT NOT NULL,\n" +
                        "opening_date DATE NOT NULL,\n" +
                        "user_id INT NOT NULL,\n" +
                        "PRIMARY KEY (account_number),\n" +
                        "FOREIGN KEY (user_id) REFERENCES user(user_id),\n" +
                        "FOREIGN KEY (account_type_id) REFERENCES account_type(account_type_id)\n" +
                    ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            else {
            console.log("\tdatabase.js: Account table created successfully if it didn't previously exist");
            }
        });
    // alter account table to set increment number
    sql = "ALTER TABLE account AUTO_INCREMENT=100000"; 
    serverConnection.execute(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\tdatabase.js: Account table altered successfully to AUTO_INCREMENT = 100000");
    });
    // create transfer table 
    sql = "CREATE TABLE IF NOT EXISTS transfer (\n" +
                        "transfer_id BIGINT NOT NULL AUTO_INCREMENT, \n" +
                        "transfer_date DATETIME NOT NULL, \n" +
                        "from_account INT NOT NULL,\n" +
                        "to_account INT NOT NULL,\n" +
                        "status VARCHAR(50) NULL,\n" +
                        "memo VARCHAR(255) NULL,\n" +
                        "PRIMARY KEY (transfer_id),\n" +
                        "FOREIGN KEY (from_account) REFERENCES account(account_number),\n" +
                        "FOREIGN KEY (to_account) REFERENCES account(account_number)\n" +
                    ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\tdatabase.js: Transfer table created successfully if it didn't previously exist");
        });
}
//#endregion 

//#region Stored procedures

function createStoredProcedures() {
    // create role stored procedure 
    let sql = "CREATE PROCEDURE IF NOT EXISTS `create_role`(\n" +
                "IN Role VARCHAR(50)\n" +
            ")\n" +
            "BEGIN\n" +
                "INSERT INTO role (role)\n"+
                "VALUES (Role);\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\nCreating Stored Procedures\n***********************************************");
            console.log("\tdatabase.js: Stored Procedure create_role created successfully");
        });  
    // Create roles 
    sql = "CALL create_role('admin')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\n\tAdding role data early so create_user can reference correct role_id\n\t***************************************");
        console.log("\tdatabase.js: Stored Procedure call to create role admin");
    }); 
    sql = "CALL create_role('customer')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\tdatabase.js: Stored Procedure call to create role Customer");
    }); 
    sql = "CALL create_role('employee')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\tdatabase.js: Stored Procedure call to create role Employee");
    });   
    // create role stored procedure 
    sql = "CREATE PROCEDURE IF NOT EXISTS `create_account_type`(\n" +
                "IN AccountType VARCHAR(50)\n" +
            ")\n" +
            "BEGIN\n" +
                "INSERT INTO account_type (account_type)\n"+
                "VALUES (AccountType);\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\n\tdatabase.js: Stored Procedure create_account_type created successfully");
        });  
    // Create account types 
    sql = "CALL create_account_type('checking')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\n\tAdding account_type data early so create_account can reference correct account_type_id\n\t***************************************");
        console.log("\tdatabase.js: Stored Procedure call to create checking account type");
    });  
    sql = "CALL create_account_type('savings')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\n\tAdding account_type data early so create_account can reference correct account_type_id\n\t***************************************");
        console.log("\tdatabase.js: Stored Procedure call to create savings account type");
    });   
    // create user stored procedure 
    // Defaults role to customer 
    sql = "CREATE PROCEDURE IF NOT EXISTS `create_user`(\n" +
                    "IN FirstName VARCHAR(50), \n" +
                    "IN LastName VARCHAR(50), \n" +
                    "IN Email VARCHAR(255), \n" +
                    "IN DateOfBirth VARCHAR(10), \n" +
                    "IN SocialSecurity VARCHAR(11), \n" +
                    "IN HashedPassword VARCHAR(255), \n" +
                    "IN Salt VARCHAR(255)\n" +
               ")\n" +
               "BEGIN\n" +
                    "INSERT INTO user (first_name, last_name, email, date_of_birth, \n" + 
                    "social_security, hashed_password, salt, role_id) \n" +
                    "VALUES (FirstName, LastName, Email, DateOfBirth, \n" + 
                    "SocialSecurity, HashedPassword, Salt, \n"+
                    "(SELECT role_id FROM role WHERE role.role = 'Customer'));\n" +
               "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\tdatabase.js: Stored Procedure create_user created successfully");
        });  
    // create transfer stored procedure 
    sql = "CREATE PROCEDURE IF NOT EXISTS `create_transfer`(\n" +
                "IN TransferDate VARCHAR(20), \n" +
                "IN FromAccount INT, \n" +
                "IN ToAccount INT, \n" +
                "IN Status VARCHAR(50), \n" +
                "IN Memo VARCHAR(255) \n" +
            ")\n" +
            "BEGIN\n" +
                "INSERT INTO transfer (transfer_date, from_account, \n" +
                "to_account, status, memo)\n" +
                "VALUES (TransferDate, FromAccount, ToAccount, Status, Memo);\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\tdatabase.js: Stored Procedure create_transfer created successfully");
        });  

    // create account stored procedure 
    sql = "CREATE PROCEDURE IF NOT EXISTS `create_account`(\n" +
                "IN Balance DECIMAL(15,2),\n" +
                "IN AccountTypeId INT,\n" +
                "IN OpeningDate VARCHAR(10),\n" +
                "IN UserId INT\n" +
            ")\n" +
            "BEGIN\n" +
                "INSERT INTO account (balance, account_type_id, opening_date, user_id)\n" +
                "VALUES (Balance, AccountTypeId, OpeningDate, UserId);\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\tdatabase.js: Stored Procedure create_account created successfully");
        }); 

    // change user role 
    sql = "CREATE PROCEDURE IF NOT EXISTS `change_user_role`(\n" +
                "IN UserId INT,\n" +
                "IN RoleId INT\n" +
            ")\n" +
            "BEGIN\n" +
                "UPDATE user\n"+
                "SET user.role_id = RoleId\n" +
                "WHERE user.user_id = UserId;\n"+
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\tdatabase.js: Stored Procedure create_user_role created successfully");
        }); 
    
    // update_account_balance_by_account_number stored procedure 
    sql = "CREATE PROCEDURE IF NOT EXISTS `update_account_balance_by_account_number`(\n" +
                "IN AmountToAdd DECIMAL(15,2),\n" +
                "IN AccountNumber INT\n" +
            ")\n" +
            "BEGIN\n" +
                "UPDATE Account\n"+
                "SET balance = balance + AmountToAdd\n"+
                "WHERE account.account_number = AccountNumber;\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\tdatabase.js: Stored Procedure update_account_balance_by_account_number created successfully");
        }); 
    // change password 
    sql = "CREATE PROCEDURE IF NOT EXISTS `change_user_hashed_password_by_user_id`(\n" +
                "IN UserId INT,\n" +
                "IN NewHashedPassword VARCHAR(255)\n" +
            ")\n" +
            "BEGIN\n" +
                "UPDATE user\n"+
                "SET hashed_password = NewHashedPassword\n"+
                "WHERE user.user_id = UserId;\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\tdatabase.js: Stored Procedure change_user_hashed_password_by_user_id created successfully");
        }); 
    // get salt 
    sql = "CREATE PROCEDURE IF NOT EXISTS `get_salt_by_user_id`(\n" +
                "IN UserId INT\n" +
            ")\n" +
            "BEGIN\n" +
                "SELECT salt\n"+
                "FROM user\n"+
                "WHERE user.user_id = UserId;\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("\tdatabase.js: Stored Procedure change_user_hashed_password_by_user_id created successfully");
        }); 
}

//#endregion

//#region add table data 
async function addTableData() {
    // CreateUser
    CreateUser('Bryce', 'Hutchinson', 'brycehutchinson@mail.weber.edu', '1998-10-11', '123-45-6789', '518210a7b7adc34a3aac2d440bb3a2796a07e3bcc918783559528b44ca5ab26a', 'dc1998bcdb6320d');
    
    // Create Accounts 
    CreateAccount(1, 1000000);
    CreateAccount(2, 1000000);
    // Update Account Balances
    UpdateAccountBalanceByAccountNumber(9999.99, 100000);
    UpdateAccountBalanceByAccountNumber(10000.01, 100001);
    UpdateAccountBalanceByAccountNumber(56.87, 100001);

    // Get Salt
    console.log("\tdatabase.js: retrieved user with id " + 1000000 + "'s salt: " + await GetSaltByUserId(1000000));
}
//#endregion 

//#region Javascript interface to call stored procedures 

/**
 * This creates a new account with account_type and user_id 
 * @param {*INT} accountTypeId 
 * @param {*INT} userId 
 */
function CreateAccount(accountTypeId, userId) {
    var todaysDateObject = new Date(); 
    var formattedDateString = todaysDateObject.getFullYear() + "-" + (todaysDateObject.getMonth() + 1) + "-" + todaysDateObject.getDate();
    sql = "CALL create_account('0.00', " + accountTypeId + ", '" + formattedDateString + "', " + userId + ")";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\tdatabase.js: Stored Procedure call to create new account type: " + accountTypeId + " account for user id " + userId + " with opening date of " + todaysDateObject);
    }); 
}

/**
 * 
 * @param {Creates a new user} firstName 
 * @param {*} lastName 
 * @param {*} email 
 * @param {*} dateOfBirth 
 * @param {*} ssn 
 * @param {*} hashedPassword 
 * @param {*} salt 
 */
function CreateUser(firstName, lastName, email, dateOfBirth, ssn, hashedPassword, salt) {
    let sql = "CALL create_user('" + firstName + "', '" + lastName + "', '" + email + "', '" + dateOfBirth + "', '" + ssn + "', '" + hashedPassword + "', '" + salt + "')";  
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\nAdding Table Data:\n***********************************************");
        console.log("\tdatabase.js: Stored Procedure call to create user " + firstName + " " + lastName);
    }); 
}

/**
 * Add an amount to an account by account number 
 * @param {*DECIMAL(15,2)} amountToAdd 
 * @param {*INT} accountNumber 
 */
function UpdateAccountBalanceByAccountNumber(amountToAdd, accountNumber) {
    sql = "CALL update_account_balance_by_account_number('" + amountToAdd + "', " + accountNumber + ")";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("\tdatabase.js: Stored Procedure call update_account_balance_by_account_number added " + amountToAdd + " to account number: " + accountNumber);
    }); 
}
/**
 * Returns a users salt 
 * @param {INT*} userId 
 * @returns 
 */
function GetSaltByUserId(userId) {
    let sql = "CALL get_salt_by_user_id(" + userId + ")";
    return new Promise((resolve, reject) => {
        serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                reject(error);
            }
            resolve(results[0][0].salt);
        }); 
    });
}
//#endregion  

module.exports = serverConnection; 