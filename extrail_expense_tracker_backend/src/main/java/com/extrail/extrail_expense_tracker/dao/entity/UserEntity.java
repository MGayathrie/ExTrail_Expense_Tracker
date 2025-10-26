package com.extrail.extrail_expense_tracker.dao.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ext_users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @NotBlank(message="User name must not be blank")
    @Size(min = 2, max = 100, message="User name must at most be 100 characters")
    @Column(name = "username", unique = true, nullable = false, length = 100)
    private String userName;

    @NotBlank(message="Please provide a valid email address")
    @Email(message="Enter a valid email address")
    @Size(max = 200 , message="Email must at most be 200 characters")
    @Column(name = "email", unique = true, nullable = false, length = 200)
    private String email;

    @NotBlank(message="Please provide a valid password")
    @Size(min = 8, max = 255, message="Password must be at least 8 characters")
    @Column(name = "password_hash", nullable = false, length = 200)
    private String passwordHash;

    // @NotNull(message="Phone number must not be null")
    // @Positive
    // @Digits(integer = 15, fraction = 0)
    // @Pattern(regexp = "^[0-9+\\-()\\s]*$", message = "Phone number must be between 10 to 15 digits")
    // @Column(name = "phone", unique = true, nullable = false)
    // private Long phone;

    @NotBlank
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone must be E.164 format, e.g. +911234567890")
    @Column(name = "phone", unique = true, nullable = false, length = 16)
    private String phone;
    
    @Valid
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "ext_user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<RolesEntity> roles;

    @Schema(description = "Whether the user is deactivated", example = "false", defaultValue = "false")
    @NotNull(message="Deactivation status must not be null")
    @JsonProperty("deactivated")
    @Column(name = "is_deactivated", nullable = false)
    private boolean isDeactivated = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

}
