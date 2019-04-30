const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

// products:
// id, product_name, department_name, price, stock_quantity

connection.connect(function (error) {
    if (error) {
        console.log(error);
        return;
    }
    // console.log("Connected as ID " + connection.threadId);

    // place functions here
    showAllItems();
})

function showAllItems() {
    connection.query(
        "SELECT * FROM products", function (error, results) {
            let thisManyItems = results.length;
            console.log(thisManyItems);
            if (error) {
                console.log(error);
                return;
            }
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                
                console.log("\n");
                console.log("Product ID: " + element.id);
                console.log("Product Name: " + element.product_name);
                console.log("Department Name: " + element.department_name);
                console.log("Price: $" + element.price);
                console.log("Number In Stock: " + element.stock_quantity);
                if (index == thisManyItems - 1) {
                    placeOrder();
                }
            }
        }
    );
}

function placeOrder() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Do you know the ID of the product that you would like to purchase?",
            name: "verif"
        }
    ]).then(function (response) {
        if (response.verif) {
            inquirer.prompt([
                {
                    type: "number",
                    message: "Please enter the ID of the product you would like to purchase",
                    name: "prodID",
                },
                {
                    type: "number",
                    message: "How many would you like?",
                    name: "quantity"
                }
            ]).then(function (response) {
                var order = response;
                
                connection.query(
                    "SELECT * FROM products WHERE ?", 
                    { id: Number(order.prodID) },
                    function (error, response) {
                        let data = response[0];
                        if (error) {
                            console.log(error);
                            return;
                        }
                        let costOfOrder = data.price * order.quantity;
                        
                        console.log("You have selected: " + data.product_name);
                        if (order.quantity > data.stock_quantity) {
                            console.log("Unfortunatly we only have " + data.stock_quantity + " of " + data.product_name + ". Goodbye!");
                        } else {
                            let quantityRemaining = data.stock_quantity - order.quantity;
                            console.log("Here we are, " + order.quantity + " " + data.product_name);
                            console.log("That will be, " + "$" + costOfOrder);

                            updateSQLzon(order.prodID, quantityRemaining, data.product_name);
                        }
                        endConnection();
                    }
                );

            });
        } else {
            console.log("Here, take a moment to look at our inventory.");
            showAllItems();
            endConnection();
        }
    });
}

function updateSQLzon(itemID, remaining, itemName) { 
    connection.query(
        "UPDATE products SET stock_quantity = ? WHERE id = ?", 
        [remaining, itemID], 
        function (error) {
            if (error) {
                console.log(error);
                return;
            }
            console.log("We have " + remaining + " " + itemName + " remaining!");
            
        }
    )
}

function endConnection() {
    connection.end(function (error) {
      if (error) {
          console.log(error);
          return;
      }
      console.log("Session Ended Successfully");
    });
}