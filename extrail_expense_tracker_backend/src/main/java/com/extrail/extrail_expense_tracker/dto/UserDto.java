package com.extrail.extrail_expense_tracker.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.extrail.extrail_expense_tracker.dao.entity.RolesEntity;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto {

    private Integer userId;
    private String userName;
    private String email;
    private String phone;
    private List<RolesEntity> roles;

    @Schema(description = "Whether the user is deactivated", example = "false", defaultValue = "false")
    @JsonProperty("deactivated")
    private boolean isDeactivated = false;

    private LocalDateTime createdAt;
}
