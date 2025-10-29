INSERT INTO ext_roles (role_name) VALUES ('USER');
  INSERT INTO ext_roles (role_name) VALUES ('ADMIN');

--password: paul@123 for all
INSERT INTO ext_users (username, email, password_hash, phone, is_deactivated, created_at) VALUES
  ('paul', 'paul@example.com', '$2a$12$yaYCyqaGqbc6/.ar04VSceImJmE1fnifMXPSFYhU.vpMd8PjFRe0W', '9444382670', FALSE, CURRENT_TIMESTAMP),
  ('manikandan', 'manikandan@example.com', '$2a$12$yaYCyqaGqbc6/.ar04VSceImJmE1fnifMXPSFYhU.vpMd8PjFRe0W', '9862021431', FALSE, CURRENT_TIMESTAMP),
  ('gayathrie', 'gayathrie@example.com', '$2a$12$yaYCyqaGqbc6/.ar04VSceImJmE1fnifMXPSFYhU.vpMd8PjFRe0W', '9160374213', FALSE, CURRENT_TIMESTAMP);
 
INSERT INTO ext_user_roles (user_id, role_id)
VALUES (
    (SELECT user_id FROM ext_users WHERE username = 'paul'),
    (SELECT role_id FROM ext_roles WHERE role_name = 'USER')
);
INSERT INTO ext_user_roles (user_id, role_id)
VALUES (
    (SELECT user_id FROM ext_users WHERE username = 'manikandan'),
    (SELECT role_id FROM ext_roles WHERE role_name = 'USER')
);
INSERT INTO ext_user_roles (user_id, role_id)
VALUES (
    (SELECT user_id FROM ext_users WHERE username = 'gayathrie'),
    (SELECT role_id FROM ext_roles WHERE role_name = 'ADMIN')
);

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

INSERT INTO ext_accounts (
    user_id, is_archived, account_type, account_name, account_balance, created_at
) VALUES (
    (SELECT user_id FROM ext_users WHERE username = 'paul'),
    FALSE, 'card', 'HDFC Card', 35000.00, CURRENT_TIMESTAMP
);
INSERT INTO ext_accounts (user_id, is_archived, account_type, account_name, account_balance, created_at)
VALUES (
    (SELECT user_id FROM ext_users WHERE username = 'manikandan'),
    FALSE, 'bank', 'HDFC Bank', 80000.00, CURRENT_TIMESTAMP
);


INSERT INTO ext_budgets (user_id, budget_name, limit_amount, category_id, created_at)
VALUES (
    (SELECT user_id FROM ext_users WHERE username = 'paul'),
    'Housing Budget',
    2000.00,
    (SELECT category_id FROM ext_categories WHERE category_name = 'Housing' AND scope = 'global'),
    CURRENT_TIMESTAMP
);

INSERT INTO ext_transactions (
    user_id, transfer_group_id, account_id, amount, transaction_type, description, date, category_id, created_at, updated_at
) VALUES (
    (SELECT user_id FROM ext_users WHERE username = 'paul'),
    NULL,
    (SELECT account_id FROM ext_accounts WHERE account_name = 'Wallet'),
    3000.00,
    'income',
    'Monthly salary',
    '2024-01-10 09:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Salary' AND scope = 'global'),
    CURRENT_TIMESTAMP,
    NULL
);
INSERT INTO ext_transactions (
    user_id, transfer_group_id, account_id, amount, transaction_type, description, date, category_id, created_at, updated_at
) VALUES (
    (SELECT user_id FROM ext_users WHERE username = 'manikandan'),
    NULL,
    (SELECT account_id FROM ext_accounts WHERE user_id = (SELECT user_id FROM ext_users WHERE username = 'manikandan') AND account_name = 'Wallet' LIMIT 1),
    4500.00,
    'income',
    'Monthly salary',
    '2024-01-10 09:00:00',
    (SELECT category_id FROM ext_categories WHERE category_name = 'Salary' AND scope = 'global'),
    CURRENT_TIMESTAMP,
    NULL
);
