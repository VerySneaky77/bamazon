// Properties to display for the inventory
const inventoryTargetInfo = ["product","department","price","stock"];

module.exports.displayInventory = function (connection, query, nextStep) {
    connection.query(query, function (err, response) {
        if (err) return console.log(err);

        var inventory = {};

        for (let i = 0; i < response.length; i++) {
            var tempData = new itemData(
                response[i].product_name,
                response[i].department_name,
                response[i].price,
                response[i].stock_quantity
            );
            inventory[response[i].item_id] = tempData;
        }
        console.table(inventory, inventoryTargetInfo);

        nextStep();
    });
}

// Query inventory database
module.exports.updateInventory = function (connection, targetData, orderInquiry) {
    // Data-fied object of the target
    var orderTarget = new itemData(
        targetData.product_name,
        targetData.department_name,
        targetData.price,
        targetData.stock_quantity
    );

    if (quantityCheck(orderTarget.stock, orderInquiry.quantity)) {
        // New calculate quantity
        var updateQuantity = orderTarget.stock + orderInquiry.quantity;
        // Query to change quantity
        var query = `UPDATE products SET stock_quantity = ${updateQuantity} WHERE item_id = ${orderInquiry.id};`;

        connection.query(query, function (err, response) {
            if (err) return console.log(err);
        });
        return true;
    }
    else {
        console.log("\nInsufficient quantity.\n");
        return false;
    }
}

// Accepts quantities only, no queries are made
function quantityCheck(available, requested) {
    // Also catches NaNs
    if ((available + requested) > -1) return true;
    else return false;
}

// Organize item properties
function itemData (product, department, price, stock) {
    this.product = product;
    this.department = department;
    this.priceNumber = price;
    this.price = "$" + price.toFixed(2);
    this.stock = stock;
};