const db = require('../db/connections');
const cTable = require('console.table');
const inquirer = require('inquirer');

// prompts inquirer
const startInquirer = () => {
  inquirer.prompt([
    {
      // main menu 
      type: 'list',
      name: 'department',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'view all roles',
        'view all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'update employee role',
        'update employee manager',
        'delete a role',
        'delete an employee',
        'Delete a department',
        'Exit'
      ]
    }
  ])
  // functions for the selections
  .then(answers => {
    const nextPrompt = answers.department; 
    if(nextPrompt === "view all departments") {
      viewDepartments();
    }
    if(nextPrompt === "view all roles") {
      viewRoles();
    }
    if(nextPrompt === "view all employees") {
      viewEmployees();
    }
    if(nextPrompt === "Add a department") {
      addDepartment();
    }
    if(nextPrompt === "Add a role") {
      addRole();
    }
    if(nextPrompt === "Add an employee") {
      addEmployee();
    }
    if(nextPrompt === "update employee role") {
      updateRole();
    }
    if(nextPrompt === "update employee manager") {
      updateManager();
    }
    if(nextPrompt === "delete a role") {
      deleteRole();
    }
    if(nextPrompt === "delete an employee") {
      deleteEmployee();
    }
    if(nextPrompt === "Delete a department") {
      deleteDepartment();
    }
    if(nextPrompt === "Exit") {
      process.exit();
    };
  })
};

// view all departments
const viewDepartments = () => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, rows) => {
    if(err) {
      throw err;
    }
    console.log('\n');
    console.table(rows);
    return startInquirer();
  });
}

// view all roles
const viewRoles = () => {
  const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department
  FROM roles
  LEFT JOIN departments ON roles.department_id = department.id`;
  db.query(sql, (err, rows) => {
    if(err) {
      throw err;
    }
    console.log('\n');
    console.table(rows);
    return startInquirer();
  });
}

// view all employees
const viewEmployees = () => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees manager ON manager.id = employees.manager_id`;
  db.query(sql, (err, rows) => {
    if(err) {
      throw err;
    }
    console.log('\n');
    console.table(rows);
    return startInquirer();
  });
}