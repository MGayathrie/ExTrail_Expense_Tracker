package com.extrail.extrail_expense_tracker.dao.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ext_budgets")
public class BudgetsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_id")
    private Integer budgetId;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name="user_id", nullable=false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private UserEntity user;

    //Why do we need this? 
    @NotBlank(message = "Budget name must not be blank")
    @Column(name="budget_name", nullable=false, length=120) 
    private String budgetName;

    @NotNull(message="Limit amount is required")
    @DecimalMin(value = "0.00", inclusive = true, message = "Limit amount must be >= 0")
    @Column(name="limit_amount", nullable=false, precision=18, scale=2)
    private BigDecimal limitAmount;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name="category_id") // nullable => overall budget
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private CategoriesEntity category;

    @CreationTimestamp @Column(nullable=false) 
    private LocalDateTime created_at;

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Integer getUserId() {
        return user != null ? user.getUserId() : null;
    }

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Integer getCategoryId() {
        return category != null ? category.getCategoryId() : null;
    }

    // Optional: handy for list views
    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public String getCategoryName() {
        return category != null ? category.getCategoryName() : null;
    }
}
