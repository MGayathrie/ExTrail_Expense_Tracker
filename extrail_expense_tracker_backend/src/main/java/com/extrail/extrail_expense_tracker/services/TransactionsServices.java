package com.extrail.extrail_expense_tracker.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.extrail.extrail_expense_tracker.dao.AccountsDao;
import com.extrail.extrail_expense_tracker.dao.CategoriesDao;
import com.extrail.extrail_expense_tracker.dao.TransactionsDao;
import com.extrail.extrail_expense_tracker.dao.UserDao;
import com.extrail.extrail_expense_tracker.dao.entity.AccountsEntity;
import com.extrail.extrail_expense_tracker.dao.entity.CategoriesEntity;
import com.extrail.extrail_expense_tracker.dao.entity.TransactionsEntity;
import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.exception.EntityNotFountException;
import com.extrail.extrail_expense_tracker.exception.InvalidActionException;
import com.extrail.extrail_expense_tracker.exception.EntityDeletedException;
import com.extrail.extrail_expense_tracker.utils.CategoryScope;
import com.extrail.extrail_expense_tracker.utils.CategoryType;
import com.extrail.extrail_expense_tracker.utils.TxType;

import jakarta.transaction.Transactional;

 
@Service
public class TransactionsServices {

    @Autowired
    TransactionsDao transactionsDao;

    @Autowired
    UserDao userDao;

    @Autowired
    AccountsDao accountsDao;

    @Autowired
    CategoriesDao categoriesDao;

    public TransactionsEntity createTransaction(TransactionsEntity tx) {
        if (tx == null) throw new InvalidActionException("Transaction payload must not be null");

        UserEntity user = resolveUser(tx.getUser());
        AccountsEntity account = resolveAccount(tx.getAccount());
        CategoriesEntity category = resolveCategory(tx.getCategory());

        if (tx.getAmount() == null || tx.getAmount().compareTo(BigDecimal.ZERO) <= 0)
            throw new InvalidActionException("Amount must be greater than zero");
        if (tx.getTransactionType() == null)
            throw new InvalidActionException("Transaction type must not be null");
        if (tx.getDate() == null)
            throw new InvalidActionException("Date must not be null");

        tx.setUser(user);
        tx.setAccount(account);
        tx.setCategory(category);

        BigDecimal delta = (tx.getTransactionType() == TxType.income) ? tx.getAmount() : tx.getAmount().negate();
        account.setAccountBalance(account.getAccountBalance().add(delta));
        accountsDao.saveAndFlush(account);

        return transactionsDao.saveAndFlush(tx);
    }

    public TransactionsEntity getTransactionById(Integer transactionId) {
        if (transactionId == null) throw new InvalidActionException("Transaction ID must not be null");
        return transactionsDao.findById(transactionId)
                .orElseThrow(() -> new EntityNotFountException(transactionId, "Transaction"));
    }

    public List<TransactionsEntity> getAllTransactions() {
        return transactionsDao.findAll();
    }

    public List<TransactionsEntity> getTransactionsByUser(Integer userId) {
        if (userId == null) throw new InvalidActionException("User ID must not be null");
        return transactionsDao.findByUserUserIdOrderByDateDesc(userId);
    }

    public List<TransactionsEntity> getByTransferGroupId(String transferGroupId) {
        if (transferGroupId == null || transferGroupId.isBlank())
            throw new InvalidActionException("Transfer group id must not be blank");
        return transactionsDao.findByTransferGroupId(transferGroupId);
    }

    public List<TransactionsEntity> listRecent(Integer userId, int limit) {
        return transactionsDao.findTopNByUserUserIdOrderByDateDesc(userId, limit);
    }

    public List<TransactionsEntity> listByAccount(Integer userId, Integer accountId) {
        return transactionsDao.findByUserUserIdAndAccountAccountIdOrderByDateDesc(userId, accountId);
    }

    public List<TransactionsEntity> listByCategory(Integer userId, Integer categoryId) {
        return transactionsDao.findByUserUserIdAndCategoryCategoryIdOrderByDateDesc(userId, categoryId);
    }

    public TransactionsEntity updateTransaction(Integer transactionId, TransactionsEntity update) {
        if (transactionId == null) throw new InvalidActionException("Transaction ID must not be null");
        if (update == null) throw new InvalidActionException("Update payload must not be null");

        TransactionsEntity existing = transactionsDao.findById(transactionId)
                .orElseThrow(() -> new EntityNotFountException(transactionId, "Transaction"));

        if (update.getUser() != null) existing.setUser(resolveUser(update.getUser()));
        if (update.getAccount() != null) existing.setAccount(resolveAccount(update.getAccount()));
        if (update.getCategory() != null) existing.setCategory(resolveCategory(update.getCategory()));

        if (update.getAmount() != null) {
            if (update.getAmount().compareTo(BigDecimal.ZERO) <= 0)
                throw new InvalidActionException("Amount must be greater than zero");
            existing.setAmount(update.getAmount());
        }
        if (update.getTransactionType() != null) existing.setTransactionType(update.getTransactionType());
        if (update.getDescription() != null) existing.setDescription(update.getDescription());
        if (update.getDate() != null) existing.setDate(update.getDate());
        //if (update.getTransferGroupId() != null) existing.setTransferGroupId(update.getTransferGroupId());

        return transactionsDao.saveAndFlush(existing);
    }

    public void deleteTransactionById(Integer transactionId) {
        if (transactionId == null) throw new InvalidActionException("Transaction ID must not be null");
        if (!transactionsDao.existsById(transactionId))
            throw new EntityNotFountException(transactionId, "Transaction");
        transactionsDao.deleteById(transactionId);
    }

    public void deleteTransaction(Integer userId, Integer transactionId) {
        TransactionsEntity tx = transactionsDao.findById(transactionId)
                .orElseThrow(() -> new EntityNotFountException(transactionId, "Transaction"));
        if (!tx.getUser().getUserId().equals(userId))
            throw new InvalidActionException("Transaction not owned by user");

        AccountsEntity acc = tx.getAccount();
        BigDecimal delta = (tx.getTransactionType() == TxType.income) ? tx.getAmount().negate() : tx.getAmount();
        acc.setAccountBalance(acc.getAccountBalance().add(delta));
        accountsDao.saveAndFlush(acc);

        transactionsDao.deleteById(transactionId);
    }

    @Transactional
    public void transfer(Integer userId, Integer fromAccountId, Integer toAccountId,
                         BigDecimal amount, LocalDateTime date, String note) {
        if (fromAccountId.equals(toAccountId))
            throw new InvalidActionException("from and to accounts cannot be same");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new InvalidActionException("Amount > 0 required");

        AccountsEntity from = accountsDao.findById(fromAccountId)
                .orElseThrow(() -> new EntityNotFountException(fromAccountId, "Account"));
        AccountsEntity to = accountsDao.findById(toAccountId)
                .orElseThrow(() -> new EntityNotFountException(toAccountId, "Account"));
        if (from.isArchived()) throw new EntityDeletedException(fromAccountId, "Account");
        if (to.isArchived()) throw new EntityDeletedException(toAccountId, "Account");
        if (!from.getUser().getUserId().equals(userId) || !to.getUser().getUserId().equals(userId))
            throw new InvalidActionException("Accounts not owned by user");

        // 👇 Auto-create "Transfer" (global) if not present
        CategoriesEntity transferCat = categoriesDao
                .findByCategoryNameIgnoreCaseAndScope("Transfer", CategoryScope.global)
                .orElseGet(() -> {
                    CategoriesEntity c = new CategoriesEntity();
                    c.setCategoryName("Transfer");
                    c.setScope(CategoryScope.global);
                    c.setCategoryType(CategoryType.expense);
                    return categoriesDao.saveAndFlush(c);
                });

        String gid = UUID.randomUUID().toString().replace("-", "").substring(0, 26);

        TransactionsEntity out = createTransaction(
                userId, fromAccountId, amount, TxType.expense, date, note, transferCat.getCategoryId());
        out.setTransferGroupId(gid);
        transactionsDao.save(out);

        TransactionsEntity in = createTransaction(
                userId, toAccountId, amount, TxType.income, date, note, transferCat.getCategoryId());
        in.setTransferGroupId(gid);
        transactionsDao.save(in);
    }

    private TransactionsEntity createTransaction(Integer userId, Integer accountId, BigDecimal amount,
                                                 TxType type, LocalDateTime date, String note, Integer categoryId) {
        if (userId == null) throw new InvalidActionException("User ID must not be null");
        if (accountId == null) throw new InvalidActionException("Account ID must not be null");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new InvalidActionException("Amount must be greater than zero");
        if (type == null) throw new InvalidActionException("Transaction type must not be null");
        if (date == null) throw new InvalidActionException("Date must not be null");

        UserEntity user = userDao.findById(userId)
                .orElseThrow(() -> new EntityNotFountException(userId, "User"));
        AccountsEntity account = accountsDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFountException(accountId, "Account"));
        if (account.isArchived()) throw new EntityDeletedException(accountId, "Account");

        CategoriesEntity category = null;
        if (categoryId != null) {
            category = categoriesDao.findById(categoryId)
                    .orElseThrow(() -> new EntityNotFountException(categoryId, "Category"));
        }

        TransactionsEntity tx = new TransactionsEntity();
        tx.setUser(user);
        tx.setAccount(account);
        tx.setAmount(amount);
        tx.setTransactionType(type);
        tx.setDescription(note);
        tx.setDate(date);
        if (category != null) tx.setCategory(category);

        BigDecimal delta = (type == TxType.income) ? amount : amount.negate();
        account.setAccountBalance(account.getAccountBalance().add(delta));
        accountsDao.saveAndFlush(account);

        return transactionsDao.saveAndFlush(tx);
    }

    private UserEntity resolveUser(UserEntity user) {
        if (user == null || user.getUserId() == null)
            throw new InvalidActionException("User reference must include userId");
        return userDao.findById(user.getUserId())
                .orElseThrow(() -> new EntityNotFountException(user.getUserId(), "User"));
    }

    private AccountsEntity resolveAccount(AccountsEntity account) {
        if (account == null || account.getAccountId() == null)
            throw new InvalidActionException("Account reference must include accountId");
        AccountsEntity acc = accountsDao.findById(account.getAccountId())
                .orElseThrow(() -> new EntityNotFountException(account.getAccountId(), "Account"));
        if (acc.isArchived()) throw new EntityDeletedException(account.getAccountId(), "Account");
        return acc;
    }

    private CategoriesEntity resolveCategory(CategoriesEntity category) {
        if (category == null || category.getCategoryId() == null)
            throw new InvalidActionException("Category reference must include categoryId");
        return categoriesDao.findById(category.getCategoryId())
                .orElseThrow(() -> new EntityNotFountException(category.getCategoryId(), "Category"));
    }
}





