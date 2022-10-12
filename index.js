const inquirer = require("inquirer");
const db = require("./config/connection");
const table = require("console.table");
const Database = require('./lib/Database')

const viewDep = async () => {
    const { departments } = await Database.getDepartments();
    console.table(departments);
    userPrompts();
};

const viewRoles = async function () {
    const { roles } = await Database.getRoles();
    console.table(roles);
    userPrompts();
};

const viewCollaborators = async function () {
    const { employees } = await Database.returnEmployees();
    console.table(employees);
    userPrompts();
};

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter the name of the department you want to add.",
            validate: (departmentInput) => {
                if (departmentInput) {
                    return true;
                } else {
                    console.log(
                        "You must provide the name of the department before continuing."
                    );
                    return false;
                }
            },
        }
    ]).then(data => {
        Database.addDepartmentQuery(data.name)
        userPrompts();
    })
};

function addRole() {
    const depNames = Database.getDepartmentNames();
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter the title for the role you are adding.",
            validate: (titleInput) => {
                if (titleInput) {
                    return true;
                } else {
                    console.log(
                        "You must provide a title for the role before continuing.");
                    return false;
                }
            },
        },
        {
            type: "input",
            name: "salary",
            message: "Please enter the salary for this position.",
            validate: (salaryInput) => {
                if (salaryInput) {
                    return true;
                } else {
                    console.log("You must enter the salary of this role before proceeding.");
                    return false;
                }
            },
        },
        {
            type: "list",
            name: "department_option",
            message: "Select the department to which the new role belongs.",
            choices: depNames
        }
    ]).then(data => {
        Database.addRoleQuery(data.title, data.salary, data.departmentId)
        userPrompts();
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message:
                "Provide the first name of the employee you are adding.",
            validate: (firstNameInput) => {
                if (firstNameInput) {
                    return true;
                } else {
                    console.log(
                        "You must enter a valid first name for the employee you are adding before continuing."
                    );
                    return false;
                }
            },
        },
        {
            type: "input",
            name: "last_name",
            message:
                "Provide the last name of the employee you are adding.",
            validate: (lastNameInput) => {
                if (lastNameInput) {
                    return true;
                } else {
                    console.log(
                        "You must enter a valid last name for the emloyee you are adding before continuing."
                    );
                    return false;
                }
            },
        },
        {
            type: "list",
            name: "role_option",
            message: "Select a role to assign to the new employee.",
            choices: Database.getRoleNames()
        },
        {
            type: "confirm",
            name: "confirmManager",
            message: "Does this employee report to a manager?",
            default: false
        }
    ]).then(data => {
        Database.addNewEmployeeQuery(data.first_name, data.last_name, data.role_option);
        if (confirmManager) {
            addEmployeeManager();
        }
        else {
            userPrompts();
        }
    })
    console.log(Database.getRoleNames());
};

function addEmployeeManager() {
    inquirer.prompt([
        {
            type: "list",
            name: "employee_option",
            message: "Select the name of the manager the new employee will report to.",
            choices: Database.getEmployeeNames()
        }
    ]).then(data => {
        Database.addEmployeeManagerQuery(data.employee_option, data.lastId)
        userPrompts();
    })
};

function updateEmployee() {
    inquirer.prompt([
        {
            type: "list",
            name: "employee_option",
            message: "Select the name of the collaborator you are updating.",
            choices: Database.getEmployeeNames()
        },
        {
            type: "list",
            name: "role_option",
            message: "Select the new role for this collaborator.",
            choices: Database.getRoleNames()
        }
    ]).then(data => {
        Database.updateCollaboratorRoleQuery(data.role_option, data.employee_option);
        choosePrompt();
    })
};

function showEmployeesbyManager() {
    inquirer.prompt([
        {
            type: "list",
            name: "manager_option",
            message: "Select a manager to view the collaborators they oversee.",
            choices: Database.getManagerNames()
        }
    ]).then(data => {
        console.table(data.manager_option);
        userPrompts();
    })
    console.table(employeesByManager);
    userPrompts();
};

function userPrompts() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Select from the following actions:",
            choices: [
                "View Departments",
                "Add Department",
                "View Roles",
                "Add Role",
                "View Employees",
                "Add Employee",
                "Update Employee Role",
                "Sort Employees by Manager"
            ],
        }
    ]).then((answers) => {
        console.log(answers.action);
        switch (answers.action) {
            case "View Departments":
                viewDep();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "View Employees":
                viewCollaborators();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "Sort Employees by Manager":
                showEmployeesbyManager();
                break;
            default: return;
        }
        return Database;
    });
}
userPrompts();



// Credits: code based on module lessons project work.
// Assisted by TA: Sachin Jhaveri
// University of Toronto coding Bootcamp