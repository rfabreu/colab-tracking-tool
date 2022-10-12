INSERT INTO departments (name)
VALUES
  ('International Relations'),
  ('Engineering'),
  ('Administrative'),
  ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Sales Lead', 120000, 1),
  ('Software Engineer', 180000, 2), 
  ('Customer Experience', 42000, 1),
  ('Lawyer', 200000, 4),
  ('Accountant', 160000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Tom', 'Stifler', 1, NULL),
  ('Jerry', 'Browne', 2, 1),
  ('Barbara', 'Jensen', 3, 1),
  ('Sophie', 'Palsen', 4, NULL),
  ('Finch', 'Win', 4, 4),
  ('Brian', 'Stark', 5, 4);
 