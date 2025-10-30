package com.extrail.extrail_expense_tracker.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.extrail.extrail_expense_tracker.dao.entity.TransactionsEntity;

public interface TransactionsDao extends JpaRepository<TransactionsEntity, Integer> {

    List<TransactionsEntity> findByUserUserIdOrderByDateDesc(Integer userId);

    List<TransactionsEntity> findByTransferGroupId(String transferGroupId);

    List<TransactionsEntity> findByAccountAccountId(Integer accountId);

    List<TransactionsEntity> findByUserUserIdAndAccountAccountIdOrderByDateDesc(Integer userId, Integer accountId);

    List<TransactionsEntity> findByUserUserIdAndCategoryCategoryIdOrderByDateDesc(Integer userId, Integer categoryId);

    default List<TransactionsEntity> findTopNByUserUserIdOrderByDateDesc(Integer userId, int n) {
        return findByUserUserIdOrderByDateDesc(userId).stream().limit(n).toList();
    }

    @Query("""
   SELECT t
   FROM TransactionsEntity t
   LEFT JOIN FETCH t.user u
   LEFT JOIN FETCH t.account a
   LEFT JOIN FETCH t.category c
   WHERE t.transactionId = :id
""")
    Optional<TransactionsEntity> findByIdWithJoins(@Param("id") Integer id);

}
