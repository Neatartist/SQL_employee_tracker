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
        'view employees by manager',
        'view employees by department',
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
    {
      if(nextPrompt === "view employees by manager") {
        viewEmployeesByManager();
      }
    }
    {
    if(nextPrompt === "view employees by department") {
        viewEmployeesByDepartment();
      }
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
// add a department 
const addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter a name');
          return false;
        };
      } 
    }
  ])
  .then(answer => {
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    const params = answer.name;
    db.query(sql, params, (err, rows) => {
      if(err) {
        throw err;
      }
      console.log('\n');
      console.log('Department added!');
      return viewDepartments();
    });
  });
}

// add a role
const addRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of the role?',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter a role');
          return false;
        };
      } 
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?',
      validate: salaryInput => {
        if (salaryInput) {
          return true;
        } else {
          console.log('Please enter a salary');
          return false;
        };
      } 
    }
  ])
  .then(answer => {
  const params = [answer.title, answer.salary];
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, rows) => {
    if(err) {
      throw err;
    }
    const departments = rows.map(({ id, name }) => ({
      name: name,
      value: id
    }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?',
        choices: departments
      }
    ])
    .then(departmentAnswer => {
      const department = departmentAnswer.department;
      params.push(department);
      const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
      db.query(sql, params, (err, rows) => {
        if(err) {
          throw err;
        }
        console.log('\n');
        console.log('Role added!');
        return viewRoles();
      });
    });
  });
  });
}

// add an employee
const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the first name of the employee?',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter a first name');
          return false;
        };
      } 
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the last name of the employee?',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter a last name');
          return false;
        };
      } 
    }
  ])
  .then(answer => {
    const params = [answer.first_name, answer.last_name];
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
      if(err) {
        throw err;
      }
      const roles = rows.map(({ id, title }) => ({
        name: title,
        value: id
      }));
      inquirer.prompt([
        {
          type: 'list',
          name: 'role',
          message: 'What is the role of the employee?',
          choices: roles
        }
      ])
      .then(roleAnswer => {
        const role = roleAnswer.role;
        params.push(role);
        const sql = `SELECT * FROM employees`;
        db.query(sql, (err, rows) => {
          if(err) {
            throw err;
          }
          const managers = rows.map(({ id, first_name, last_name }) => ({name: `${first_name} ${last_name}`,value: id}));
          managers.push({name: 'no manager', value: null});
          inquirer.prompt([
            {
              type: 'list',
              name: 'manager',
              message: 'Who is the manager of the employee?',
              choices: managers
            }
          ])
          .then(managerAnswer => {
            const manager = managerAnswer.manager;
            params.push(manager);
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            db.query(sql, params, (err, rows) => {
              if(err) {
                throw err;
              }
              console.log('\n');
              console.log('Employee added!');
              return viewEmployees();
            });
          });
        });
      });
    });
  });
}

// update an employee role
const updateEmployeeRole = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if(err) {
      throw err;
    }
    const employees = rows.map(({ id, first_name, last_name }) => ({name: `${first_name} ${last_name}`,value: id}));
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to update?',
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee;
      const sql = `SELECT * FROM roles`;
      db.query(sql, (err, rows) => {
        if(err) {
          throw err;
        }
        const roles = rows.map(({ id, title }) => ({name: title,value: id}));
        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: 'What is the new role of the employee?',
            choices: roles
          }
        ])
        .then(roleAnswer => {
          const role = roleAnswer.role;
          const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
          params.unshift(role);
          db.query(sql, params, (err, rows) => {
            if(err) {
              throw err;
            }
            console.log('\n');
            console.log('Employee role updated!');
            return viewEmployees();
          });
        });
      });
    });
  });
}

// update an employee manager
const updateEmployeeManager = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to update?',
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee;
      const params = [employee];
      const sql = `SELECT * FROM employees`;
      db.query(sql, (err, rows) => {
        if (err){
          throw err;
        }
        const managers = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
        managers.push({ name: 'no manager', value: null });
        inquirer.prompt([
          {
            type: 'list',
            name: 'manager',
            message: 'Who is the new manager of the employee?',
            choices: managers
          }
        ])
        .then(managerAnswer => {
          const manager = managerAnswer.manager;
          params.unshift(manager);
          const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
          db.query(sql, params, (err, rows) => {
            if (err) {
              throw err;
            }
            console.log('\n');
            console.log('Employee manager updated!');
            return viewEmployees();
          }
          );
        });
      });
    });
  });
};

// delete a department
const deleteDepartment = () => {
  const sql = `SELECT * FROM departments`
  db.query(sql, (err, rows) => {
    if (err){
      throw err;
    }
    const departments = rows.map(({ id, name }) => ({ name: name, value: id }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to delete?',
        choices: departments
      }
    ])
    .then(departmentAnswer => {
      const department = departmentAnswer.department;
      const sql = `DELETE FROM departments WHERE id = ?`;
      db.query(sql, department, (err, rows) => {
        if (err) {
          throw err;
        }
        console.log('\n');
        console.log('Department deleted!');
        return viewDepartments();
      });
    }
    );
  });
};

// delete a role
const deleteRole = () => {
  const sql = `SELECT * FROM roles`
  db.query(sql, (err, rows) => {
    if (err){
      throw err;
    }
    const roles = rows.map(({ id, title }) => ({ name: title, value: id }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: 'Which role would you like to delete?',
        choices: roles
      }
    ])
    .then(roleAnswer => {
      const role = roleAnswer.role;
      const sql = `DELETE FROM roles WHERE id = ?`;
      db.query(sql, role, (err, rows) => {
        if (err) {
          throw err;
        }
        console.log('\n');
        console.log('Role deleted!');
        return viewRoles();
      });
    }
    );
  });
}

// delete an employee
const deleteEmployee = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err){
      throw err;
    }
    const employees = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to delete?',
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee;
      const params = employee;
      const sql = `DELETE FROM employees WHERE id = ?`;
      db.query(sql, params, (err, rows) => {
        if (err) {
          throw err;
        }
        console.log('\n');
        console.log('Employee deleted!');
        return viewEmployees();
      });
    }
    );
  });
};

// view employee by manager 
const viewEmployeesByManager = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err){
      throw err;
    }
    const employees = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Which manager's employees would you like to view?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const manager = employeeAnswer.employee;
      const params = [manager];
      const sql = `SELECT first_name, last_name, id FROM employees`
      db.query(sql, params, (err, rows) => {
        if (err){
          throw err;
        }
      if (rows.length === 0){
        console.log('this employee does not manager anyone');
        return startInquirer();
      }
      console.log('\n');
      console.table(rows);
      return startInquirer();
      });
    });
  });
};

// view employee by department
const viewEmployeesByDepartment = () => {
  const sql = `SELECT * FROM departments`
  db.query(sql, (err, rows) => {
    if (err){
      throw err;
    }
    const departments = rows.map(({ id, name }) => ({ name: name, value: id }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which department would you like to view?',
        choices: departments
      }
    ])
    .then(employeeAnswer => {
      const department = employeeAnswer.employee;
      const params = [department];
      const sql = `SELECT first_name, last_name, id FROM employees`
      db.query(sql, params, (err, rows) => {
        if (err){
          throw err;
        }
        console.log('\n');
        console.table(rows);
        return startInquirer();
      });
    });
  });
}

module.exports = startInquirer;