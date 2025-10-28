package com.extrail.extrail_expense_tracker.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.extrail.extrail_expense_tracker.dao.entity.CategoriesEntity;
import com.extrail.extrail_expense_tracker.utils.CategoryScope;
import com.extrail.extrail_expense_tracker.utils.CategoryType;

public interface CategoriesDao extends JpaRepository<CategoriesEntity, Integer> {

    List<CategoriesEntity> findByScope(CategoryScope scope);

@Query("SELECT c FROM CategoriesEntity c WHERE c.ownerUser.userId = :userId")
    List<CategoriesEntity> findByOwnerUser_UserId(@Param("userId") Integer userId);

    // dao/repository/CategoriesRepository.java
    // List<CategoriesEntity> findByOwnerUserId_UserIdAndCategoryType(Integer ownerUserId, CategoryType categoryType);
    @Query("SELECT DISTINCT c FROM CategoriesEntity c WHERE c.ownerUser.userId = :userId AND c.categoryType = :type")
    List<CategoriesEntity> findByOwnerUser_UserIdAndCategoryType(
        @Param("userId") Integer userId, 
        @Param("type") CategoryType type
    );
    //List<CategoriesEntity> findByScopeOrOwnerUserId_UserIdAndCategoryType(CategoryScope scope, Integer ownerUserId, CategoryType categoryType);
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM CategoriesEntity c " +
           "WHERE c.scope = :scope AND c.ownerUser.userId = :userId AND LOWER(c.categoryName) = LOWER(:categoryName)")
    boolean existsByScopeAndOwnerUser_UserIdAndCategoryNameIgnoreCase(
        @Param("scope") CategoryScope scope, 
        @Param("userId") Integer userId, 
        @Param("categoryName") String categoryName
    );
    // CategoriesRepository
    // List<CategoriesEntity> findByScopeAndCategoryType(CategoryScope scope, CategoryType categoryType);

    // Find categories by scope and type (global income categories, etc.)
    @Query("SELECT DISTINCT c FROM CategoriesEntity c WHERE c.scope = :scope AND c.categoryType = :type")
    List<CategoriesEntity> findByScopeAndCategoryType(
        @Param("scope") CategoryScope scope, 
        @Param("type") CategoryType type
    );

    // Find category by name and scope (case-insensitive)
    Optional<CategoriesEntity> findByCategoryNameIgnoreCaseAndScope(
        String categoryName, 
        CategoryScope scope
    );

    // Check if global category exists by name (case-insensitive)
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM CategoriesEntity c " +
           "WHERE c.scope = :scope AND LOWER(c.categoryName) = LOWER(:categoryName)")
    boolean existsByScopeAndCategoryNameIgnoreCase(
        @Param("scope") CategoryScope scope, 
        @Param("categoryName") String categoryName
    );
}
