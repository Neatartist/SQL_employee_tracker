USE employee_db; 
INSERT INTO roles (title, salary, role_id)
VALUES
("sales person", 60000, 1),
("sales lead", 70000, 1),
("lead engineer", 70000, 2),
("software engineer", 60000, 2),
("accountant", 60000, 3),
("legal team lead", 75000, 4),
("lawyer", 55000, 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
("John", "Doe", 1),
("Mike", "Chan", 1),
("Ashley", "Rodriguez", 2),
("Kevin", "Tupik", 2),
("Malia", "Brown", 3),
("Sarah", "Lourd", 4),
("Tom", "Allen", 4);

INSERT INTO departments (name)
VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal");