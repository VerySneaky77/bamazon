////////////////////////////////////////////////
// GLOBAL ACCESS
////////////////////////////////////////////////

const inquirer = require("inquirer");
const mysql = require("mysql");
const inventoryControl = require("./inventoryControl.js");
const updateItems = inventoryControl.updateInventory;
const displayItems = inventoryControl.displayCurrentInventory;
// List of options for operation
const options = ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"];

////////////////////////////////////////////////
// DATABASE CONNECTION
////////////////////////////////////////////////

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////

connection.connect(function (err) {
    if (err) return console.error(err);

    operationSelect();
});

////////////////////////////////////////////////
// DATABASE OPERATIONS
////////////////////////////////////////////////

// Call operations with completed connection
function operationSelect() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Select operation: ",
            choices: options
        }
    ]).then(function (request) {
        switch (request.action) {
            case options[0]:
                displayItems(connection, operationSelect);
                break;
            case options[1]:
                
                break;
            case options[2]:
                
                break;
            case options[3]:
                
                break;
            default:
                connection.end();
                console.log("\nYour vigilance will be rewarded when Bamazon conquers the world!\n");
                break;
        }
    });
}