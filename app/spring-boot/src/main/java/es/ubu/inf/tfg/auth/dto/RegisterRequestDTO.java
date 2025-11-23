package es.ubu.inf.tfg.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between {min} and {max} characters")
    private String username;

    @Size(max = 100, message = "First name cannot exceed {max} characters")
    private String firstName;

    @Size(max = 100, message = "Last name cannot exceed {max} characters")
    private String lastName;

    @NotBlank(message = "Password is required")
    @Size(min = 4, max = 30, message = "Password must be between {min} and {max} characters")
    private String password;

    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;
}
