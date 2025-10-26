package com.extrail.extrail_expense_tracker.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;

public interface UserDao extends JpaRepository<UserEntity, Integer>{
    Optional<UserEntity> findByUserName(String userName);
    Optional<UserEntity> findByPhone(String phone);
    boolean existsByPhoneAndUserIdNot(String phone, Integer userId);

    // UserDao.java
    @Query("SELECT u FROM UserEntity u JOIN u.roles r WHERE r.roleName = :roleName")
    List<UserEntity> findByRoleName(@Param("roleName") String roleName);
}
