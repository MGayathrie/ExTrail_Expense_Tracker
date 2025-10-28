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




-- Global Income Categories
INSERT INTO ext_categories (category_name, description, category_type, scope, owner_user_id, created_at, updated_at)
VALUES 
('Salary', 'Monthly salary income', 'income', 'global', NULL, NOW(), NOW()),
('Freelance', 'Freelance project income', 'income', 'global', NULL, NOW(), NOW()),
('Investment Returns', 'Stock dividends', 'income', 'global', NULL, NOW(), NOW()),
('Bonus', 'Performance bonuses', 'income', 'global', NULL, NOW(), NOW()),
('Food', 'Groceries and dining', 'expense', 'global', NULL, NOW(), NOW()),
('Transportation', 'Gas, transport', 'expense', 'global', NULL, NOW(), NOW()),
('Housing', 'Rent, utilities', 'expense', 'global', NULL, NOW(), NOW()),
('Entertainment', 'Movies, hobbies', 'expense', 'global', NULL, NOW(), NOW()),
('Shopping', 'Clothing, electronics', 'expense', 'global', NULL, NOW(), NOW()),
('Healthcare', 'Medical expenses', 'expense', 'global', NULL, NOW(), NOW()),
('Education', 'Courses, books', 'expense', 'global', NULL, NOW(), NOW()),
('Utilities', 'Internet, phone', 'expense', 'global', NULL, NOW(), NOW());

-- -- -- -- -- -- -- -- -- --
INSERT INTO ext_accounts (account_id, user_id, is_archived, account_type, account_name, account_balance, created_at) VALUES
  (1,1, FALSE, 'cash', 'Wallet',    3500.00, CURRENT_TIMESTAMP),
  (2,1, FALSE, 'bank', 'HDFC Savings',  45000.00, CURRENT_TIMESTAMP),
  (3,1, FALSE, 'card', 'HDFC Credit Card', 25000.00, CURRENT_TIMESTAMP);
-- -- -- -- -- -- -- -- -- -- -- 
-- Paul's Accounts
INSERT INTO ext_accounts (user_id, is_archived, account_type, account_name, account_balance, created_at)
SELECT user_id, 0, 'bank', 'HDFC Savings', 45000.00, NOW()
FROM ext_users WHERE user_name = 'paul'
UNION ALL
SELECT user_id, 0, 'bank', 'ICICI Current', 23500.50, NOW()
FROM ext_users WHERE user_name = 'paul'
UNION ALL
SELECT user_id, 0, 'card', 'HDFC Credit Card', 2500.00, NOW()
FROM ext_users WHERE user_name = 'paul'
UNION ALL
SELECT user_id, 0, 'cash', 'Wallet', 3500.00, NOW()
FROM ext_users WHERE user_name = 'paul'
UNION ALL
SELECT user_id, 0, 'bank', 'SBI Investment', 85000.00, NOW()
FROM ext_users WHERE user_name = 'paul';

-- Manikandan's Accounts
INSERT INTO ext_accounts (user_id, is_archived, account_type, account_name, account_balance, created_at)
SELECT user_id, 0, 'bank', 'HDFC Savings', 32000.00, NOW()
FROM ext_users WHERE user_name = 'manikandan'
UNION ALL
SELECT user_id, 0, 'bank', 'ICICI Salary', 18500.00, NOW()
FROM ext_users WHERE user_name = 'manikandan'
UNION ALL
SELECT user_id, 0, 'card', 'SBI Credit Card', 1800.00, NOW()
FROM ext_users WHERE user_name = 'manikandan'
UNION ALL
SELECT user_id, 0, 'cash', 'Cash in Hand', 2200.00, NOW()
FROM ext_users WHERE user_name = 'manikandan';

-- Gayathrie's Accounts
INSERT INTO ext_accounts (user_id, is_archived, account_type, account_name, account_balance, created_at)
SELECT user_id, 0, 'bank', 'ICICI Savings', 56000.00, NOW()
FROM ext_users WHERE user_name = 'gayathrie'
UNION ALL
SELECT user_id, 0, 'bank', 'HDFC Current', 28300.00, NOW()
FROM ext_users WHERE user_name = 'gayathrie'
UNION ALL
SELECT user_id, 0, 'card', 'ICICI Credit Card', 3200.00, NOW()
FROM ext_users WHERE user_name = 'gayathrie'
UNION ALL
SELECT user_id, 0, 'cash', 'Wallet', 4500.00, NOW()
FROM ext_users WHERE user_name = 'gayathrie';

-- -- -- -- -- -- -- -- -- -- 
-- Paul's Income
INSERT INTO ext_transactions (user_id, account_id, amount, transaction_type, description, date, category_id, created_at, updated_at)
SELECT 
    u.user_id,
    a.account_id,
    50000.00,
    'income',
    'October Salary',
    '2025-10-01 09:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Salary' LIMIT 1),
    NOW(),
    NOW()
FROM ext_users u
JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'paul' AND a.account_name = 'HDFC Savings'
UNION ALL
SELECT 
    u.user_id, a.account_id, 15000.00, 'income', 'Freelance Project', '2025-10-10 14:30:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Freelance' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'paul' AND a.account_name = 'ICICI Current'
UNION ALL
SELECT 
    u.user_id, a.account_id, 8000.00, 'income', 'Mutual Funds', '2025-10-15 10:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Investment Returns' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'paul' AND a.account_name = 'SBI Investment';

-- Paul's Expenses
INSERT INTO ext_transactions (user_id, account_id, amount, transaction_type, description, date, category_id, created_at, updated_at)
SELECT 
    u.user_id, a.account_id, 18000.00, 'expense', 'Monthly Rent', '2025-10-01 10:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Housing' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'paul' AND a.account_name = 'HDFC Savings'
UNION ALL
SELECT 
    u.user_id, a.account_id, 4500.00, 'expense', 'Groceries', '2025-10-02 18:30:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Food' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'paul' AND a.account_name = 'Wallet'
UNION ALL
SELECT 
    u.user_id, a.account_id, 2800.00, 'expense', 'Metro Card', '2025-10-04 07:30:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Transportation' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'paul' AND a.account_name = 'HDFC Savings'
UNION ALL
SELECT 
    u.user_id, a.account_id, 3500.00, 'expense', 'Movie & Dinner', '2025-10-07 19:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Entertainment' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'paul' AND a.account_name = 'HDFC Credit Card'
UNION ALL
SELECT 
    u.user_id, a.account_id, 5200.00, 'expense', 'Shopping - Amazon', '2025-10-13 11:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Shopping' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'paul' AND a.account_name = 'HDFC Credit Card';

-- -- -- -- -- -- -- -- 
-- Manikandan's Income
INSERT INTO ext_transactions (user_id, account_id, amount, transaction_type, description, date, category_id, created_at, updated_at)
SELECT 
    u.user_id, a.account_id, 42000.00, 'income', 'October Salary', '2025-10-01 09:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Salary' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'manikandan' AND a.account_name = 'ICICI Salary'
UNION ALL
SELECT 
    u.user_id, a.account_id, 5000.00, 'income', 'Freelance Work', '2025-10-12 16:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Freelance' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'manikandan' AND a.account_name = 'HDFC Savings';

-- Manikandan's Expenses
INSERT INTO ext_transactions (user_id, account_id, amount, transaction_type, description, date, category_id, created_at, updated_at)
SELECT 
    u.user_id, a.account_id, 15000.00, 'expense', 'Monthly Rent', '2025-10-01 10:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Housing' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'manikandan' AND a.account_name = 'ICICI Salary'
UNION ALL
SELECT 
    u.user_id, a.account_id, 3200.00, 'expense', 'Groceries', '2025-10-05 18:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Food' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'manikandan' AND a.account_name = 'Cash in Hand'
UNION ALL
SELECT 
    u.user_id, a.account_id, 1800.00, 'expense', 'Transportation', '2025-10-08 08:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Transportation' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'manikandan' AND a.account_name = 'Cash in Hand'
UNION ALL
SELECT 
    u.user_id, a.account_id, 2500.00, 'expense', 'Entertainment', '2025-10-14 20:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Entertainment' LIMIT 1),
    NOW(), NOW()
FROM ext_users u JOIN ext_accounts a ON u.user_id = a.user_id
WHERE u.username = 'manikandan' AND a.account_name = 'SBI Credit Card';

-- -- -- -- -- -- -- -- -- 
