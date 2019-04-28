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
                
            }
        }
    )
    connection.end(function (error) {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Session Ended Successfully");
    });
}