package es.ubu.inf.tfg.user.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {
   
    @NotBlank(message = "Username es obligatorio")
    @Size(min = 3, max = 50, message = "Username debe tener entre 3 y 50 caracteres")
    private String username;

    @NotBlank(message = "Nombre es obligatorio")
    @Size(max = 100, message = "Nombre no puede exceder 100 caracteres")
    private String firstName;

    @NotBlank(message = "Apellido es obligatorio")
    @Size(max = 100, message = "Apellido no puede exceder 100 caracteres")
    private String lastName;

    @NotBlank(message = "Password es obligatorio")
    @Size(min = 4, message = "Password debe tener al menos 4 caracteres")
    private String password;

    @NotNull(message = "Role ID es obligatorio")
    private Integer roleId;
}
