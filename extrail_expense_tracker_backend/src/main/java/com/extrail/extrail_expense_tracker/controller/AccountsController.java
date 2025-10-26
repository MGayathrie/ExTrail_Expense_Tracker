package com.extrail.extrail_expense_tracker.controller;

import java.math.BigDecimal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.extrail.extrail_expense_tracker.dao.entity.AccountsEntity;
import com.extrail.extrail_expense_tracker.services.AccountsServices;
import com.extrail.extrail_expense_tracker.utils.AccountType;
import com.extrail.extrail_expense_tracker.validation.OnCreate;
import com.extrail.extrail_expense_tracker.validation.OnUpdate;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/accounts")
public class AccountsController {

    public static final Logger LOG = LoggerFactory.getLogger(AccountsController.class);

    @Autowired
    AccountsServices accountsServices;

    @PostMapping("/add-account")
    public ResponseEntity<AccountsEntity> addAccount(
            @Validated(OnCreate.class) @RequestBody AccountsEntity account) {
        LOG.info("Entered addAccount()...");
        return ResponseEntity.ok(accountsServices.createAccount(account));
    }

    @GetMapping("/get-account-by-id")
    public ResponseEntity<AccountsEntity> getAccountById(@RequestParam Integer accountId) {
        LOG.info("Entered getAccountById()...");
        return ResponseEntity.ok(accountsServices.getAccountById(accountId));
    }

    @GetMapping("/get-all-accounts")
    public ResponseEntity<List<AccountsEntity>> getAllAccounts() {
        LOG.info("Entered getAllAccounts()...");
        return ResponseEntity.ok(accountsServices.getAllAccounts());
    }

    @GetMapping("/get-accounts-by-user")
    public ResponseEntity<List<AccountsEntity>> getAccountsByUser(@RequestParam Integer userId) {
        LOG.info("Entered getAccountsByUser()...");
        return ResponseEntity.ok(accountsServices.getAccountsByUser(userId));
    }

    @GetMapping("/list-accounts-by-type")
    public ResponseEntity<List<AccountsEntity>> listAccountsByType(
            @RequestParam Integer userId, @RequestParam AccountType type) {
        LOG.info("Entered listAccountsByType()...");
        return ResponseEntity.ok(accountsServices.listAccountsByType(userId, type));
    }

    @GetMapping("/get-account")
    public ResponseEntity<AccountsEntity> getAccount(
            @RequestParam Integer userId, @RequestParam Integer accountId) {
        LOG.info("Entered getAccount()...");
        return ResponseEntity.ok(accountsServices.getAccount(userId, accountId));
    }

    @PutMapping("/update-account")
    public ResponseEntity<AccountsEntity> updateAccount(
            @RequestParam Integer accountId,
            @Validated(OnUpdate.class) @RequestBody AccountsEntity update) {
        LOG.info("Entered updateAccount()...");
        return ResponseEntity.ok(accountsServices.updateAccount(accountId, update));
    }

    @DeleteMapping("/delete-account-by-id")
    public ResponseEntity<Void> deleteAccountById(@RequestParam Integer accountId) {
        LOG.info("Entered deleteAccountById()...");
        accountsServices.deleteAccountById(accountId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<Void> deleteAccount(@RequestParam Integer userId, @RequestParam Integer accountId) {
        LOG.info("Entered deleteAccount()...");
        accountsServices.deleteAccount(userId, accountId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-balance")
    public ResponseEntity<BigDecimal> getBalance(@RequestParam Integer userId, @RequestParam Integer accountId) {
        LOG.info("Entered getBalance()...");
        return ResponseEntity.ok(accountsServices.getBalance(userId, accountId));
    }
}






