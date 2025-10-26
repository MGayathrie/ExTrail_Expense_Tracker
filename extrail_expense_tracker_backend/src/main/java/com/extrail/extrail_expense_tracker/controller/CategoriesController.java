package com.extrail.extrail_expense_tracker.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.extrail.extrail_expense_tracker.dao.entity.CategoriesEntity;
import com.extrail.extrail_expense_tracker.services.CategoriesServices;
import com.extrail.extrail_expense_tracker.utils.CategoryScope;
import com.extrail.extrail_expense_tracker.utils.CategoryType;
import com.extrail.extrail_expense_tracker.dto.CreateGlobalCategoryRequestDto;
import com.extrail.extrail_expense_tracker.dto.CreateUserCategoryRequestDto;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/categories")
public class CategoriesController {

    public static final Logger LOG = LoggerFactory.getLogger(CategoriesController.class);

    @Autowired
    CategoriesServices categoriesServices;

    @PostMapping("/create-category")
    public ResponseEntity<CategoriesEntity> createCategory(@Valid @RequestBody CategoriesEntity category) {
        LOG.info("Entered createCategory() in controller...");
        return ResponseEntity.ok(categoriesServices.createCategory(category));
    }

    @PostMapping("/create-user-category")
    public ResponseEntity<CategoriesEntity> createUserCategory(@Valid @RequestBody CreateUserCategoryRequestDto req) {
        LOG.info("Entered createUserCategory() in controller...");
        return ResponseEntity.ok(categoriesServices.createUserCategory(req));
    }

    @PostMapping("/create-global-category")
    public ResponseEntity<CategoriesEntity> createGlobalCategory(@Valid @RequestBody CreateGlobalCategoryRequestDto req) {
        LOG.info("Entered createGlobalCategory() in controller...");
        return ResponseEntity.ok(categoriesServices.createGlobalCategory(req));
    }

    @GetMapping("/get-category-by-id")
    public ResponseEntity<CategoriesEntity> getCategory(@RequestParam Integer categoryId) {
        LOG.info("Entered getCategory() in controller...");
        return ResponseEntity.ok(categoriesServices.getCategoryById(categoryId));
    }

    @GetMapping("/get-all-categories")
    public ResponseEntity<List<CategoriesEntity>> getAllCategories() {
        LOG.info("Entered getAllCategories() in controller...");
        return ResponseEntity.ok(categoriesServices.getAllCategories());
    }

    @GetMapping("/get-by-scope")
    public ResponseEntity<List<CategoriesEntity>> getByScope(@RequestParam CategoryScope scope) {
        LOG.info("Entered getByScope() in controller...");
        return ResponseEntity.ok(categoriesServices.getByScope(scope));
    }

    @GetMapping("/get-by-owner")
    public ResponseEntity<List<CategoriesEntity>> getByOwner(@RequestParam Integer ownerUserId) {
        LOG.info("Entered getByOwner() in controller...");
        return ResponseEntity.ok(categoriesServices.getByOwnerUserId(ownerUserId));
    }

    @GetMapping("/list-for-user")
    public ResponseEntity<List<CategoriesEntity>> listForUser(@RequestParam Integer userId,
                                                              @RequestParam CategoryType type) {
        LOG.info("Entered listForUser() in controller...");
        return ResponseEntity.ok(categoriesServices.listForUser(userId, type));
    }

    @PutMapping("/update-category")
    public ResponseEntity<CategoriesEntity> updateCategory(@RequestParam Integer categoryId,
                                                           @Valid @RequestBody CategoriesEntity update) {
        LOG.info("Entered updateCategory() in controller...");
        return ResponseEntity.ok(categoriesServices.updateCategory(categoryId, update));
    }

    @PutMapping("/rename-category")
    public ResponseEntity<CategoriesEntity> renameCategory(@RequestParam Integer actorUserId,
                                                           @RequestParam Integer categoryId,
                                                           @RequestParam String newName) {
        LOG.info("Entered renameCategory() in controller...");
        return ResponseEntity.ok(categoriesServices.renameCategory(actorUserId, categoryId, newName));
    }

    @DeleteMapping("/delete-category-by-id")
    public ResponseEntity<Void> deleteCategoryById(@RequestParam Integer categoryId) {
        LOG.info("Entered deleteCategoryById() in controller...");
        categoriesServices.deleteCategory(categoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete-category")
    public ResponseEntity<Void> deleteCategory(@RequestParam Integer actorUserId,
                                               @RequestParam Integer categoryId) {
        LOG.info("Entered deleteCategory() in controller...");
        categoriesServices.deleteCategory(actorUserId, categoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    
}

