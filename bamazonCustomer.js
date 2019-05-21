////////////////////////////////////////////////
// GLOBAL ACCESS
////////////////////////////////////////////////

const inquirer = require("inquirer");
const mysql = require("mysql");
const inventoryControl = require("./inventoryControl.js");
const updateItems = inventoryControl.updateInventory;
const displayItems = inventoryControl.displayCurrentInventory;
// List of options for operation
const options = ["Purchase", "Exit"];
// Cost of orders for this session
var sessionCostTotal = 0.00;

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

    startup();
});

////////////////////////////////////////////////
// DATABASE OPERATIONS
////////////////////////////////////////////////

// Call operations with completed connection
function startup() {
    displayItems(connection, operationSelect);
}

function operationSelect() {
    updateCostTotal();

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
                orderItem();
                break;
            default:
                connection.end();
                console.log("\nThank you for using Bamazon!\n");
                break;
        }
    });
}

// Makes an order
function orderItem() {
    inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Input the ID number of your desired item. You can omit leading zeroes: "
        },
        {
            type: "number",
            name: "quantity",
            message: "How many do you want to order? "
        }
    ]).then(function (order) {
        // Find the requested item and build a data object for reference
        var query = `SELECT * FROM products WHERE item_id = ${order.id};`;

        connection.query(query, function (err, response) {
            if (err) return console.log(err);
            // Change sign of quantity to execute proper subtraction
            order.quantity = order.quantity * (-1);

            if (updateItems(connection, response[0], order)) {
                // Update cost total
                sessionCostTotal += parseFloat(response[0].price) * Math.abs(parseFloat(order.quantity));
                console.log("Order confirmed.");
            }
            else console.log("Your order could not be completed.");

            displayItems(connection, operationSelect);
        });
    });
}

////////////////////////////////////////////////
// SUB-FUNCTIONALITY
// (note: good band or album name)
////////////////////////////////////////////////

function updateCostTotal() {
    console.log("Total purchases: $" + sessionCostTotal.toFixed(2) + "\n");
}