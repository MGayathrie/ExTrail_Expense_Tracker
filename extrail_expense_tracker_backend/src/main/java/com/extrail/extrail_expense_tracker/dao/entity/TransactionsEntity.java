package com.extrail.extrail_expense_tracker.dao.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.extrail.extrail_expense_tracker.utils.CategoryType;
// import com.extrail.extrail_expense_tracker.utils.AccountType;
import com.extrail.extrail_expense_tracker.utils.TxType;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ext_transactions")
public class TransactionsEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Integer transactionId;

    @NotNull(message="User is mandatory")
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name="user_id", nullable=false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private UserEntity user;

    @Column(name="transfer_group_id", length=26)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String transferGroupId; // null unless transfer

    // @Column(name="transfer_group_id", length=26) 
    // private String transferGroupId; // null unless transfer

    @NotNull(message="Account is mandatory")
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name="account_id", nullable=false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private AccountsEntity account;

    @NotNull(message="Amount is mandatory")
    @Column(name="amount", nullable=false, precision=18, scale=2) 
    private BigDecimal amount;

    @NotNull(message="Transaction type is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(name="transaction_type", nullable=false, length=7) 
    private TxType transactionType; // income/expense

    @Column(name="description", length=500) 
    private String description;

    @NotNull(message="Date is mandatory")
    @Column(name="date", nullable=false) 
    private LocalDateTime date;

    @NotNull(message="Category is mandatory")
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name="category_id", nullable=false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private CategoriesEntity category;

    @CreationTimestamp 
    @Column(name="created_at", nullable=false) 
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at") 
    private LocalDateTime updatedAt;

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Integer getUserId() {
        return user != null ? user.getUserId() : null;
    }

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Integer getAccountId() {
        return account != null ? account.getAccountId() : null;
    }

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Integer getCategoryId() {
        return category != null ? category.getCategoryId() : null;
    }

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public String getCategoryName() {
        return category != null ? category.getCategoryName() : null;
    }

}
