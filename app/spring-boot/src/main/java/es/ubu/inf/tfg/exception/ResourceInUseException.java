package es.ubu.inf.tfg.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ResourceInUseException extends RuntimeException {
    
    public ResourceInUseException(String resourceType, Object resourceId, String referencingResourceType) {
        super(String.format(
            "Cannot delete the %s resource with ID %s because it is currently referenced by one or more %s entities.",
            resourceType,
            resourceId.toString(),
            referencingResourceType));
    }
    
    public ResourceInUseException(String message) {
        super(message);
    }

    public ResourceInUseException(String message, Throwable cause) {
        super(message, cause);
    }
}
