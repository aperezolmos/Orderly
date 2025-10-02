package es.ubu.inf.tfg.user.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {

    //TODO: incluir después las restricciones de tamaño y estilo
    
    @NotBlank(message = "Username es obligatorio")
    //@Size(min = 3, max = 50, message = "Username debe tener entre 3 y 50 caracteres")
    private String username;

    @NotBlank(message = "Nombre es obligatorio")
    @Size(max = 100, message = "Nombre no puede exceder 100 caracteres")
    private String firstName;

    @NotBlank(message = "Apellido es obligatorio")
    @Size(max = 100, message = "Apellido no puede exceder 100 caracteres")
    private String lastName;

    @NotBlank(message = "Password es obligatorio")
    /*@Size(min = 6, message = "Password debe tener al menos 6 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", 
             message = "Password debe contener al menos una mayúscula, una minúscula y un número")*/ //TODO: incluir después
    private String password;

    //TODO: confirmar contraseña?? -> o dto aparte para registro

    //@NotNull(message = "Role ID es obligatorio")
    private Integer roleId;
}
