const inquirer = require("inquirer");
const mysql = require("mysql");
const removeItems = require("./updateInventory.js");
// List of options for operation
const options = ["Purchase", "Exit"];
// Filtered data columns for built data objects
const inventoryTargetInfo = ["product", "department", "priceDollar", "stock"];
// Cost of orders for this session
var sessionCostTotal = 0.00;

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

    displayCurrentInventory();
});

////////////////////////////////////////////////
// DATABASE OPERATIONS
////////////////////////////////////////////////

// Call operations with completed connection
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

function orderItem() {
    var targetData;

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
            var targetItem = response[0];

            targetData = new data(
                targetItem.product_name,
                targetItem.department_name,
                targetItem.price,
                targetItem.stock_quantity
            );
            // Change sign of quantity to execute proper subtraction
            order.quantity = order.quantity * (-1);

            if (removeItems(connection, targetData, order)) {
                // Update cost total
                sessionCostTotal += parseFloat(targetData.price) * Math.abs(parseFloat(order.quantity));
                console.log("Order confirmed.");
            }
            else console.log("Your order could not be completed.");

            displayCurrentInventory()
        });
    });
}

function displayCurrentInventory() {
    var query = "SELECT * FROM products;";

    connection.query(query, function (err, response) {
        if (err) return console.log(err);

        var inventory = {};

        for (let i = 0; i < response.length; i++) {
            var tempData = new data(
                response[i].product_name,
                response[i].department_name,
                response[i].price,
                response[i].stock_quantity
            );
            inventory[response[i].item_id] = tempData;
        }
        console.table(inventory, inventoryTargetInfo);

        operationSelect();
    });
}

// Organize item properties
function data(product, department, price, stock) {
    this.product = product;
    this.department = department;
    this.price = price;
    this.priceDollar = "$" + price.toFixed(2);
    this.stock = stock;
};

////////////////////////////////////////////////
// SUB-FUNCTIONALITY
// (note: good band or album name)
////////////////////////////////////////////////

function updateCostTotal() {
    console.log("Total purchases: $" + sessionCostTotal.toFixed(2) + "\n");
}