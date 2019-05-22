# bamazon

## Overview
Store-front Node.js app designed to retrieve and alter an external database.

### About: Consumer App
bamazonCustomer.js is designed for end-users who are customers of bamazon. The app displays products available for purchase and provides the user with a short list of functions:
* **Purchase:** User orders an item by entering its ID. Total cost of purchases will be tracked for each session. Database of products will automatically update after each purchase. Purchases that attempt to deplete more than an item's available stock are cancelled.
* **Exit:** Closes the app.

### Showcase: Consumer App

### About: Manager App
bamazonManager.js is designed for bamazon supply chain management end-users. The app allows users to conduct the following actions regarding the database of products:
* **View Products:** Log all available products for viewing.
* **View Low Inventory:** Log all available products below a minimum quantity threshold. Minimum is set to five.
* **Add to Inventory:** Adjust the available stock quantity of an item. User will be prompted to select an item by its ID, followed by the amount to adjust the quantity. This function is meant to add to stock, but can be used to deplete it should the user deem it necessary. Database is updated upon completion of entries.
* **Add New Product:** Adds a new product listing to the product database. User will be prompted for required product information. Database is updated upon completion of entries.