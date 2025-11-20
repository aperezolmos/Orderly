package es.ubu.inf.tfg.exception;

import jakarta.persistence.EntityNotFoundException;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        return createErrorResponseEntity(
            HttpStatus.NOT_FOUND, 
            "Resource not found", 
            ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
        return createErrorResponseEntity(
            HttpStatus.BAD_REQUEST, 
            "Authentication failed", 
            ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        
        log.warn("Intento de acceso no autorizado: {}", ex.getMessage());
        
        return createErrorResponseEntity(
            HttpStatus.FORBIDDEN, 
            "Access denied", 
            "You don't have permission to access this resource");
    }

    @ExceptionHandler(ResourceInUseException.class)
    public ResponseEntity<ErrorResponse> handleResourceInUse(ResourceInUseException ex) {
        return createErrorResponseEntity(
            HttpStatus.CONFLICT, 
            "Resource in use", 
            ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return createErrorResponseEntity(
            HttpStatus.BAD_REQUEST, 
            "Invalid request", 
            ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return createErrorResponseEntity(
            HttpStatus.BAD_REQUEST, 
            "Validation error", 
            "Invalid input data", 
            errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {

        log.error("Error genérico no manejado: {}", ex.getMessage());
        log.debug("Stack trace completo del error:", ex);

        return createErrorResponseEntity(
            HttpStatus.INTERNAL_SERVER_ERROR, 
            "Internal server error", 
            "An unexpected error occurred");
    }

    // --------------------------------------------------------

    private ResponseEntity<ErrorResponse> createErrorResponseEntity(
            HttpStatus status, 
            String errorTitle, 
            String message, 
            Map<String, String> details) {

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(errorTitle)
                .message(message)
                .details(details)
                .build();
        
        return new ResponseEntity<>(error, status);
    }
    
    private ResponseEntity<ErrorResponse> createErrorResponseEntity(
            HttpStatus status, 
            String errorTitle, 
            String message) {
        return createErrorResponseEntity(status, errorTitle, message, null);
    }
}
