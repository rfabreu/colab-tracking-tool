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
            message: "Enter a name for the new department:",
            validate: (departmentInput) => {
                if (departmentInput) {
                    return true;
                } else {
                    console.log(
                        "A new department must receive a name before you can continue."
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
    Database.getDepartmentNames()
    .then(depNames => {
        console.log(depNames);
        const departments = depNames.departmentNames.map(department => {
            return {name: department.name, value: department.id}
        })
        console.log(departments);
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter the title for the role you are adding:",
                validate: (titleInput) => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log(
                            "A role must receive a title before you can continue.");
                        return false;
                    }
                },
            },
            {
                type: "input",
                name: "salary",
                message: "Please enter the salary for this position:",
                validate: (salaryInput) => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log("A salary must be provided before you can continue.");
                        return false;
                    }
                },
            },
            {
                type: "list",
                name: "department_id",
                message: "Select the department to which the new role belongs:",
                choices: departments
            }
        ]).then(data => {
            console.log(data);
            Database.addRoleQuery(data.title, data.salary, data.department_id)
            userPrompts();
        })
    
    })
};

function addTeamMember() {
    Database.getRoles()
    .then(newMemberRole => {
        console.log(newMemberRole);
        Database.getEmployeesInfo()
        .then(employeeInfo => {
            console.log(employeeInfo);
            const roles = newMemberRole.roles.map(role => {
                return {name: role.title, value: role.id}
            })
            console.log(roles);
            inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message:
                        "Enter the first name of the member you are creating:",
                    // validate: (firstNameInput) => {
                    //     if (firstNameInput) {
                    //         return true;
                    //     } else {
                    //         console.log(
                    //             "You must enter a valid first name for the team member you are adding before continuing."
                    //         );
                    //         return false;
                    //     }
                    // },
                },
                {
                    type: "input",
                    name: "last_name",
                    message:
                        "Enter the second name of the member you are creating:",
                    // validate: (lastNameInput) => {
                    //     if (lastNameInput) {
                    //         return true;
                    //     } else {
                    //         console.log(
                    //             "You must enter a valid last name for the team member you are adding before continuing."
                    //         );
                    //         return false;
                    //     }
                    // },
                },
                {
                    type: "list",
                    name: "role_option",
                    message: "Select a role to assign to the new team member:",
                    choices: roles
                },
                {
                    type: "confirm",
                    name: "confirmManager",
                    message: "Does this collaborator report to a manager?",
                    default: false
                }
            ]).then(data => {
                Database.addNewEmployeeQuery(data.first_name, data.last_name, data.role_option);
                // if (confirmManager) {
                //     addMemberManager();
                // }
                // else {
                //     userPrompts();
                // }
                userPrompts();
                console.log(Database.getRoleNames());           
            })
        
        })
    })
};

function addMemberManager() {
    inquirer.prompt([
        {
            type: "list",
            name: "employee_option",
            message: "Select the manager the new team member will report to:",
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
            message: "Select the name of the collaborator you are updating:",
            choices: Database.getEmployeeNames()
        },
        {
            type: "list",
            name: "role_option",
            message: "Select the new role for this person:",
            choices: Database.getRoleNames()
        }
    ]).then(data => {
        Database.updateCollaboratorRoleQuery(data.role_option, data.employee_option);
        choosePrompt();
    })
};

function viewMembersbyManager() {
    inquirer.prompt([
        {
            type: "list",
            name: "manager_option",
            message: "Choose a manager to view the collaborators they oversee:",
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
                "Show Departments",
                "Create Department",
                "Show Roles",
                "Create Role",
                "Show Team Members",
                "Add New Team Member",
                "Update Collaborator's Role",
                "Sort Team Members by Manager"
            ],
        }
    ]).then((answers) => {
        console.log(answers.action);
        switch (answers.action) {
            case "Show Departments":
                viewDep();
                break;
            case "Create Department":
                addDepartment();
                break;
            case "Show Roles":
                viewRoles();
                break;
            case "Create Role":
                addRole();
                break;
            case "Show Team Members":
                viewCollaborators();
                break;
            case "Add New Team Member":
                addTeamMember();
                break;
            case "Update Collaborator's Role":
                updateEmployee();
                break;
            case "Sort Team Members by Manager":
                viewMembersbyManager();
                break;
            default: return;
        }
        return Database;
    });
}
userPrompts();



// Credits: code based on module lessons project work.
// Assisted by Sachin Jhaveri (TA) and Sean New (Tutor)
// University of Toronto coding Bootcamp