package com.extrail.extrail_expense_tracker.exception;

public class UserNameNotFountException extends RuntimeException{
        private final String userName;

    public UserNameNotFountException(String userName) {
        this.userName = userName;
    }

    @Override
    public String getMessage() {
        return "User with userName" + userName + " not found";
    }
}
