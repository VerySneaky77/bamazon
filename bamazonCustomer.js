const inquirer = require("inquirer");
const mysql = require("mysql");

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

connection.connect(function (err) {
    if (err) throw err;

    displayCurrentInventory();
    connection.end();
});

function displayCurrentInventory() {
    var query = "SELECT * FROM products;";

    connection.query(query, function (err, response) {
        if (err) return console.log(err);

        console.log(response);
        var inventory = {};

        for (let i = 0; i < response.length; i++) {
            var tempData = new data(
                response[i].product_name,
                response[i].department_name,
                response[i].price,
                response[i].stock_quantity
            )

            inventory[response[i].item_id] = tempData;
        }
        console.table(inventory);
    });
}

// Organize item properties for dispaly reference
function data(product, department, price, stock) {
    this.product = product;
    this.department = department;
    this.price = "$" + price.toFixed(2);
    this.stock = stock;
};