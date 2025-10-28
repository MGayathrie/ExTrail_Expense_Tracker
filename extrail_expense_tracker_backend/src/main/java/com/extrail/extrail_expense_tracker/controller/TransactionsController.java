package com.extrail.extrail_expense_tracker.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.extrail.extrail_expense_tracker.dao.entity.TransactionsEntity;
import com.extrail.extrail_expense_tracker.services.TransactionsServices;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/transactions")
public class TransactionsController {

    public static final Logger LOG = LoggerFactory.getLogger(TransactionsController.class);

    @Autowired
    TransactionsServices transactionsServices;

    @PostMapping("/create-transaction")
    public ResponseEntity<TransactionsEntity> createTransaction(@Valid @RequestBody TransactionsEntity tx) {
        LOG.info("Entered createTransaction() in controller...");
        return ResponseEntity.ok(transactionsServices.createTransaction(tx));
    }

    @GetMapping("/get-transaction-by-id")
    public ResponseEntity<TransactionsEntity> getTransactionById(@RequestParam Integer transactionId) {
        LOG.info("Entered getTransactionById() in controller...");
        return ResponseEntity.ok(transactionsServices.getTransactionById(transactionId));
    }

    @GetMapping("/get-all-transactions")
    public ResponseEntity<List<TransactionsEntity>> getAllTransactions() {
        LOG.info("Entered getAllTransactions() in controller...");
        return ResponseEntity.ok(transactionsServices.getAllTransactions());
    }

    @GetMapping("/get-transactions-by-user")
    public ResponseEntity<List<TransactionsEntity>> getTransactionsByUser(@RequestParam Integer userId) {
        LOG.info("Entered getTransactionsByUser() in controller...");
        return ResponseEntity.ok(transactionsServices.getTransactionsByUser(userId));
    }

    @GetMapping("/get-by-transfer-group-id")
    public ResponseEntity<List<TransactionsEntity>> getByTransferGroupId(@RequestParam String transferGroupId) {
        LOG.info("Entered getByTransferGroupId() in controller...");
        return ResponseEntity.ok(transactionsServices.getByTransferGroupId(transferGroupId));
    }

    @GetMapping("/list-recent")
    public ResponseEntity<List<TransactionsEntity>> listRecent(
            @RequestParam Integer userId,
            @RequestParam(defaultValue = "20") int limit) {
        LOG.info("Entered listRecent() in controller...");
        limit = Math.max(1, Math.min(limit, 100));
        return ResponseEntity.ok(transactionsServices.listRecent(userId, limit));
    }

    @GetMapping("/list-by-account")
    public ResponseEntity<List<TransactionsEntity>> listByAccount(
            @RequestParam Integer userId, @RequestParam Integer accountId) {
        LOG.info("Entered listByAccount() in controller...");
        return ResponseEntity.ok(transactionsServices.listByAccount(userId, accountId));
    }

    @GetMapping("/list-by-category")
    public ResponseEntity<List<TransactionsEntity>> listByCategory(
            @RequestParam Integer userId, @RequestParam Integer categoryId) {
        LOG.info("Entered listByCategory() in controller...");
        return ResponseEntity.ok(transactionsServices.listByCategory(userId, categoryId));
    }

    @PutMapping("/update-transaction")
    public ResponseEntity<TransactionsEntity> updateTransaction(
            @RequestParam Integer transactionId,
            @RequestBody TransactionsEntity update) { // <- no @Valid here
        LOG.info("Entered updateTransaction() in controller...");
        return ResponseEntity.ok(transactionsServices.updateTransaction(transactionId, update));
    }

    @DeleteMapping("/delete-transaction-by-id")
    public ResponseEntity<Void> deleteTransactionById(@RequestParam Integer transactionId) {
        LOG.info("Entered deleteTransactionById() in controller...");
        transactionsServices.deleteTransactionById(transactionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-transaction")
    public ResponseEntity<Void> deleteTransaction(@RequestParam Integer userId, @RequestParam Integer transactionId) {
        LOG.info("Entered deleteTransaction() in controller...");
        transactionsServices.deleteTransaction(userId, transactionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/transfer")
    public ResponseEntity<Void> transfer(@RequestParam Integer userId,
                                         @RequestParam Integer fromAccountId,
                                         @RequestParam Integer toAccountId,
                                         @RequestParam BigDecimal amount,
                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date,
                                         @RequestParam(required = false) String note) {
        LOG.info("Entered transfer() in controller...");
        transactionsServices.transfer(userId, fromAccountId, toAccountId, amount, date, note);
        return ResponseEntity.ok().build();
    }
}


