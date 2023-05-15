const inquirer = require('inquirer');
const util = require('util');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log(`Connected to the classlist_db database.`)
);

db.query = util.promisify(db.query);

async function viewAllEmployees() {
    let result = await db.query("Select employee.id AS employee_id, CONCAT(employee.first_name, ' ', employee.last_name) AS full_name, role.title, role.salary, employee.manager_id, department.name AS department_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;")
    console.table(result);
    return startManager();
};

async function viewAllRoles() {
    let result = await db.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;")
    console.table(result);
    return startManager();
};

async function viewAllDepartments() {
    let result = await db.query("SELECT * FROM department;")
    console.table(result);
    return startManager();
};

async function addEmployee() {
    let rolesArr = await db.query("SELECT id AS value, title AS name FROM role;");
    let managerArr = await db.query("SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee;")
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the new employee\'s first name?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the new employee\'s last name?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is their role?',
            choices: rolesArr,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the manager of this employee?',
            choices: managerArr,
        }
    ]).then((answers) => {

        async function add() {
            await db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);",
            [`${answers.firstName}`, `${answers.lastName}`, `${answers.role}`, `${answers.manager}`]);
            return startManager();
        }
        add();
    })
};

async function updateEmployee() {

    let employeeArr = await db.query("SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee;")
    let rolesArr = await db.query("SELECT id AS value, title AS name FROM role;")

    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee\'s role would you like to update?',
            choices: employeeArr,
        },
        {
            type: 'list',
            name: 'role',
            message: 'Which role do you want to assign to the selected employee?',
            choices: rolesArr,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is this employee\'s Manager?',
            choices: employeeArr,
        }

    ]).then((answers) => {
        async function update() {
            await db.query("UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?;",
            [`${answers.role}`, `${answers.manager}`, `${answers.employee}`]);
            
            return startManager();
        }
        update();
    })
};

async function addRole() {

    let departmentArr = await db.query("SELECT id AS value, name AS name FROM department;");

    inquirer.prompt([
        {
            type: 'input',
            name: 'newRole',
            message: 'What is the name of the Role?'
        },
        {
            type: 'input',
            name: 'newSalary',
            message: 'What is the salary of the Role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to?',
            choices: departmentArr,
        }

    ]).then((answers) => {
        async function roleAdded() {
            await db.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?);",
            [`${answers.newRole}`, `${answers.newSalary}`, `${answers.department}`]);
            return startManager();
        }
        roleAdded();
    })
};

async function addDepartment() {

    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'What is the name of the new Department?'
        }

    ]).then((answers) => {
        async function departmentAdded() {
            await db.query("INSERT INTO department (name) VALUES (?);",`${answers.newDepartment}`);
            return startManager();
        }
        departmentAdded();
    })
};

function startManager() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would would you like to do?',
            choices: ['View All Employees',
                'Add Employees',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department']
        }
    ]).then((answers) => {

        if (answers.start === 'View All Employees') {
            viewAllEmployees();
        }
        else if (answers.start === 'View All Roles') {
            viewAllRoles();
        }
        else if (answers.start === 'View All Departments') {
            viewAllDepartments();
        }
        else if (answers.start === 'Add Employees') {
            addEmployee();
        }
        else if (answers.start === 'Update Employee Role') {
            updateEmployee();
        }
        else if (answers.start === 'Add Role') {
            addRole();
        }
        else if (answers.start === 'Add Department') {
            addDepartment();
        }
    });
};

startManager();







