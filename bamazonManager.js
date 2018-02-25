const inquirer = require('inquirer');
const mysql = require('mysql');

const DATABASE = 'bamazon';
const TABLE = 'products';

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',

	password: 'gabig',
	database: DATABASE
});

function promptManagerAction() {


	// Prompt the manager to select an option
	inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (val) {
				if (val === 'View Products for Sale') {
					return 'sale';
				} else if (val === 'View Low Inventory') {
					return 'lowInventory';
				} else if (val === 'Add to Inventory') {
					return 'addInventory';
				} else if (val === 'Add New Product') {
					return 'newProduct';
				} else {

					console.log('ERROR: Unsupported operation!');
					exit(1);
				}
			}
		}
	]).then(function(input) {


		if (input.option ==='sale') {
			displayInventory();
		} else if (input.option === 'lowInventory') {
			displayLowInventory();
		} else if (input.option === 'addInventory') {
			addInventory();
		} else if (input.option === 'newProduct') {
			createNewProduct();
		} else {

			console.log('ERROR: Unsupported operation!');
			exit(1);
		}
	})
};