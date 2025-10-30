package es.ubu.inf.tfg.user.role.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponseDTO {
    private Integer id;
    private String name;
    private String description;
    //private Integer userCount;    // No se puede obtener al ser relacion unidireccional -> ver si sacarlo o no
}
