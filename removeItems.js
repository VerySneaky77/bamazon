function removeFromInventory(connection, orderTarget, orderInquiry) {
    if (quantityCheck(orderTarget.stock, orderInquiry.quantity)) {
        var updateQuantity = orderTarget.stock - orderInquiry.quantity;
        var query = `UPDATE products SET stock_quantity = ${updateQuantity} WHERE item_id = ${orderInquiry.id};`;
        
        connection.query(query, function(err, response) {
            if (err) return console.log(err);
        });
        return true;
    }
    else {
        console.log("Insufficient quantity.");
        return false;
    }
}

// Accepts quantities only, no queries are made
function quantityCheck(available, requested) {
    if (available < requested) return false;
    else return true;
}

module.exports = removeFromInventory;