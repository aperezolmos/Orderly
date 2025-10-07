package es.ubu.inf.tfg.user.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEditDTO {

    @Size(min = 3, max = 50, message = "Username debe tener entre 3 y 50 caracteres")
    private String username;

    @Size(max = 100, message = "Nombre no puede exceder 100 caracteres")
    private String firstName;

    @Size(max = 100, message = "Apellido no puede exceder 100 caracteres")
    private String lastName;

    @Size(min = 4, message = "Password debe tener al menos 4 caracteres")
    private String password;

    private String confirmPassword;
    private String currentPassword;
    private Integer roleId; // Solo visible para admins
}
