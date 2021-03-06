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

    trackEmployee();

});
////// START INQUIRER //////
function trackEmployee() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add department? Add Employee? Add Role?",
                "View departments",
                "View employees",
                "View roles",
                "View all",
                "Update employee",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add department? Add Employee? Add Role?":
                    addAll();
                    break;

                case "View departments":
                    viewDepartment();
                    break;

                case "View employees":
                    viewEmployees();
                    break;

                case "View roles":
                    viewRoles();
                    break;

                case "View all":
                    viewAll();
                    break;

                case "Update employee":
                    updateEmployee();
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
        .prompt(
            {
                name: "first",
                type: "input",
                message: "Whats the name of the department?"
            })
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.first
                },
                function (err) {
                    if (err) throw err;
                    console.log("========================================================");
                    console.log("--------------------------------------------------------");
                    console.log(`You added ${answer.first} to the department!`);
                    // re-prompt the user for if they want to bid or post
                    trackEmployee();
                }
            )
        })
};
function addAll() {
    inquirer
        .prompt({
            name: "name",
            type: "list",
            message: "What would you like to add?",
            choices: [
                "Employee",
                "Role",
                "Department",
                "exit"
            ]
        }
        )
        .then(function (answer) {

            switch (answer.name) {
                case "Employee":
                    addEmployee();
                    break;

                case "Department":
                    addDepartment();
                    break;

                case "Role":
                    addRole();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}
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
function viewRoles() {
    var query = "SELECT * FROM roleE";
    connection.query(query, function (err, res) {
        console.table(res);
        trackEmployee();
    });
}
function viewAll() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, roleE.title, roleE.salary FROM employee INNER JOIN roleE ON employee.role_id=roleE.id";
    connection.query(query, function (err, res) {
        if (err) {
            throw err;
        }
        console.table(res);
        trackEmployee();
    });
}
function addRole() {
    inquirer
        .prompt(
            [{
                name: "title",
                type: "input",
                message: "Whats their Title?"
            },
            {
                name: "salary",
                type: "input",
                message: "Whats their salary?"
            },
            {
                name: "departmentID",
                type: "input",
                message: "Whats their department?"
            }
            ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO roleE SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentID,

                },
                function (err) {
                    if (err) throw err;
                    console.log("========================================================");
                    console.log("--------------------------------------------------------");
                    console.log(`You added ${answer.title} ${answer.salary} ${answer.departmentID} TO YOUR TABLE`);
                    // re-prompt the user for if they want to bid or post
                    trackEmployee();
                }
            )
        })
};
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
let employeeArray = []; /// employee
let employeeObjects = []; // emp objects
let roleArray = []; // role
populateEmp();
populateRole();
function populateEmp() {
    employeeArray = [];
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            var fullName = `${results[i].id} ${results[i].first_name} ${results[i].last_name}`
            employeeArray.push(fullName);
            employeeObjects.push(results);
        }
    })
}
function populateRole() {
    roleArray = [];
    connection.query("SELECT * FROM roleE", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            var rolesP = `${results[i].id} ${results[i].title}`;
            roleArray.push(rolesP);
        }
    })
}
function updateEmployee() {

    inquirer
        .prompt([
            {
                name: "choice",
                type: "list",
                choices: employeeArray
            }

        ])
        .then(function (answer) {
            connection.query("SELECT * FROM roleE", function (err, roleList) {
                if (err) throw err;
                inquirer
                    .prompt([
                        {
                            name: "firstName",
                            type: "value",
                            message: "What is the new First Name?"
                        },
                        {
                            name: "lastName",
                            type: "value",
                            message: "What is the new Last Name?"
                        },
                        {
                            name: "Roll",
                            type: "list",
                            message: "What is the new Role?",
                            // THIS NEEDS MORE LOGIC TO GET THE ID FROM THE CHOICE
                            choices: roleArray
                        }
                    ]).then(function (updated) {
                        let x = parseInt(updated.Roll.split(" ")[0]);
                        let nameID = parseInt(answer.choice.split(" ")[0]);
                        var query = `UPDATE employee set first_name="${updated.firstName}",last_name="${updated.lastName}",role_id = ${x} WHERE id=${nameID}`;
                        connection.query(query, function (err, res) {
                            if (err) throw err;

                            trackEmployee();
                        })
                    })
            });
        });

};
