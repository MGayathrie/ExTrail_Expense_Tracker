package com.extrail.extrail_expense_tracker.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.extrail.extrail_expense_tracker.dao.entity.AccountsEntity;
import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.utils.AccountType;

public interface AccountsDao extends JpaRepository<AccountsEntity, Integer>{
    
    List<AccountsEntity> findByUserAndArchivedFalse(UserEntity user);
    // boolean existsByUserUserIdAndAccountNameAndArchivedFalse(Integer userId, String accountName);
    boolean existsByUser_UserIdAndAccountNameIgnoreCaseAndArchivedFalse(Integer userId, String accountName);
    // List<AccountsEntity> findByUserUserIdAndAccountTypeAndArchivedFalse(Integer userId, AccountType accountType);
    List<AccountsEntity> findByUser_UserIdAndAccountTypeAndArchivedFalse(Integer userId, AccountType accountType);
    List<AccountsEntity> findAllByArchivedFalse();
    //findByUserIdOrderByCreatedAtDesc(userId)
}
