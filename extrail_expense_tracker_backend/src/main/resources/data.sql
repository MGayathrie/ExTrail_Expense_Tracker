-- Seed data for ExTrail Expense Tracker
-- NOTE: These inserts assume a fresh database. If re-running frequently,
-- clear the tables first or convert to idempotent upserts for your DB.

-- Roles
INSERT INTO ext_roles (role_id, role_name) VALUES
  (1, 'USER'),
  (2, 'ADMIN');

-- Users (password = "password" for both, BCrypt hash)
-- Hash: $2a$10$7EqJtq98hPqEX7fNZaFWoO.k6bXo8XOSY67ymNEcGqPrIJ5/I2GLa
INSERT INTO ext_users (user_id, username, email, password_hash, phone, is_deactivated, created_at) VALUES
  (1, 'alice', 'alice@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.k6bXo8XOSY67ymNEcGqPrIJ5/I2GLa', '+10000000001', FALSE, CURRENT_TIMESTAMP),
  (2, 'bob',   'bob@example.com',   '$2a$10$7EqJtq98hPqEX7fNZaFWoO.k6bXo8XOSY67ymNEcGqPrIJ5/I2GLa', '+10000000002', FALSE, CURRENT_TIMESTAMP);

-- User Roles
INSERT INTO ext_user_roles (user_id, role_id) VALUES
  (1, 1), -- alice -> USER
  (2, 1), -- bob   -> USER
  (2, 2); -- bob   -> ADMIN

-- Accounts
INSERT INTO ext_accounts (account_id, user_id, is_archived, account_type, account_name, account_balance, created_at) VALUES
  (1, 1, FALSE, 'cash', 'Alice Cash',    1200.00, CURRENT_TIMESTAMP),
  (2, 2, FALSE, 'bank', 'Bob Checking',  5000.00, CURRENT_TIMESTAMP),
  (3, 2, FALSE, 'card', 'Bob Credit',       0.00, CURRENT_TIMESTAMP);

-- Categories (global and user scoped)
INSERT INTO ext_categories (category_id, category_name, description, category_type, scope, owner_user_id, created_at, updated_at) VALUES
  (1, 'Salary',     'Monthly salary',      'income',  'global', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Groceries',  'Household groceries', 'expense', 'global', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'Dining',     'Eating out',          'expense', 'user',      1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'Freelance',  'Side income',         'income',  'user',      2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Budgets (overall + category-specific)
INSERT INTO ext_budgets (budget_id, user_id, budget_name, limit_amount, category_id, created_at) VALUES
  (1, 1, 'Overall Budget', 2000.00, NULL, CURRENT_TIMESTAMP),
  (2, 1, 'Groceries Budget', 500.00, 2, CURRENT_TIMESTAMP);

-- Transactions
INSERT INTO ext_transactions (transaction_id, user_id, transfer_group_id, account_id, amount, transaction_type, description, date, category_id, created_at, updated_at) VALUES
  (1, 1, NULL, 1, 3000.00, 'income',  'Monthly salary',  TIMESTAMP '2024-01-10 09:00:00', 1, CURRENT_TIMESTAMP, NULL),
  (2, 1, NULL, 1,  120.50, 'expense', 'Groceries',       TIMESTAMP '2024-01-11 18:00:00', 2, CURRENT_TIMESTAMP, NULL),
  (3, 2, NULL, 2,  800.00, 'income',  'Freelance work',  TIMESTAMP '2024-01-12 14:30:00', 4, CURRENT_TIMESTAMP, NULL),
  (4, 2, NULL, 2,   65.25, 'expense', 'Groceries',       TIMESTAMP '2024-01-13 19:15:00', 2, CURRENT_TIMESTAMP, NULL);

