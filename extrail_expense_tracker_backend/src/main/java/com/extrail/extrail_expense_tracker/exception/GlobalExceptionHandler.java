package com.extrail.extrail_expense_tracker.exception;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    public static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String TIMESTAMP = "timestamp";
    private static final String ERRORS = "errors";

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValid(MethodArgumentNotValidException me) {
        LOG.error(me.getMessage());
        Map<String, Object> responseData = new HashMap<>();
        Map<String, String> allErrors = new HashMap<>();
        me.getBindingResult()
          .getFieldErrors()
          .stream()
          .forEach(eachError -> allErrors.put(eachError.getField(), eachError.getDefaultMessage()));
        responseData.put(TIMESTAMP, Timestamp.valueOf(LocalDateTime.now()));
        responseData.put(ERRORS, allErrors);
        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = EntityNotFountException.class)
    public ResponseEntity<Map<String, Object>> handleEntityNotFoundException(EntityNotFountException ee) {
        LOG.error(ee.getMessage());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put(TIMESTAMP, Timestamp.valueOf(LocalDateTime.now()));
        responseData.put(ERRORS, ee.getMessage());
        return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = EntityDeletedException.class)
    public ResponseEntity<Map<String, Object>> handleEntityDeletedException(EntityDeletedException ee) {
        LOG.error(ee.getMessage());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put(TIMESTAMP, Timestamp.valueOf(LocalDateTime.now()));
        responseData.put(ERRORS, ee.getMessage());
        return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = InvalidActionException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidActionException(InvalidActionException ee) {
        LOG.error(ee.getMessage());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put(TIMESTAMP, Timestamp.valueOf(LocalDateTime.now()));
        responseData.put(ERRORS, ee.getMessage());
        return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = UserNameNotFountException.class)
    public ResponseEntity<Map<String, Object>> UserNameNotFountException(UserNameNotFountException ee) {
        LOG.error(ee.getMessage());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put(TIMESTAMP, Timestamp.valueOf(LocalDateTime.now()));
        responseData.put(ERRORS, ee.getMessage());
        return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
    }
}
