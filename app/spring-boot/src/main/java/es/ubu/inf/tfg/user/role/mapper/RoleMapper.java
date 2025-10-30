package es.ubu.inf.tfg.user.role.mapper;

import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.dto.RoleRequestDTO;
import es.ubu.inf.tfg.user.role.dto.RoleResponseDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "users", ignore = true)
    Role toEntity(RoleRequestDTO dto);

    @Mapping(target = "userCount", expression = "java(role.getUsers() != null ? role.getUsers().size() : 0)")
    RoleResponseDTO toResponseDTO(Role role);
}
