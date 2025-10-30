package es.ubu.inf.tfg.user.role.mapper;

import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.dto.RoleRequestDTO;
import es.ubu.inf.tfg.user.role.dto.RoleResponseDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "id", ignore = true)
    Role toEntity(RoleRequestDTO dto);
    
    RoleResponseDTO toResponseDTO(Role role);
}
