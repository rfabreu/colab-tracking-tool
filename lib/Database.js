const db = require('../config/connection');

function getDepartments() {
    return new Promise((resolve, reject) => {
        db.query("SELECT name, id FROM departments", (err, result) => {
            if (err) throw err;
            resolve({ departments: result });
        })
    })
};

function getDepartmentNames() {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM departments", (err, result) => {
            if (err) throw err;
            let newResult = [];
            result.forEach((department) => {
                newResult.push(department);
            });
            resolve({ departmentNames: newResult });
        })
    })
};

function getRoleNames() {
    return new Promise((resolve, reject) => {
        db.query("SELECT title FROM roles", (err, result) => {
            if (err) throw err;
            let newResult = [];
            result.forEach((role) => {
                newResult.push(role.title);
            });
            resolve({ roleNames: newResult });
        })
    })
};

function getEmployeeNames() {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT CONCAT(first_name, ' ', last_name) AS name
            FROM employees;`, (err, result) => {
            if (err) throw err;
            let newResult = [];
            result.forEach((employee) => {
                newResult.push(employee.name);
            });
            resolve({ employeeNames: newResult });
        })
    })
};

function getManagerNames() {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT CONCAT(first_name, ' ', last_name) AS name
            FROM employees WHERE manager_id IS NULL;`, (err, result) => {
            if (err) throw err;
            let newResult = [];
            result.forEach((manager) => {
                newResult.push(manager.name);
            });
            resolve({ managerNames: newResult });
        })
    })
};

function addDepartmentQuery(name) {
    return new Promise((resolve, reject) => {
        const params = [name];
        db.query(`
            INSERT INTO departments (name)
            VALUE (?)`, params, (err, result) => {
            if (err) throw err;
            resolve();
        })
    })
};

function getRoles() {
    return new Promise((resolve, reject) => {
        db.query("SELECT roles.title, roles.id, departments.name AS department, roles.salary FROM roles LEFT JOIN departments ON departments.id = roles.department_id;", (err, result) => {
            if (err) throw err;
            resolve({ roles: result });
        })
    })
};

function getDepartmentId(department_option) {
    const params = [department_option];
    return new Promise((resolve, reject) => {
        db.query("SELECT id FROM departments WHERE name = ?;", params, (err, result) => {
            if (err) throw err;
            let newResult = [];
            result.forEach((department) => {
                newResult.push(department.id);
            });
            resolve({ departmentId: newResult });
        })
    })
};

function getRoleId(role_option) {
    const params = [role_option];
    return new Promise((resolve, reject) => {
        db.query("SELECT id FROM roles WHERE title = ?;", params, (err, result) => {
            if (err) throw err;
            let newResult = [];
            result.forEach((role) => {
                newResult.push(role.id);
            });
            resolve({ roleId: newResult });
        })
    })
};

function getEmployeeId(employee_option) {
    const params = [employee_option];
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT id 
            FROM employees 
            WHERE CONCAT(first_name, ' ', last_name) = ?;`, params, (err, result) => {
            if (err) throw err;
            let newResult = [];
            result.forEach((employee) => {
                newResult.push(employee.id);
            });
            resolve({ employeeId: newResult });
        })
    })
};

function addRoleQuery(title, salary, departmentId) {
    return new Promise((resolve, reject) => {
        const params = [title, salary, departmentId];
        db.query(`
            INSERT INTO roles (title, salary, department_id)
            VALUE (?,?,?)`, params, (err, result) => {
            if (err) throw err;
            resolve();
        })
    })
};

function addNewEmployeeQuery(first_name, last_name, roleId, manager_Id) {
    return new Promise((resolve, reject) => {
        const params = [first_name, last_name, roleId, manager_Id];
        db.query(`
            INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUE (?,?,?,?)`, params, (err, result) => {
            if (err) throw err;
            resolve();
        })
    })
};

function returnLastEmployee() {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT id 
            FROM employees 
            ORDER BY ID DESC LIMIT 1`, (err, result) => {
            if (err) throw err;
            let newResult = [];
            result.forEach((employee) => {
                newResult.push(employee.id);
            });
            resolve({ lastId: newResult });
        })
    })
};

function addEmployeeManagerQuery(employeeId, lastId) {
    return new Promise((resolve, reject) => {
        const params = [employeeId, lastId];
        db.query(`
            UPDATE employees 
            SET manager_id = ?
            WHERE id = ?;`, params, (err, result) => {
            if (err) throw err;
            resolve();
        })
    })
};

function returnEmployees() {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
            FROM employees 
            LEFT JOIN roles 
            ON roles.id = employees.role_id
            LEFT JOIN departments
            ON departments.id = roles.department_id
            LEFT JOIN employees manager 
            ON manager.id = employees.manager_id;`, (err, result) => {
            if (err) throw err;
            resolve({ employees: result });
        })
    })
};

function updateCollaboratorRoleQuery(roleId, employeeId) {
    return new Promise((resolve, reject) => {
        const params = [roleId, employeeId]
        db.query(`
            UPDATE employees
            SET role_id = ?
            WHERE id = ?;`, params, (err, result) => {
            if (err) throw err;
            resolve({ updatedEmployee: result });
        })
    })
};

function showEmployeesByManager(employeeId) {
    return new Promise((resolve, reject) => {
        const params = [employeeId]
        db.query(`
            SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary 
            FROM employees 
            LEFT JOIN roles 
            ON roles.id = employees.role_id
            LEFT JOIN departments
            ON departments.id = roles.department_id
            WHERE employees.manager_id = ?;`, params, (err, result) => {
            if (err) throw err;
            resolve({ employeesByManager: result });
        })
    })
};

function getEmployeesInfo() {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT id, first_name, last_name 
            FROM employees 
            `, (err, result) => {
            if (err) throw err;
            let newResult = [];
            result.forEach((employee) => {
                newResult.push(employee);
            });
            resolve({ lastId: newResult });
        })
    })
};


module.exports = { getDepartments, getDepartmentNames, getRoleNames, getEmployeeNames, getManagerNames, addDepartmentQuery, getRoles, getDepartmentId, getRoleId, getEmployeeId, addRoleQuery, addNewEmployeeQuery, returnLastEmployee, addEmployeeManagerQuery, returnEmployees, updateCollaboratorRoleQuery, showEmployeesByManager, getEmployeesInfo };

// credits: database code based on module lessons project