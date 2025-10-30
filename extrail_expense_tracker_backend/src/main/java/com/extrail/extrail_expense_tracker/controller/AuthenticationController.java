package com.extrail.extrail_expense_tracker.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.dto.UserAthuDto;
import com.extrail.extrail_expense_tracker.dto.UserDto;
import com.extrail.extrail_expense_tracker.exception.InvalidActionException;
import com.extrail.extrail_expense_tracker.services.JwtService;
import com.extrail.extrail_expense_tracker.services.UserServices;

@CrossOrigin(origins = "http://52.197.2.245", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserServices userService;

    // @PostMapping("/validate")
    // public ResponseEntity<Map<String, Object>> validate(@RequestBody UserAthuDto userInfo) {
    //     Authentication authentication = authenticationManager.authenticate(
    //             new UsernamePasswordAuthenticationToken(userInfo.getUserName(), userInfo.getPasswordHash()));

    //     if (!authentication.isAuthenticated()) {
    //         throw new InvalidActionException("Invalid user request!");
    //     }

    //     if (authentication.isAuthenticated()) {
    //         UserDto user = userService.getUserByUserName(userInfo.getUserName());
    //         if (user.isDeactivated()) {
    //             throw new InvalidActionException("User is deactivated: " + user.getUserId());
    //         }

    //         Map<String, Object> response = new HashMap<>();
    //         response.put("user", user);
    //         response.put("token", jwtService.generateToken(userInfo.getUserName()));
    //         return new ResponseEntity<>(response, HttpStatus.OK);
    //     }else {
    //         throw new InvalidActionException("Authentication failed for user: " + userInfo.getUserName());
    //     }

    // }
    // LOGIN ENDPOINT
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserAthuDto userInfo) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userInfo.getUserName(), userInfo.getPasswordHash()));

        if (!authentication.isAuthenticated()) {
            throw new InvalidActionException("Invalid user request!");
        }

        UserDto user = userService.getUserByUserName(userInfo.getUserName());
        if (user.isDeactivated()) {
            throw new InvalidActionException("User is deactivated: " + user.getUserId());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", jwtService.generateToken(userInfo.getUserName()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // REGISTRATION ENDPOINT (calls existing addUser)
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserEntity newUser) {
        try {
            UserDto createdUser = userService.addUser(newUser);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", createdUser);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new InvalidActionException("Registration failed: " + e.getMessage());
        }
    }
}
