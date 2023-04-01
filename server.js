// Imports required modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'whitesox',
    database: 'company_db'
  },
  console.log(`Connected to the company database.`)
);

db.connect(err => {
  if (err) {
    console.log(err)
  }
  // CALL FUNCTION TO START INQUIRER once connected
  init();
});

// Prompts for Inquirer
const questions = [
  {
    name: 'questions',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
    ],
  }
];

// Starts the prompts and calls a function based on the selection
function init() {
  inquirer
    .prompt(questions)
    .then(response => {
      if (response.questions === 'View all departments') {
        viewDepartments();
      } else if (response.questions === 'View all roles') {
        viewRoles();
      } else if (response.questions === 'View all employees') {
        viewEmployees();
      } else if (response.questions === 'Add a department') {
        addDepartment();
      } else if (response.questions === 'Add a role') {
        addRole();
      } else if (response.questions === 'Add an employee') {
        addEmployee();
      } else if (response.questions === 'Update an employee role') {
        updateEmployeeRole();
      } else {
        db.end();
      }
    });
};

function viewDepartments() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, res) => {
    if (err) {
      res.status(400).json({ error: err.message});
      return;
    }
    console.table(res);
    init();
  });
};

// Need to join the department and role tables for the SQL Query
function viewRoles() {
  const sql = `SELECT r.id, r.title, d.name AS department, r.salary FROM role r JOIN department d ON r.department_id = d.id`;
  db.query(sql, (err, res) => {
    if (err) {
      res.status(400).json({ error: err.message});
      return;
    }
    console.table(res);
    init();
  });
};