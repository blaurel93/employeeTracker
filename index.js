const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
//////  CONNECTION MYSQL //////
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.MYSQL_PASSWORD,
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) throw err;

    viewEmployees();

});
////// START INQUIRER //////
function trackEmployee() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add department",
                "View departments",
                "View employees",
                "Update employee",
                "Add employee",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add department":
                    addDepartment();
                    break;

                case "View departments":
                    viewDepartment();
                    break;

                case "View employees":
                    viewEmployees();
                    break;

                case "Update employee":
                    updateEmployee();
                    break;

                case "Add employee":
                    addEmployee();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}
////// ADD DEPARTMENTS //////
function addDepartment() {
    inquirer
        .prompt([{
            name: "name",
            type: "list",
            message: "What type of building is it?",
            choices: [
                "Warehouse",
                "Field",
                "Office"
            ]
        }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    id: answer.id,
                    name: answer.name
                },
                function (err) {
                    if (err) throw err;
                    console.log(`You've added the ${answer.name} to the department!`);
                    // re-prompt the user for if they want to bid or post
                    trackEmployee();
                }
            )
        })
};
////// VIEW DEPARTMENTS //////
function viewDepartment() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        console.table(res);
        trackEmployee();
    });
}
function viewEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        console.table(res);
        trackEmployee();
    });
}
function viewAll() {
    var query = "SELECT * FROM department JOIN employee JOIN role";
    connection.query(query, function (err, res) {
        console.table(res);
        trackEmployee();
    });
}

//SELECT customer_id, cust_first_name, order_id, order_item_id, product_name
//FROM demo_customers
//INNER JOIN demo_orders on demo_orders.customer_id = demo_customers.customer_id
//WHERE cust_state= 'VA'
////// ADD EMPLOYEE //////
function addEmployee() {
    inquirer
        .prompt(
            [{
                name: "first",
                type: "input",
                message: "Whats their first name?"
            },
            {
                name: "last",
                type: "input",
                message: "Whats their last name?"
            },
            {
                name: "role",
                type: "input",
                message: "Whats their role id?"
            },
            {
                name: "manager",
                type: "input",
                message: "Whats their manager id?"
            }
            ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    id: answer.id,
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.role,
                    manager_id: answer.manager
                },
                function (err) {
                    if (err) throw err;
                    console.log("========================================================");
                    console.log("--------------------------------------------------------");
                    console.log(`You added ${answer.first} ${answer.last} as an Employee!`);
                    // re-prompt the user for if they want to bid or post
                    trackEmployee();
                }
            )
        })
};
////// UPDATE EMPLOYEE //////
function updateEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    }
                },
                {
                    name: "bid",
                    type: "input",
                    message: "How much would you like to bid?"
                }
            ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].name === answer.choice) {
                        chosenItem = results[i];
                    }
                }

                // determine if bid was high enough

            });
    })
};