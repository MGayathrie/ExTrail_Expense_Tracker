package com.extrail.extrail_expense_tracker.exception;

public class EntityNotFountException extends RuntimeException {
    private final Integer id;
    private final String name;
    private final String entity;

    public EntityNotFountException(Integer id, String entity) {
        this.id = id;
        this.name = "";
        this.entity = entity;
    }

    public EntityNotFountException(String name, String entity) {
        this.name = name;
        this.id = -1;
        this.entity = entity;
    }

    @Override
    public String getMessage() {
        if (name != null && !name.isEmpty()) {
            return entity + " with name: " + name + " not found";
        } else {
            return entity + " with id: " + id + " not found";
        }
    }
}
