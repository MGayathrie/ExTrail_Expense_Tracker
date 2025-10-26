package com.extrail.extrail_expense_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserPasswordUpdateDto {
    private Integer userId;
    private String oldPassword;
    private String newPassword;
}
