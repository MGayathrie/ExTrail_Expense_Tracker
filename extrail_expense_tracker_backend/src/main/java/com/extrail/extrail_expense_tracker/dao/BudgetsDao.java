package com.extrail.extrail_expense_tracker.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.extrail.extrail_expense_tracker.dao.entity.BudgetsEntity;

public interface BudgetsDao extends JpaRepository<BudgetsEntity, Integer>{
    List<BudgetsEntity> findByUserUserId(Integer userId);

    // Optional: use this if you ever want to return full category eagerly
    @Query("select b from BudgetsEntity b join fetch b.category where b.budgetId = :id")
    Optional<BudgetsEntity> findByIdWithCategory(@Param("id") Integer id);
}
