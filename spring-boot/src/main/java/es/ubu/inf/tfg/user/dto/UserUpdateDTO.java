package es.ubu.inf.tfg.user.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDTO {

    //TODO: incluir después las restricciones de tamaño y estilo
    
    //@Size(min = 3, max = 50, message = "Username debe tener entre 3 y 50 caracteres")
    private String username;

    //@Size(max = 100, message = "Nombre no puede exceder 100 caracteres")
    private String firstName;

    //@Size(max = 100, message = "Apellido no puede exceder 100 caracteres")
    private String lastName;

    /*@Size(min = 6, message = "Password debe tener al menos 6 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", 
             message = "Password debe contener al menos una mayúscula, una minúscula y un número")*/
    private String password;

    private Integer roleId;
}
