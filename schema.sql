-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS employees_db;

-- Created the DB "wizard_schools_db" (only works on local connections)
CREATE DATABASE employees_db;

-- Use the DB wizard_schools_db for all the rest of the script
USE employees_db;

-- Created the table "schools"
CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);
CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY(id)
);
CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY(id)
);