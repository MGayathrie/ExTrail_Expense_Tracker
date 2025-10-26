package com.extrail.extrail_expense_tracker.exception;

public class EntityDeletedException extends RuntimeException {
    private final Integer id;
    private final String name;
    private final String entity;

    public EntityDeletedException(Integer id, String entity) {
        this.id = id;
        this.name = "";
        this.entity = entity;
    }

    public EntityDeletedException(String name, String entity) {
        this.name = name;
        this.id = -1;
        this.entity = entity;
    }

    @Override
    public String getMessage() {
        if (name != null && !name.isEmpty()) {
            return entity + " with name: " + name + " deleted";
        } else {
            return entity + " with id: " + id + " deleted";
        }
    }
}
