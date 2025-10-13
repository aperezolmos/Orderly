package es.ubu.inf.tfg.user.dto;

import es.ubu.inf.tfg.user.dto.validation.UserValidationGroups;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {
   
    @NotBlank(message = "El nombre de usuario es obligatorio", 
                groups = UserValidationGroups.OnCreate.class)
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres", 
            groups = {UserValidationGroups.OnCreate.class, 
                        UserValidationGroups.OnUpdate.class})
    private String username;

    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres", 
            groups = {UserValidationGroups.OnCreate.class, 
                        UserValidationGroups.OnUpdate.class})
    private String firstName;

    @Size(max = 100, message = "El apellido no puede exceder 100 caracteres", 
            groups = {UserValidationGroups.OnCreate.class, 
                        UserValidationGroups.OnUpdate.class})
    private String lastName;

    @NotBlank(message = "La contraseña es obligatoria", 
                groups = UserValidationGroups.OnCreate.class)
    @Size(min = 4, message = "La contraseña debe tener al menos 4 caracteres", 
            groups = {UserValidationGroups.OnCreate.class, 
                        UserValidationGroups.OnPasswordChange.class})
    private String password;

    @NotBlank(message = "Debe confirmar la contraseña", 
                groups = {UserValidationGroups.OnCreate.class, 
                            UserValidationGroups.OnPasswordChange.class})
    private String confirmPassword;

    // Solo para edición propia
    private String currentPassword;

    // Solo para admins
    /*@NotNull(message = "Role ID es obligatorio", 
                groups = UserValidationGroups.OnCreate.class)*/ // TODO: revisar obligatoriedad
    private Integer roleId;
}
