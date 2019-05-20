const inquirer = require("inquirer");
const mysql = require("mysql");
const removeItems = require("./removeItems.js");

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

// Call operations with completed connection
connection.connect(function (err) {
    if (err) throw err;

    var query = "SELECT * FROM products;";

    connection.query(query, function (err, response) {
        if (err) return console.log(err);

        displayCurrentInventory(response);
        orderItem(response);
    });

    connection.end();
});

function displayCurrentInventory(response) {
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
    console.table(inventory);
}

function orderItem(response) {
    inquirer
        .prompt([
            {
                type: "number",
                name: "id",
                message: "Input the ID number of your desired item. You can omit leading zeroes."
            },
            {
                type: "number",
                name: "quantity",
                message: "How many do you want to order?"
            }
        ]).then(function (order) {
            // Find the requested item and build a data object for reference
            var targetData;
            var indexCount = 0;
            var targetIndexFound = false;

            while (!targetIndexFound) {
                if (parseInt(response[indexCount].item_id) === order.id) {
                    targetData = new data(
                        response[indexCount].product_name,
                        response[indexCount].department_name,
                        response[indexCount].price,
                        response[indexCount].stock_quantity
                    );

                    targetIndexFound = true;
                    removeItems(targetData, order);
                }
                else { indexCount++; }
            }
        });
}

// Organize item properties for display reference
function data(product, department, price, stock) {
    this.product = product;
    this.department = department;
    this.price = "$" + price.toFixed(2);
    this.stock = stock;
};