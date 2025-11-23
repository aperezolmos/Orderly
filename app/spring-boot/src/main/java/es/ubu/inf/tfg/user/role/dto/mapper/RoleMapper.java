package es.ubu.inf.tfg.user.role.dto.mapper;

import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.dto.RoleRequestDTO;
import es.ubu.inf.tfg.user.role.dto.RoleResponseDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class RoleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "users", ignore = true)
    public abstract Role toEntity(RoleRequestDTO dto);


    @Mapping(target = "userCount", expression = "java(role.getUsers() != null ? role.getUsers().size() : 0)")
    @Mapping(target = "permissions", ignore = true)
    public abstract RoleResponseDTO toResponseDTO(Role role);


    @Mapping(target = "userCount", expression = "java(role.getUsers() != null ? role.getUsers().size() : 0)")
    public abstract RoleResponseDTO toDetailedResponseDTO(Role role);
}
