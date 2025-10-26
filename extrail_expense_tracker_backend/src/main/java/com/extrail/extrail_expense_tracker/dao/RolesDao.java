package com.extrail.extrail_expense_tracker.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.extrail.extrail_expense_tracker.dao.entity.RolesEntity;

public interface RolesDao extends JpaRepository<RolesEntity, Integer> {
    Optional<RolesEntity> findByRoleName(String roleName);
}
