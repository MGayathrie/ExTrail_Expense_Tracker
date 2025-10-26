package com.extrail.extrail_expense_tracker.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.extrail.extrail_expense_tracker.dao.AccountsDao;
import com.extrail.extrail_expense_tracker.dao.UserDao;
import com.extrail.extrail_expense_tracker.dao.entity.AccountsEntity;
import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.utils.AccountType;

import jakarta.transaction.Transactional;

import com.extrail.extrail_expense_tracker.exception.EntityNotFountException;
import com.extrail.extrail_expense_tracker.exception.InvalidActionException;
import com.extrail.extrail_expense_tracker.exception.EntityDeletedException;

@Service
public class AccountsServices {

    @Autowired
    AccountsDao accountsDao;

    @Autowired
    UserDao userDao;

    private UserEntity resolveUser(UserEntity ref) {
        if (ref == null || ref.getUserId() == null) {
            throw new InvalidActionException("User reference must include userId");
        }
        return userDao.findById(ref.getUserId())
                .orElseThrow(() -> new EntityNotFountException(ref.getUserId(), "User"));
    }

    @Transactional
    public AccountsEntity createAccount(AccountsEntity account) {
        if (account == null) throw new InvalidActionException("Account payload must not be null");

        UserEntity user = resolveUser(account.getUser());
        if (account.getAccountType() == null) throw new InvalidActionException("Account type must not be null");
        if (account.getAccountName() == null || account.getAccountName().isBlank())
            throw new InvalidActionException("Account name must not be blank");

        if (accountsDao.existsByUser_UserIdAndAccountNameIgnoreCaseAndArchivedFalse(
                user.getUserId(), account.getAccountName()))
            throw new InvalidActionException("Account name already exists for this user: " + account.getAccountName());

        if (account.getAccountBalance() == null) account.setAccountBalance(BigDecimal.ZERO);
        if (account.getAccountBalance().compareTo(BigDecimal.ZERO) < 0)
            throw new InvalidActionException("Account balance cannot be negative");

        account.setUser(user);
        account.setArchived(false);
        return accountsDao.save(account);
    }

    public AccountsEntity getAccountById(Integer accountId) {
        if (accountId == null) throw new InvalidActionException("Account ID must not be null");
        AccountsEntity acc = accountsDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFountException(accountId, "Account"));
        if (acc.isArchived()) throw new EntityDeletedException(accountId, "Account");
        return acc;
    }

    public List<AccountsEntity> getAllAccounts() {
        return accountsDao.findAllByArchivedFalse();
    }

    public List<AccountsEntity> getAccountsByUser(Integer userId) {
        if (userId == null) throw new InvalidActionException("User ID must not be null");
        UserEntity user = userDao.findById(userId)
                .orElseThrow(() -> new EntityNotFountException(userId, "User"));
        return accountsDao.findByUserAndArchivedFalse(user);
    }

    public List<AccountsEntity> listAccountsByType(Integer userId, AccountType accountType) {
        return accountsDao.findByUser_UserIdAndAccountTypeAndArchivedFalse(userId, accountType);
    }

    public AccountsEntity getAccount(Integer userId, Integer accountId) {
        AccountsEntity acc = accountsDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFountException(accountId, "Account"));
        if (acc.isArchived()) throw new EntityDeletedException(accountId, "Account");
        if (!acc.getUser().getUserId().equals(userId))
            throw new InvalidActionException("Account not owned by user");
        return acc;
    }

    @Transactional
    public AccountsEntity updateAccount(Integer accountId, AccountsEntity update) {
        if (accountId == null) throw new InvalidActionException("Account ID must not be null");
        if (update == null) throw new InvalidActionException("Update payload must not be null");

        AccountsEntity existing = accountsDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFountException(accountId, "Account"));
        if (existing.isArchived()) throw new EntityDeletedException(accountId, "Account");

        // user change (optional)
        if (update.getUser() != null) {
            UserEntity targetUser = resolveUser(update.getUser());
            existing.setUser(targetUser);
        }

        if (update.getAccountType() != null) {
            existing.setAccountType(update.getAccountType());
        }

        if (update.getAccountName() != null && !update.getAccountName().isBlank()) {
            String newName = update.getAccountName().trim();
            Integer ownerId = existing.getUser().getUserId();
            boolean taken = accountsDao.existsByUser_UserIdAndAccountNameIgnoreCaseAndArchivedFalse(ownerId, newName);
            if (taken && !newName.equalsIgnoreCase(existing.getAccountName())) {
                throw new InvalidActionException("Account name already exists for this user: " + newName);
            }
            existing.setAccountName(newName);
        }

        if (update.getAccountBalance() != null) {
            if (update.getAccountBalance().compareTo(BigDecimal.ZERO) < 0)
                throw new InvalidActionException("Account balance cannot be negative");
            existing.setAccountBalance(update.getAccountBalance());
        }

        // optional archived toggle if you ever pass it on update
        // existing.setArchived(update.isArchived()); // only if you expose it

        return accountsDao.save(existing);
    }

    @Transactional
    public void deleteAccountById(Integer accountId) {
        if (accountId == null) throw new InvalidActionException("Account ID must not be null");
        AccountsEntity acc = accountsDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFountException(accountId, "Account"));
        if (acc.isArchived()) return;
        acc.setArchived(true);
        accountsDao.save(acc);
    }

    @Transactional
    public void deleteAccount(Integer userId, Integer accountId) {
        AccountsEntity acc = accountsDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFountException(accountId, "Account"));
        if (!acc.getUser().getUserId().equals(userId))
            throw new InvalidActionException("Account not owned by user");
        if (acc.isArchived()) return;
        acc.setArchived(true);
        accountsDao.save(acc);
    }

    public BigDecimal getBalance(Integer userId, Integer accountId) {
        AccountsEntity acc = accountsDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFountException(accountId, "Account"));
        if (acc.isArchived()) throw new EntityDeletedException(accountId, "Account");
        if (!acc.getUser().getUserId().equals(userId))
            throw new InvalidActionException("Account not owned by user");
        return acc.getAccountBalance();
    }

}




