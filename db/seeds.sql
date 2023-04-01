INSERT INTO department (id, name) VALUES (1, 'Management'), (2, 'Sales'), (3, 'Accounting');

INSERT INTO role (id, title, salary, department_id) VALUES (1, 'Branch Manager', 60000, 1), (2, 'Salesman', 50000, 2), (3, 'Accountant', 80000, 3);
    
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (1, 'Zach', 'Teller', 1, 1), (2, 'Nathan', 'Foryou', 2, NULL), (3, 'John', 'Anytemp', 3, NULL);