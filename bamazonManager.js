////////////////////////////////////////////////
// GLOBAL ACCESS
////////////////////////////////////////////////

const inquirer = require("inquirer");
const mysql = require("mysql");
const inventoryControl = require("./inventoryControl.js");
const updateItems = inventoryControl.updateInventory;
const displayItems = inventoryControl.displayInventory;
// List of options for operation
const options = ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"];
// Minimum/low stock limit
const minStock = 5;

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
                displayItems(connection, "SELECT * FROM products;", operationSelect);
                break;
            case options[1]:
                displayItems(connection, `SELECT * FROM products WHERE stock_quantity <  ${minStock};`, operationSelect);
                break;
            case options[2]:
                addInventory();
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

function addInventory() {
    inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Input the ID number of your desired item. You can omit leading zeroes: "
        },
        {
            type: "number",
            name: "quantity",
            message: "Indicate number of units to add: "
        }
    ]).then(function (order) {
        // Find the requested item
        var query = `SELECT * FROM products WHERE item_id = ${order.id};`;

        connection.query(query, function (err, response) {
            if (err) return console.log(err);

            if(updateItems(connection, response[0], order)) {
                // Update cost total
                console.log(`Inventory updated for ${response[0].product_name}.`);
            }
            else console.log("Unable to update inventory.");

            operationSelect();
        });
    });
}