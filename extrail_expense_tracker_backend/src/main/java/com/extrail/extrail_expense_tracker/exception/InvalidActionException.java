package com.extrail.extrail_expense_tracker.exception;

public class InvalidActionException extends RuntimeException {
    private final String message;

    public InvalidActionException(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
