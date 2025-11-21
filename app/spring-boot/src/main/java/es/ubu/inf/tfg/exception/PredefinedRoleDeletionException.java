package es.ubu.inf.tfg.exception;

public class PredefinedRoleDeletionException extends RuntimeException {

    public PredefinedRoleDeletionException(String roleName) {
        super("Deletion of the predefined role '" + roleName + "' is not allowed");
    }

    public PredefinedRoleDeletionException(String message, Throwable cause){
        super(message, cause);
    }
}
