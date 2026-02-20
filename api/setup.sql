-- Run setup-credentials.sql first to create the database and user.

USE exodus40lite;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tokens (
    token CHAR(64) PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_data (
    user_id INT UNSIGNED NOT NULL,
    date_str CHAR(10) NOT NULL,
    items_json TEXT NOT NULL,
    note TEXT NOT NULL,
    updated_at BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, date_str),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
