package es.ubu.inf.tfg.user.dto;

import es.ubu.inf.tfg.user.dto.validation.UserValidationGroups;

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
   
    @NotBlank(message = "Username is required", 
                groups = UserValidationGroups.OnCreate.class)
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters",
            groups = {UserValidationGroups.OnCreate.class,
                        UserValidationGroups.OnUpdate.class})
    private String username;

    @Size(max = 100, message = "First name cannot exceed 100 characters", 
            groups = {UserValidationGroups.OnCreate.class, 
                        UserValidationGroups.OnUpdate.class})
    private String firstName;

    @Size(max = 100, message = "Last name cannot exceed 100 characters", 
            groups = {UserValidationGroups.OnCreate.class, 
                        UserValidationGroups.OnUpdate.class})
    private String lastName;

    @NotBlank(message = "Password is required", 
                groups = UserValidationGroups.OnCreate.class)
    /*@Size(min = 4, message = "Password must be at least 4 characters", 
            groups = {UserValidationGroups.OnCreate.class, 
                        UserValidationGroups.OnPasswordChange.class})*/
    private String password;

    @NotBlank(message = "Password confirmation is required", 
                groups = {UserValidationGroups.OnCreate.class, 
                            UserValidationGroups.OnPasswordChange.class})
    private String confirmPassword;

    // Only required for OWN password change
    private String currentPassword;

    private Set<Integer> roleIds;
}
