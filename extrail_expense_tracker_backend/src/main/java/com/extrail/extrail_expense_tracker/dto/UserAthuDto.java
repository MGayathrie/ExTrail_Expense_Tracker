package com.extrail.extrail_expense_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserAthuDto {
    private String userName;
    private String passwordHash;    
}
