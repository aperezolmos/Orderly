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
    private Integer userCount;
}
