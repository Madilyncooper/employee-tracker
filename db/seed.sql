INSERT INTO 
department (name) 

VALUES
('HR'),
('Sales'),
('Accounting'),
('Warehouse');

INSERT INTO 
role (title, salary, department_id) 

VALUES
('HR Rep', 88000.00, 1),
('Sales Rep', 98000.00, 2),
('Accountant', 100000.00, 3),
('Warehouse Opp.', 50000.00, 4);

INSERT INTO 
employee (first_name, last_name, role_id, manager_id) 

VALUES

('Jim', 'Halpert', 2, 2),
('Dwight', 'Shrewt', 2, null),
('Kelly', 'Kapoor', 1, null),
('Daryl', 'Philbert', 4, null),
('Angela', 'Martin', 3, 3);