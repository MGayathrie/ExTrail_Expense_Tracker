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

import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.dto.UserAthuDto;
import com.extrail.extrail_expense_tracker.dto.UserDto;
import com.extrail.extrail_expense_tracker.dto.UserPasswordUpdateDto;
import com.extrail.extrail_expense_tracker.exception.InvalidActionException;
import com.extrail.extrail_expense_tracker.services.UserServices;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/users")
public class UserController {

    public static final Logger LOG = LoggerFactory.getLogger(UserController.class);

    @Autowired
    UserServices userServices;

    @GetMapping("/get-all-users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        LOG.info("Entered getAllUsers() in controller...");
        return new ResponseEntity<>(userServices.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/get-existing-users")
    public ResponseEntity<List<UserDto>> getExistingUsers() {
        LOG.info("Entered getExistingUsers() in controller...");
        return new ResponseEntity<>(userServices.getExistingUsers(), HttpStatus.OK);
    }

    @GetMapping("/get-user-by-id")
    public ResponseEntity<UserDto> getUser(@RequestParam Integer userId) {
        LOG.info("Entered getUser() in controller...");
        return new ResponseEntity<>(userServices.getUser(userId), HttpStatus.OK);
    }

    @GetMapping("/get-user-by-username")
    public ResponseEntity<UserDto> getUserByUserName(@RequestParam String userName) {
        LOG.info("Entered getUserByUserName() in controller...");
        return new ResponseEntity<>(userServices.getUserByUserName(userName), HttpStatus.OK);
    }

    @PostMapping("/add-user")
    public ResponseEntity<UserDto> addUser(@Valid @RequestBody UserEntity newUser) {
        LOG.info("Entered addUser() in controller...");
        return new ResponseEntity<>(userServices.addUser(newUser), HttpStatus.OK);
    }

    @PutMapping("/update-user")
    public ResponseEntity<UserDto> updateUser(@Valid @RequestBody UserEntity updatedUser) {
        LOG.info("Entered updateUser() in controller...");
        return new ResponseEntity<>(userServices.updateUser(updatedUser), HttpStatus.OK);
    }

    @PutMapping("/update-password")
    public ResponseEntity<UserDto> updatePassword(@Valid @RequestBody UserPasswordUpdateDto updatedPassword) {
        LOG.info("Entered updatePassword() in controller...");
        return new ResponseEntity<>(userServices.updatePassword(updatedPassword), HttpStatus.OK);
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<Void> deleteUser(@RequestParam Integer userId) {
        LOG.info("Entered deleteUser() in controller...");
        userServices.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<UserDto> authenticate(@Valid @RequestBody UserAthuDto login) {
        LOG.info("Entered authenticate() in controller...");
        return userServices.authenticate(login)
                .map(u -> new ResponseEntity<>(
                        new UserDto(u.getUserId(), u.getUserName(), u.getEmail(), u.getPhone(), u.getRoles(), u.isDeactivated(), u.getCreatedAt()),
                        HttpStatus.OK))
                .orElseThrow(() -> new InvalidActionException("Invalid credentials"));
    }

    @GetMapping("/get-user-by-role")
    public ResponseEntity<List<UserDto>> getUserByRole(@RequestParam String roleName) {
        LOG.info("Entered getUserByRole() in controller...");
        return new ResponseEntity<>(userServices.getUserByRole(roleName), HttpStatus.OK);
    }
}
