package es.ubu.inf.tfg.user.role.dto;

import java.util.List;

import es.ubu.inf.tfg.user.role.permission.Permission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleRequestDTO {

    @NotBlank(message = "Role name is required")
    @Size(max = 50, message = "Name cannot exceed {max} characters")
    private String name;

    @Size(max = 255, message = "Description cannot exceed {max} characters")
    private String description;

    private List<Permission> permissions;
}