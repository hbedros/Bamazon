const inquirer = require('inquirer');
const mysql = require('mysql');

const DATABASE = 'bamazon';
const TABLE = 'products';

const connection = mysql.createConnection({
    host: 'localhost',
    root: 3306,

    user:'root',
    password:'gabig',
    database: DATABASE
});

// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a valid non-zero number.';
	}
}

// promptUserPurchase prompts the option so the user can shop
function promptUserPurchase() {

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID which you would like to purchase.',
			validate: validateInput,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
			validate: validateInput,
			filter: Number
		}
	]).then(function(input) {

		var item = input.item_id;
		var quantity = input.quantity;

		var queryStr = `SELECT * FROM ${TABLE} WHERE ?`;

		connection.query(queryStr, {item_id: item}, function(error, data) {

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();

			} else {
                var productData = data[0];
                
				if (quantity <= productData.stock_quantity) {
					console.log('The product you requested is in stock! Placing your order...');

					// Construct the updating query string
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
					// console.log('updateQueryStr = ' + updateQueryStr);

					// Update the inventory
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");

						// End the database connection
						connection.end();
					})
				} else {
                    console.log("\n---------------------------------------------------------------------\n");
					console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
                    promptUserPurchase();
                }
            }
        })  
    })
}

// displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {

	// Construct the db query string
	queryStr = `SELECT * FROM ${TABLE}`;

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var listOfProducts = '';
		for (var i = 0; i < data.length; i++) {
			listOfProducts = '';
			listOfProducts += 'Item ID: ' + data[i].item_id + '  |  ';
			listOfProducts += 'Product Name: ' + data[i].product_name + '  |  ';
			listOfProducts += 'Department: ' + data[i].department_name + '  |  ';
			listOfProducts += 'Price: $' + data[i].price + '\n';

			console.log(listOfProducts);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	//Prompt the user for item/quantity they would like to purchase
	  	promptUserPurchase();
	})
}

// runBamazon will execute the main application logic
function runBamazon() {
	// console.log('___ENTER runBamazon___');

	// Display the available inventory
	displayInventory();
}

// Run the application logic
runBamazon();