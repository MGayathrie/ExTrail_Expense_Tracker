package com.extrail.extrail_expense_tracker.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

import com.extrail.extrail_expense_tracker.dao.entity.BudgetsEntity;
import com.extrail.extrail_expense_tracker.services.BudgetsServices;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/budgets")
public class BudgetsController {

    public static final Logger LOG = LoggerFactory.getLogger(BudgetsController.class);

    @Autowired
    BudgetsServices budgetsServices;

    @PostMapping("/add-budget")
    public ResponseEntity<BudgetsEntity> addBudget(@Valid @RequestBody BudgetsEntity budget) {
        LOG.info("Entered addBudget() in controller...");
        return ResponseEntity.ok(budgetsServices.createBudget(budget));
    }

    @GetMapping("/get-budget-by-id")
    public ResponseEntity<BudgetsEntity> getBudget(@RequestParam Integer budgetId) {
        LOG.info("Entered getBudget() in controller...");
        return ResponseEntity.ok(budgetsServices.getBudgetById(budgetId));
    }

    @GetMapping("/get-all-budgets")
    public ResponseEntity<List<BudgetsEntity>> getAllBudgets() {
        LOG.info("Entered getAllBudgets() in controller...");
        return ResponseEntity.ok(budgetsServices.getAllBudgets());
    }

    @GetMapping("/get-budgets-by-user")
    public ResponseEntity<List<BudgetsEntity>> getBudgetsByUser(@RequestParam Integer userId) {
        LOG.info("Entered getBudgetsByUser() in controller...");
        return ResponseEntity.ok(budgetsServices.getBudgetsByUser(userId));
    }

    @PutMapping("/update-budget")
    public ResponseEntity<BudgetsEntity> updateBudget(
            @RequestParam Integer budgetId,
            @Valid @RequestBody BudgetsEntity update) {
        LOG.info("Entered updateBudget() in controller...");
        return ResponseEntity.ok(budgetsServices.updateBudget(budgetId, update));
    }

    @DeleteMapping("/delete-budget")
    public ResponseEntity<Void> deleteBudget(@RequestParam Integer userId, @RequestParam Integer budgetId) {
        LOG.info("Entered deleteBudget() in controller...");
        budgetsServices.deleteBudget(userId, budgetId);
        return ResponseEntity.ok().build();
    }
}


