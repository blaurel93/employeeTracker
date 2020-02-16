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

  connection.connect(function(err) {
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
          "Find songs by artist",
          "Find all artists who appear more than once",
          "Find data within a specific range",
          "Search for a specific song",
          "exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Find songs by artist":
          artistSearch();
          break;
  
        case "Find all artists who appear more than once":
          multiSearch();
          break;
  
        case "Find data within a specific range":
          rangeSearch();
          break;
  
        case "Search for a specific song":
          songSearch();
          break;
  
        case "exit":
          connection.end();
          break;
        }
      });
  }
