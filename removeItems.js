function removeFromInventory(orderTarget, orderInquiry) {
    if (quantityCheck(orderTarget.stock, orderInquiry.quantity)) {

        console.log("Order confirmed.");
    }
    else { console.log("Insufficient quantity."); }
}

// Accepts quantities only, no queries are made
function quantityCheck(available, requested) {
    if (available < requested) return false;
    else return true;
}

module.exports = removeFromInventory;