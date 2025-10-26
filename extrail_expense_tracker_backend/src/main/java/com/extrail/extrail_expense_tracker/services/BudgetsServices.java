package com.extrail.extrail_expense_tracker.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.extrail.extrail_expense_tracker.dao.BudgetsDao;
import com.extrail.extrail_expense_tracker.dao.CategoriesDao;
import com.extrail.extrail_expense_tracker.dao.UserDao;
import com.extrail.extrail_expense_tracker.dao.entity.BudgetsEntity;
import com.extrail.extrail_expense_tracker.dao.entity.CategoriesEntity;
import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.exception.EntityNotFountException;
import com.extrail.extrail_expense_tracker.exception.InvalidActionException;


@Service
public class BudgetsServices {

    @Autowired
    BudgetsDao budgetsDao;

    @Autowired
    UserDao userDao;

    @Autowired
    CategoriesDao categoriesDao;

    public BudgetsEntity createBudget(BudgetsEntity budget) {
        if (budget == null) throw new InvalidActionException("Budget payload must not be null");
        if (budget.getBudgetName() == null || budget.getBudgetName().isBlank())
            throw new InvalidActionException("Budget name must not be blank");
        if (budget.getLimitAmount() == null || budget.getLimitAmount().compareTo(BigDecimal.ZERO) < 0)
            throw new InvalidActionException("Limit amount must be >= 0");

        // Resolve relations from ids to ensure referential integrity
        UserEntity user = resolveUser(budget.getUser());
        budget.setUser(user);

        if (budget.getCategory() != null) {
            // allow null category_id to mean "overall budget"
            if (budget.getCategory().getCategoryId() == null) {
                budget.setCategory(null);
            } else {
                budget.setCategory(resolveCategory(budget.getCategory()));
            }
        }

        return budgetsDao.saveAndFlush(budget);
    }

    public BudgetsEntity getBudgetById(Integer budgetId) {
        if (budgetId == null) throw new InvalidActionException("Budget ID must not be null");
        return budgetsDao.findById(budgetId)
                .orElseThrow(() -> new EntityNotFountException(budgetId, "Budget"));
    }

    public List<BudgetsEntity> getAllBudgets() {
        return budgetsDao.findAll();
    }

    public List<BudgetsEntity> getBudgetsByUser(Integer userId) {
        if (userId == null) throw new InvalidActionException("User ID must not be null");
        return budgetsDao.findByUserUserId(userId);
    }

    public BudgetsEntity updateBudget(Integer budgetId, BudgetsEntity update) {
        if (budgetId == null) throw new InvalidActionException("Budget ID must not be null");
        if (update == null) throw new InvalidActionException("Update payload must not be null");

        BudgetsEntity existing = budgetsDao.findById(budgetId)
                .orElseThrow(() -> new EntityNotFountException(budgetId, "Budget"));

        if (update.getBudgetName() != null && !update.getBudgetName().isBlank()) {
            existing.setBudgetName(update.getBudgetName().trim());
        }

        if (update.getLimitAmount() != null) {
            if (update.getLimitAmount().compareTo(BigDecimal.ZERO) < 0)
                throw new InvalidActionException("Limit amount must be >= 0");
            existing.setLimitAmount(update.getLimitAmount());
        }

        if (update.getUser() != null) {
            existing.setUser(resolveUser(update.getUser()));
        }

        if (update.getCategory() != null) {
            if (update.getCategory().getCategoryId() == null) {
                existing.setCategory(null); // switch to overall budget
            } else {
                existing.setCategory(resolveCategory(update.getCategory()));
            }
        }

        return budgetsDao.save(existing);
    }

    public void deleteBudget(Integer userId, Integer budgetId) {
        BudgetsEntity b = budgetsDao.findById(budgetId)
                .orElseThrow(() -> new EntityNotFountException(budgetId, "Budget"));
        if (!b.getUser().getUserId().equals(userId))
            throw new InvalidActionException("Budget not owned by user");
        budgetsDao.deleteById(budgetId);
    }

    private UserEntity resolveUser(UserEntity user) {
        if (user == null || user.getUserId() == null)
            throw new InvalidActionException("User reference must include userId");
        return userDao.findById(user.getUserId())
                .orElseThrow(() -> new EntityNotFountException(user.getUserId(), "User"));
    }

    private CategoriesEntity resolveCategory(CategoriesEntity category) {
        if (category == null || category.getCategoryId() == null)
            throw new InvalidActionException("Category reference must include categoryId");
        return categoriesDao.findById(category.getCategoryId())
                .orElseThrow(() -> new EntityNotFountException(category.getCategoryId(), "Category"));
    }
}

