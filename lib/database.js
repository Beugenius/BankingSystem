let mysql = require('mysql2');
let i = 1; 
var dbConnectionInfo = require('./connectionInfo');

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

        serverConnection.query("DROP DATABASE IF EXISTS BankingSystem",
            (error, result) => {
                if(error) {
                    console.log(error.message);
                    throw error; 
                }
                console.log("database.js DROPPED");
        });
        serverConnection.query("CREATE DATABASE IF NOT EXISTS BankingSystem",
            (error, result) => {
                if(error) {
                    console.log(error.message);
                    throw error; 
                }
                console.log("database.js banking_system database created if not exists");
                selectDatabase();
        });
    }
});

function selectDatabase() {
    let sql = "USE BankingSystem";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        else {
            console.log("database.js: BankingSystem selected as database");
            createTables();
            createStoredProcedures();
            addTableData();
        }
    })
}

function createTables() {
    // create user table 
    let sql = "CREATE TABLE IF NOT EXISTS User (\n" +
                    "UserId INT NOT NULL AUTO_INCREMENT, \n" +
                    "FirstName VARCHAR(50) NOT NULL,\n" +
                    "LastName VARCHAR(50) NOT NULL,\n" +
                    "Email VARCHAR(255) NOT NULL UNIQUE,\n" +
                    "DateOfBirth DATE NOT NULL,\n" +
                    "SocialSecurity VARCHAR(11) NOT NULL UNIQUE,\n" +
                    "HashedPassword VARCHAR(255) NOT NULL,\n" +
                    "Salt VARCHAR(255) NOT NULL,\n" +
                    "PRIMARY KEY (UserId)\n" +
                ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: User table created successfully if it didn't previously exist");
    });
    // alter user table to set increment number
    sql = "ALTER TABLE User AUTO_INCREMENT=1000000"; 
    serverConnection.execute(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: User table altered successfully to AUTO_INCREMENT = 1000000");
    });
    // create role table 
    sql = "CREATE TABLE IF NOT EXISTS Role (\n" +
                        "RoleId INT NOT NULL AUTO_INCREMENT, \n" +
                        "Role VARCHAR(50) NOT NULL,\n" +
                        "PRIMARY KEY (RoleId)\n" +
                    ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("database.js: Role table created successfully if it didn't previously exist");
        });
    // create user role table
    sql = "CREATE TABLE IF NOT EXISTS UserRole (\n" +
                    "UserRoleId INT NOT NULL AUTO_INCREMENT, \n" +
                    "UserId INT NOT NULL,\n" +
                    "RoleId INT NOT NULL,\n" +
                    "PRIMARY KEY (UserRoleId),\n" +
                    "FOREIGN KEY (UserId) REFERENCES User(UserId),\n" +
                    "FOREIGN KEY (RoleId) REFERENCES Role(RoleId)\n" +
                ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: UserRole table created successfully if it didn't previously exist");
    });

    // create account table 
    sql = "CREATE TABLE IF NOT EXISTS Account (\n" +
                        "AccountNumber INT NOT NULL AUTO_INCREMENT, \n" +
                        "Balance decimal(15,2) NOT NULL,\n" +
                        "Type VARCHAR(50) NOT NULL,\n" +
                        "OpeningDate DATE NOT NULL,\n" +
                        "UserId INT NOT NULL,\n" +
                        "PRIMARY KEY (AccountNumber),\n" +
                        "FOREIGN KEY (UserId) REFERENCES User(UserId)\n" +
                    ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            else {
            console.log("database.js: Account table created successfully if it didn't previously exist");
            }
        });
    // alter account table to set increment number
    sql = "ALTER TABLE Account AUTO_INCREMENT=100000"; 
    serverConnection.execute(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Account table altered successfully to AUTO_INCREMENT = 100000");
    });
    // create transfer table 
    sql = "CREATE TABLE IF NOT EXISTS Transfer (\n" +
                        "TransferId BIGINT NOT NULL AUTO_INCREMENT, \n" +
                        "TransferDate DATETIME NOT NULL, \n" +
                        "FromAccount INT NOT NULL,\n" +
                        "ToAccount INT NOT NULL,\n" +
                        "Status VARCHAR(50) NULL,\n" +
                        "Memo VARCHAR(255) NULL,\n" +
                        "PRIMARY KEY (TransferId),\n" +
                        "FOREIGN KEY (FromAccount) REFERENCES Account(AccountNumber),\n" +
                        "FOREIGN KEY (ToAccount) REFERENCES Account(AccountNumber)\n" +
                    ")"; 
    serverConnection.execute(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("database.js: Transfer table created successfully if it didn't previously exist");
        });
}

//#region Stored procedures JS Interface 

function createStoredProcedures() {
    // create user stored procedure 
    let sql = "CREATE PROCEDURE IF NOT EXISTS `create_user`(\n" +
                    "IN FirstName VARCHAR(50), \n" +
                    "IN LastName VARCHAR(50), \n" +
                    "IN Email VARCHAR(255), \n" +
                    "IN DateOfBirth VARCHAR(10), \n" +
                    "IN SocialSecurity VARCHAR(11), \n" +
                    "IN HashedPassword VARCHAR(255), \n" +
                    "IN Salt VARCHAR(255)\n" +
               ")\n" +
               "BEGIN\n" +
                    "INSERT INTO User (FirstName, LastName, Email, DateOfBirth, \n" + 
                    "SocialSecurity, HashedPassword, Salt) \n" +
                    "VALUES (FirstName, LastName, Email, DateOfBirth, \n" + 
                    "SocialSecurity, HashedPassword, Salt);\n" +
               "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("database.js: Stored Procedure create_user created successfully");
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
                "INSERT INTO Transfer (TransferDate, FromAccount, \n" +
                "ToAccount, Status, Memo)\n" +
                "VALUES (TransferDate, FromAccount, ToAccount, Status, Memo);\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("database.js: Stored Procedure create_transfer created successfully");
        });  
    // create account stored procedure 
    sql = "CREATE PROCEDURE IF NOT EXISTS `create_account`(\n" +
                "IN Balance DECIMAL(15,2),\n" +
                "IN Type VARCHAR(50),\n" +
                "IN OpeningDate VARCHAR(10),\n" +
                "IN UserId INT\n" +
            ")\n" +
            "BEGIN\n" +
                "INSERT INTO Account (Balance, Type, OpeningDate, UserId)\n" +
                "VALUES (Balance, Type, OpeningDate, UserId);\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("database.js: Stored Procedure create_account created successfully");
        }); 

    // create role stored procedure 
    sql = "CREATE PROCEDURE IF NOT EXISTS `create_role`(\n" +
                "IN Role VARCHAR(50)\n" +
            ")\n" +
            "BEGIN\n" +
                "INSERT INTO Role (Role)\n"+
                "VALUES (Role);\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("database.js: Stored Procedure create_role created successfully");
        });  

    // create user role stored procedure 
    sql = "CREATE PROCEDURE IF NOT EXISTS `create_user_role`(\n" +
                "IN UserId INT,\n" +
                "IN RoleId INT\n" +
            ")\n" +
            "BEGIN\n" +
                "INSERT INTO UserRole (UserId, RoleId) \n" +
                "VALUES (UserId, RoleId);\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("database.js: Stored Procedure create_user_role created successfully");
        }); 
    
    // create account stored procedure 
    sql = "CREATE PROCEDURE IF NOT EXISTS `create_account`(\n" +
                "IN Balance DECIMAL(15,2),\n" +
                "IN Type VARCHAR(50),\n" +
                "IN OpeningDate VARCHAR(10),\n" +
                "IN UserId INT\n" +
            ")\n" +
            "BEGIN\n" +
                "INSERT INTO Account (Balance, Type, OpeningDate, UserId)\n" +
                "VALUES (Balance, Type, OpeningDate, UserId);\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("database.js: Stored Procedure create_account created successfully");
        }); 

    // update_account_balance_by_account_number stored procedure 
    sql = "CREATE PROCEDURE IF NOT EXISTS `update_account_balance_by_account_number`(\n" +
                "IN AmountToAdd DECIMAL(15,2),\n" +
                "IN AccountNumber INT\n" +
            ")\n" +
            "BEGIN\n" +
                "UPDATE Account SET Balance = Balance + AmountToAdd WHERE AccountNumber = AccountNumber;\n" +
            "END;"; 
    serverConnection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error.message);
                throw error;
            }
            console.log("database.js: Stored Procedure update_account_balance_by_account_number created successfully");
        }); 
}

//#endregion

function addTableData() {
    // CreateUser("Bryce", "Hutchinson", "brycehutchinson@mail.weber.edu", "1998-10-11", "123-45-6789", "518210a7b7adc34a3aac2d440bb3a2796a07e3bcc918783559528b44ca5ab26a", "dc1998bcdb6320d");
    let sql = "CALL create_user('Bryce', 'Hutchinson', 'brycehutchinson@mail.weber.edu', '1998-10-11', '123-45-6789', '518210a7b7adc34a3aac2d440bb3a2796a07e3bcc918783559528b44ca5ab26a', 'dc1998bcdb6320d')";  
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Stored Procedure call to create user Bryce Hutchinson");
    }); 
    // Create roles 
    sql = "CALL create_role('Admin')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Stored Procedure call to create role admin");
    }); 
    sql = "CALL create_role('Customer')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Stored Procedure call to create role Customer");
    }); 
    sql = "CALL create_role('Employee')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Stored Procedure call to create role Employee");
    }); 
    // Create Accounts 
    sql = "CALL create_account('0.00', 'Checking', '2023-09-23', 1000000)";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Stored Procedure call to create new checking account for user id 1000000");
    }); 
    sql = "CALL create_account('0.00', 'Savings', '2023-09-23', 1000000)";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Stored Procedure call to create new savings account for user id 1000000");
    }); 
    sql = "CALL update_account_balance_by_account_number('9999.99','100000')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Stored Procedure call update_account_balance_by_account_number updated from 0.00 to 9999.99");
    }); 
    sql = "CALL update_account_balance_by_account_number('10000.01','100001')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Stored Procedure call update_account_balance_by_account_number updated from 0.00 to 10000.01");
    }); 
    sql = "CALL update_account_balance_by_account_number('58.67','100001')";
    serverConnection.query(sql, (error, results, fields) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
        console.log("database.js: Stored Procedure call update_account_balance_by_account_number to add 58.67");
    }); 
    // CreateUserRole("1000000", "Admin");
    // UpdateAccountBalanceByAccountNumber("100001", "53.87");
}

module.exports = serverConnection; 