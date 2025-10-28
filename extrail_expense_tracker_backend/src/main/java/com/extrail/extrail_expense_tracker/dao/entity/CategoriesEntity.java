package com.extrail.extrail_expense_tracker.dao.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.extrail.extrail_expense_tracker.utils.CategoryScope;
import com.extrail.extrail_expense_tracker.utils.CategoryType;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ext_categories")
public class CategoriesEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @NotBlank(message="Category name must not be blank")
    @Column(name="category_name", nullable=false, length=100) 
    private String categoryName;

    @Column(name="description", length=100) 
    private String description;

    @NotNull(message = "Category type is required")
    @Enumerated(EnumType.STRING)
    @Column(name="category_type", nullable=false, length=10)
    private CategoryType categoryType; // income / expense

    @NotNull(message="Category scope is required")
    @Enumerated(EnumType.STRING)
    @Column(name="scope", nullable=false, length=10) 
    private CategoryScope scope = CategoryScope.user; //global / user

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="owner_user_id")  // null when global
    private UserEntity ownerUser;

    @CreationTimestamp 
    @Column(name="created_at", nullable=false) 
    private LocalDateTime createdAt;

    @UpdateTimestamp 
    @Column(name="updated_at", nullable=false)
    private LocalDateTime updatedAt;

    // CategoriesEntity.java - ADD THIS

    // ADD THIS: Expose ownerUserId as Integer for JSON
    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Integer getOwnerUserId() {
        return ownerUser != null ? ownerUser.getUserId() : null;
    }

    // ADD THIS: For backwards compatibility
    @JsonIgnore
    public UserEntity getOwnerUserEntity() {
        return ownerUser;
    }

}
