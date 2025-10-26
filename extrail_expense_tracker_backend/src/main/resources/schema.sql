-- Schema for ExTrail Expense Tracker (MySQL 8+)
-- Creates tables for Users, Roles, Accounts, Categories, Budgets, Transactions
-- and the join table for user roles.

-- Ensure database uses InnoDB + UTF8MB4
SET NAMES utf8mb4;

-- ROLES
CREATE TABLE IF NOT EXISTS ext_roles (
  role_id   INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- USERS
CREATE TABLE IF NOT EXISTS ext_users (
  user_id         INT AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(100) NOT NULL UNIQUE,
  email           VARCHAR(200) NOT NULL UNIQUE,
  password_hash   VARCHAR(200) NOT NULL,
  phone           VARCHAR(16)  NOT NULL UNIQUE,
  is_deactivated  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- USER <-> ROLE join
CREATE TABLE IF NOT EXISTS ext_user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user
    FOREIGN KEY (user_id) REFERENCES ext_users(user_id)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_user_roles_role
    FOREIGN KEY (role_id) REFERENCES ext_roles(role_id)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ACCOUNTS
CREATE TABLE IF NOT EXISTS ext_accounts (
  account_id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  is_archived     BOOLEAN     NOT NULL DEFAULT FALSE,
  account_type    VARCHAR(10) NOT NULL,  -- cash/card/bank
  account_name    VARCHAR(100) NOT NULL,
  account_balance DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_accounts_user
    FOREIGN KEY (user_id) REFERENCES ext_users(user_id)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_accounts_user_id ON ext_accounts(user_id);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS ext_categories (
  category_id   INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  description   VARCHAR(100),
  category_type VARCHAR(10)  NOT NULL, -- income/expense
  scope         VARCHAR(10)  NOT NULL, -- global/user
  owner_user_id INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_owner
    FOREIGN KEY (owner_user_id) REFERENCES ext_users(user_id)
      ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_categories_owner ON ext_categories(owner_user_id);

-- BUDGETS
CREATE TABLE IF NOT EXISTS ext_budgets (
  budget_id    INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  budget_name  VARCHAR(120) NOT NULL,
  limit_amount DECIMAL(18,2) NOT NULL,
  category_id  INT NULL, -- null means overall budget
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_budgets_user
    FOREIGN KEY (user_id) REFERENCES ext_users(user_id)
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_budgets_category
    FOREIGN KEY (category_id) REFERENCES ext_categories(category_id)
      ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_budgets_user ON ext_budgets(user_id);
CREATE INDEX idx_budgets_category ON ext_budgets(category_id);

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS ext_transactions (
  transaction_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  transfer_group_id VARCHAR(26),
  account_id       INT NOT NULL,
  amount           DECIMAL(18,2) NOT NULL,
  transaction_type VARCHAR(7) NOT NULL, -- income/expense
  description      VARCHAR(500),
  date             DATETIME NOT NULL,
  category_id      INT NOT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tx_user
    FOREIGN KEY (user_id) REFERENCES ext_users(user_id)
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tx_account
    FOREIGN KEY (account_id) REFERENCES ext_accounts(account_id)
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tx_category
    FOREIGN KEY (category_id) REFERENCES ext_categories(category_id)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_tx_user ON ext_transactions(user_id);
CREATE INDEX idx_tx_account ON ext_transactions(account_id);
CREATE INDEX idx_tx_category ON ext_transactions(category_id);
