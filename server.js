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
  // SQL Query to select all data from departments
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

// Function to view all Roles
function viewRoles() {
  // Need to join the department and role tables for the SQL Query
  const sql = `SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id;`;
  db.query(sql, (err, res) => {
    if (err) {
      res.status(400).json({ error: err.message});
      return;
    }
    console.table(res);
    init();
  });
};

// Function to view all Employees
function viewEmployees() {
  const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id';
  db.query(sql, (err, res) => {
    if (err) {
      res.status(400).json({ error: err.message});
      return;
    }
    console.table(res);
    init();
  });
};

// Function to add a department, uses Inquirer to prompt for data to add
function addDepartment() {
  inquirer.prompt([
    {
      name: 'department',
      type: 'input',
      message: 'Enter a new department',
    },
  ])
  .then(response => {
    const sql = 'INSERT INTO department (id, name) VALUES (?)';
    db.query(sql, [response.department], (err, res) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log('Department has been added.');
      init();
    });
  });
};

// Function to add a Role
function addRole() {

  const departmentNames = db.query('SELECT id, name FROM department');

  inquirer.prompt([
    {
      name: 'role',
      type: 'input',
      message: 'Enter the new role'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Enter the salary for this role'
    },
    {
      name: 'department',
      type: 'list',
      message: 'Select which department this role is in',
      choices: departmentNames,
    }
  ]).then(response => {
    const departmentId = departmentNames[response.department];
    const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)' [response.role, response.salary, departmentId];
    db.query(sql, (err, res) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log('Role has been added.');
      init();
    });
  });
};

// Function to add an Employee
function addEmployee() {

  const roleNames = db.query('SELECT id, title FROM role');
  const managerNames = db.query('SELECT id, first_name, last_name, manger_id FROM employee');
  inquirer.prompt([
    {
      name: 'firstName',
      type: 'input',
      message: 'Enter the first name'
    },
    {
      name: 'lastName',
      type: 'input',
      message: 'Enter the last name'
    },
    {
      name: 'role',
      type: 'list',
      message: 'Select the role in the company',
      choices: roleNames,
    },
    {
      name: 'manager',
      type: 'list',
      message: 'Select the manager for this employee',
      choices: managerNames,
    }
  ]).then(response => {
    const roleId = roleNames[response.role];
    const managerId = managerNames[response.manager];
    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)' [response.firstName, response.lastName, roleId, managerId];
    db.query(sql, (err, res) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log('Employee has been added.');
      init();
    });
  });
};

// Function to update an Employee role
function updateEmployeeRole() {

  const employees = db.query('SELECT * FROM employee');
  const roles = db.query('SELECT * FROM role');
  
  inquirer.prompt([
    {
      name: 'employee',
      type: 'list',
      message: 'Select the employee whose role you want to update',
      choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
    },
    {
      name: 'role',
      type: 'list',
      message: 'Select the new role for the employee',
      choices: roles.map(role => ({ name: role.title, value: role.id })),
    },
  ]).then(response => {
    const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
    db.query(sql, [response.role, response.employee], (err, res) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log('Employee role has been updated.');
      init();
    });
  });
};
