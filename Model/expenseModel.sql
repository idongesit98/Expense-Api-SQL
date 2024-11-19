Create DATABASE expense_db;
USE expense_db;

Create Table Users(
    id integer PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

Create Table Expense(
    id integer PRIMARY KEY AUTO_INCREMENT,
    user_id integer NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    categories ENUM('Groceries','Leisure','Utilities','Entertainment','Clothing','Health','Others'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
)