package es.ubu.inf.tfg.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between {min} and {max} characters")
    private String username;

    @Size(max = 100, message = "First name cannot exceed {max} characters")
    private String firstName;

    @Size(max = 100, message = "Last name cannot exceed {max} characters")
    private String lastName;

    // Required during creation, but is validated in the service
    private String password;

    // Only required for OWN password change
    private String currentPassword;

    private Set<Integer> roleIds;
}
