package com.extrail.extrail_expense_tracker.services;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.extrail.extrail_expense_tracker.dao.CategoriesDao;
import com.extrail.extrail_expense_tracker.dao.UserDao;
import com.extrail.extrail_expense_tracker.dao.entity.CategoriesEntity;
import com.extrail.extrail_expense_tracker.dao.entity.RolesEntity;
import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.dto.CreateGlobalCategoryRequestDto;
import com.extrail.extrail_expense_tracker.dto.CreateUserCategoryRequestDto;
import com.extrail.extrail_expense_tracker.exception.EntityNotFountException;
import com.extrail.extrail_expense_tracker.exception.InvalidActionException;
import com.extrail.extrail_expense_tracker.utils.CategoryScope;
import com.extrail.extrail_expense_tracker.utils.CategoryType;

import jakarta.transaction.Transactional;

@Service
public class CategoriesServices {

    @Autowired
    CategoriesDao categoriesDao;

    @Autowired
    UserDao userDao;

    @Transactional
    public CategoriesEntity createCategory(CategoriesEntity category) {
        if (category == null) throw new InvalidActionException("Category payload must not be null");
        if (isBlank(category.getCategoryName())) throw new InvalidActionException("Category name must not be blank");
        if (category.getScope() == null) throw new InvalidActionException("Category scope must not be null");
        if (category.getCategoryType() == null) throw new InvalidActionException("Category type must not be null");

        if (category.getScope() == CategoryScope.user) {
            if (category.getOwnerUser() == null || category.getOwnerUser().getUserId() == null)
                throw new InvalidActionException("User-scoped categories must include owner userId");

            // ensure owner exists
            category.setOwnerUser(resolveUser(category.getOwnerUser()));

            // uniqueness (user + name)
            if (categoriesDao.existsByScopeAndOwnerUser_UserIdAndCategoryNameIgnoreCase(
                    CategoryScope.user, category.getOwnerUser().getUserId(), category.getCategoryName()))
                throw new InvalidActionException("Category already exists for user");
        } else {
            // global → enforce uniqueness and null owner
            if (categoriesDao.existsByScopeAndCategoryNameIgnoreCase(CategoryScope.global, category.getCategoryName()))
                throw new InvalidActionException("Global category already exists");
            category.setOwnerUser(null);
        }

        category.setCategoryName(category.getCategoryName().trim());
        return categoriesDao.save(category);
    }

    @Transactional
    public CategoriesEntity createUserCategory(CreateUserCategoryRequestDto req) {
        if (req == null) throw new InvalidActionException("Category payload must not be null");
        if (isBlank(req.getCategoryName())) throw new InvalidActionException("Category name must not be blank");
        if (req.getCategoryType() == null) throw new InvalidActionException("Category type must not be null");
        if (req.getOwnerUser() == null) throw new InvalidActionException("User-scoped categories must include owner userId");

        UserEntity owner = userDao.findById(req.getOwnerUser())
                .orElseThrow(() -> new EntityNotFountException(req.getOwnerUser(), "User"));

        if (categoriesDao.existsByScopeAndOwnerUser_UserIdAndCategoryNameIgnoreCase(
                CategoryScope.user, req.getOwnerUser(), req.getCategoryName()))
            throw new InvalidActionException("Category already exists for user");

        CategoriesEntity c = new CategoriesEntity();
        c.setCategoryName(req.getCategoryName().trim());
        c.setDescription(req.getDescription());
        c.setCategoryType(req.getCategoryType());
        c.setScope(CategoryScope.user);
        c.setOwnerUser(owner);
        return categoriesDao.save(c);
    }

    @Transactional
    public CategoriesEntity createGlobalCategory(CreateGlobalCategoryRequestDto req) {
        if (req == null) throw new InvalidActionException("Category payload must not be null");
        if (isBlank(req.getCategoryName())) throw new InvalidActionException("Category name must not be blank");
        if (req.getCategoryType() == null) throw new InvalidActionException("Category type must not be null");

        if (categoriesDao.existsByScopeAndCategoryNameIgnoreCase(CategoryScope.global, req.getCategoryName()))
            throw new InvalidActionException("Global category already exists");

        CategoriesEntity c = new CategoriesEntity();
        c.setCategoryName(req.getCategoryName().trim());
        c.setDescription(req.getDescription());
        c.setCategoryType(req.getCategoryType());
        c.setScope(CategoryScope.global);
        c.setOwnerUser(null);
        return categoriesDao.save(c);
    }

    public CategoriesEntity getCategoryById(Integer categoryId) {
        if (categoryId == null) throw new InvalidActionException("Category ID must not be null");
        return categoriesDao.findById(categoryId)
                .orElseThrow(() -> new EntityNotFountException(categoryId, "Category"));
    }

    public List<CategoriesEntity> getAllCategories() {
        return categoriesDao.findAll();
    }

    public List<CategoriesEntity> getByScope(CategoryScope scope) {
        if (scope == null) throw new InvalidActionException("Scope must not be null");
        return categoriesDao.findByScope(scope);
    }

    public List<CategoriesEntity> getByOwnerUserId(Integer ownerUserId) {
        if (ownerUserId == null) throw new InvalidActionException("Owner userId must not be null");
        return categoriesDao.findByOwnerUser_UserId(ownerUserId);
    }

public List<CategoriesEntity> listForUser(Integer userId, CategoryType type) {
    if (userId == null) throw new InvalidActionException("userId must not be null");
    if (type == null) throw new InvalidActionException("category type must not be null");

    // Get both global and user categories
    List<CategoriesEntity> globals = categoriesDao.findByScopeAndCategoryType(CategoryScope.global, type);
    List<CategoriesEntity> personals = categoriesDao.findByOwnerUser_UserIdAndCategoryType(userId, type);
    
    // Use LinkedHashSet to maintain order and remove duplicates by categoryId
    Set<CategoriesEntity> uniqueCategories = new LinkedHashSet<>();
    uniqueCategories.addAll(globals);
    uniqueCategories.addAll(personals);
    
    return new ArrayList<>(uniqueCategories);
}


    @Transactional
    public CategoriesEntity updateCategory(Integer categoryId, CategoriesEntity update) {
        if (categoryId == null) throw new InvalidActionException("Category ID must not be null");
        if (update == null) throw new InvalidActionException("Update payload must not be null");

        CategoriesEntity existing = categoriesDao.findById(categoryId)
                .orElseThrow(() -> new EntityNotFountException(categoryId, "Category"));

        if (!isBlank(update.getCategoryName())) {
            String newName = update.getCategoryName().trim();

            // enforce uniqueness within the current scope
            if (existing.getScope() == CategoryScope.global) {
                if (categoriesDao.existsByScopeAndCategoryNameIgnoreCase(CategoryScope.global, newName)
                        && !existing.getCategoryName().equalsIgnoreCase(newName)) {
                    throw new InvalidActionException("Global category already exists");
                }
            } else {
                Integer ownerId = (existing.getOwnerUser() != null) ? existing.getOwnerUser().getUserId() : null;
                if (ownerId != null &&
                    categoriesDao.existsByScopeAndOwnerUser_UserIdAndCategoryNameIgnoreCase(
                        CategoryScope.user, ownerId, newName) &&
                    !existing.getCategoryName().equalsIgnoreCase(newName)) {
                    throw new InvalidActionException("Category already exists for user");
                }
            }
            existing.setCategoryName(newName);
        }

        if (update.getDescription() != null) {
            existing.setDescription(update.getDescription());
        }
        if (update.getCategoryType() != null) {
            existing.setCategoryType(update.getCategoryType());
        }
        if (update.getScope() != null) {
            existing.setScope(update.getScope());
            if (update.getScope() == CategoryScope.global) {
                existing.setOwnerUser(null);
            }
        }
        if (update.getOwnerUser() != null) {
            existing.setOwnerUser(resolveUser(update.getOwnerUser()));
            existing.setScope(CategoryScope.user); // ensure consistency
        }

        return categoriesDao.save(existing);
    }

    private boolean isAdmin(Integer userId) {
        return userDao.findById(userId)
                .orElseThrow(() -> new EntityNotFountException(userId, "User"))
                .getRoles()
                .stream()
                .map(RolesEntity::getRoleName)
                .anyMatch(r -> "ADMIN".equalsIgnoreCase(r));
    }

    @Transactional
    public CategoriesEntity renameCategory(Integer actorUserId, Integer categoryId, String newName) {
        if (actorUserId == null) throw new InvalidActionException("actorUserId must not be null");
        if (categoryId == null) throw new InvalidActionException("categoryId must not be null");
        if (isBlank(newName)) throw new InvalidActionException("newName must not be blank");

        CategoriesEntity c = categoriesDao.findById(categoryId)
                .orElseThrow(() -> new EntityNotFountException(categoryId, "Category"));

        String trimmed = newName.trim();

        if (c.getScope() == CategoryScope.user) {
            Integer owner = (c.getOwnerUser() != null) ? c.getOwnerUser().getUserId() : null;
            if (owner == null || !owner.equals(actorUserId))
                throw new InvalidActionException("Not allowed to rename this category");
            if (categoriesDao.existsByScopeAndOwnerUser_UserIdAndCategoryNameIgnoreCase(
                    CategoryScope.user, owner, trimmed) &&
                !c.getCategoryName().equalsIgnoreCase(trimmed)) {
                throw new InvalidActionException("Category already exists for user");
            }
        } else {
            if (!isAdmin(actorUserId))
                throw new InvalidActionException("Admin only: cannot rename global category");
            if (categoriesDao.existsByScopeAndCategoryNameIgnoreCase(CategoryScope.global, trimmed) &&
                !c.getCategoryName().equalsIgnoreCase(trimmed)) {
                throw new InvalidActionException("Global category already exists");
            }
        }

        c.setCategoryName(trimmed);
        return categoriesDao.saveAndFlush(c);
    }

    @Transactional
    public void deleteCategory(Integer categoryId) {
        if (categoryId == null) throw new InvalidActionException("Category ID must not be null");
        if (!categoriesDao.existsById(categoryId)) throw new EntityNotFountException(categoryId, "Category");
        categoriesDao.deleteById(categoryId);
    }

    @Transactional
    public void deleteCategory(Integer actorUserId, Integer categoryId) {
        if (actorUserId == null) throw new InvalidActionException("actorUserId must not be null");
        if (categoryId == null) throw new InvalidActionException("categoryId must not be null");

        CategoriesEntity c = categoriesDao.findById(categoryId)
                .orElseThrow(() -> new EntityNotFountException(categoryId, "Category"));

        if (c.getScope() == CategoryScope.user) {
            Integer owner = (c.getOwnerUser() != null) ? c.getOwnerUser().getUserId() : null;
            if (owner == null || !owner.equals(actorUserId))
                throw new InvalidActionException("Not allowed to delete this category");
        } else {
            if (!isAdmin(actorUserId))
                throw new InvalidActionException("Admin only: cannot delete global category");
        }

        // TODO: add safeguard if referenced by transactions
        categoriesDao.deleteById(categoryId);
    }

    private UserEntity resolveUser(UserEntity userRef) {
        if (userRef == null || userRef.getUserId() == null)
            throw new InvalidActionException("User reference must include userId");
        return userDao.findById(userRef.getUserId())
                .orElseThrow(() -> new EntityNotFountException(userRef.getUserId(), "User"));
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}








