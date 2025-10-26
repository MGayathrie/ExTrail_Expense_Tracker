package com.extrail.extrail_expense_tracker.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.extrail.extrail_expense_tracker.dao.entity.CategoriesEntity;
import com.extrail.extrail_expense_tracker.utils.CategoryScope;
import com.extrail.extrail_expense_tracker.utils.CategoryType;

public interface CategoriesDao extends JpaRepository<CategoriesEntity, Integer> {

    List<CategoriesEntity> findByScope(CategoryScope scope);

    List<CategoriesEntity> findByOwnerUserId_UserId(Integer ownerUserId);

    // dao/repository/CategoriesRepository.java
    List<CategoriesEntity> findByOwnerUserId_UserIdAndCategoryType(Integer ownerUserId, CategoryType categoryType);

    //List<CategoriesEntity> findByScopeOrOwnerUserId_UserIdAndCategoryType(CategoryScope scope, Integer ownerUserId, CategoryType categoryType);
    
    boolean existsByScopeAndOwnerUserId_UserIdAndCategoryNameIgnoreCase(
        CategoryScope scope, Integer ownerUserId, String categoryName);

    // CategoriesRepository
    List<CategoriesEntity> findByScopeAndCategoryType(CategoryScope scope, CategoryType categoryType);

    Optional<CategoriesEntity> findByCategoryNameIgnoreCaseAndScope(String categoryName, CategoryScope scope);

    boolean existsByScopeAndCategoryNameIgnoreCase(CategoryScope global, String categoryName);

}
