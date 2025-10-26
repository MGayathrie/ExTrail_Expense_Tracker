package com.extrail.extrail_expense_tracker.dto;

import com.extrail.extrail_expense_tracker.utils.CategoryType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreateGlobalCategoryRequestDto {
        @NotBlank(message = "Category name must not be blank")
        private String categoryName;

        private String description;

        @NotNull(message = "Category type must not be null")
        private CategoryType categoryType;
}
