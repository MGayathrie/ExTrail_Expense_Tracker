package com.extrail.extrail_expense_tracker.dao.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.extrail.extrail_expense_tracker.utils.AccountType;
import com.extrail.extrail_expense_tracker.validation.OnCreate;
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
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ext_accounts")
public class AccountsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Integer accountId;

    @NotNull(message="User is required")
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name="user_id", nullable=false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private UserEntity user;

    @Column(name = "is_archived", nullable = false)
    private boolean archived = false;

    @NotNull(message = "Account type is required", groups = OnCreate.class)
    @Enumerated(EnumType.STRING)
    @Column(name="account_type", nullable=false, length=10) 
    private AccountType accountType; // cash/card/bank

    @NotBlank(message = "Account name must not be blank", groups = OnCreate.class)
    @Size(max = 100, message = "Account name max length is 100")
    @Column(name="account_name", nullable=false, length=100) 
    private String accountName;

    @NotNull(message = "Account balance is required", groups = OnCreate.class)
    @DecimalMin(value = "0.00", inclusive = true, message = "Account balance must be >= 0")
    @Column(name="account_balance", nullable=false, precision=18, scale=2)
    private BigDecimal accountBalance = BigDecimal.ZERO;

    @CreationTimestamp 
    @Column(name="created_at", nullable=false) 
    private LocalDateTime createdAt;

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // show in responses, ignored on requests
    public Integer getUserId() {
        return (user != null) ? user.getUserId() : null;
    }
}
