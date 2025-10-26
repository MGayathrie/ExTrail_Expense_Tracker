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

import com.extrail.extrail_expense_tracker.dao.entity.RolesEntity;
import com.extrail.extrail_expense_tracker.services.RolesServices;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/roles")
public class RolesController {

    public static final Logger LOG = LoggerFactory.getLogger(RolesController.class);

    @Autowired
    RolesServices rolesServices;

    @PostMapping("/create-role")
    public ResponseEntity<RolesEntity> createRole(@Valid @RequestBody RolesEntity role) {
        LOG.info("Entered createRole() in controller...");
        return new ResponseEntity<>(rolesServices.createRole(role), HttpStatus.OK);
    }

    @GetMapping("/get-role-by-id")
    public ResponseEntity<RolesEntity> getRole(@RequestParam Integer roleId) {
        LOG.info("Entered getRole() in controller...");
        return new ResponseEntity<>(rolesServices.getRoleById(roleId), HttpStatus.OK);
    }

    @GetMapping("/get-all-roles")
    public ResponseEntity<List<RolesEntity>> getAllRoles() {
        LOG.info("Entered getAllRoles() in controller...");
        return new ResponseEntity<>(rolesServices.getAllRoles(), HttpStatus.OK);
    }

    @PutMapping("/update-role")
    public ResponseEntity<RolesEntity> updateRole(@RequestParam Integer roleId, @Valid @RequestBody RolesEntity update) {
        LOG.info("Entered updateRole() in controller...");
        return new ResponseEntity<>(rolesServices.updateRole(roleId, update), HttpStatus.OK);
    }

    @DeleteMapping("/delete-role")
    public ResponseEntity<Void> deleteRole(@RequestParam Integer roleId) {
        LOG.info("Entered deleteRole() in controller...");
        rolesServices.deleteRole(roleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/get-role-by-name")
    public ResponseEntity<RolesEntity> getRoleByName(@RequestParam String roleName) {
        LOG.info("Entered getRoleByName() in controller...");
        return new ResponseEntity<>(rolesServices.getRoleByName(roleName), HttpStatus.OK);
    }

    @PutMapping("/assign-role")
    public ResponseEntity<Void> assignRole(@RequestParam Integer userId, @RequestParam String roleName) {
        LOG.info("Entered assignRole() in controller...");
        rolesServices.assignRole(userId, roleName);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/revoke-role")
    public ResponseEntity<Void> revokeRole(@RequestParam Integer userId, @RequestParam String roleName) {
        LOG.info("Entered revokeRole() in controller...");
        rolesServices.revokeRole(userId, roleName);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
