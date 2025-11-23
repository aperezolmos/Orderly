package es.ubu.inf.tfg.user.dto.mapper;

import es.ubu.inf.tfg.auth.dto.RegisterRequestDTO;
import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.role.Role;

import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Autowired
    protected PasswordEncoder passwordEncoder;


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", qualifiedByName = "encodePassword")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    public abstract User toEntity(UserRequestDTO dto);

    
    @Mapping(target = "currentPassword", ignore = true)
    @Mapping(target = "roleIds", ignore = true)
    public abstract UserRequestDTO toRequestFromRegister(RegisterRequestDTO dto);

    
    @Mapping(target = "roleIds", expression = "java(mapRolesToIds(user.getRoles()))")
    @Mapping(target = "roleNames", expression = "java(mapRolesToNames(user.getRoles()))")
    @Mapping(target = "roleCount", expression = "java(user.getRoles() != null ? user.getRoles().size() : 0)")
    public abstract UserResponseDTO toResponseDTO(User user);

    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "password", qualifiedByName = "encodePassword",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    public abstract void updateEntityFromDTO(UserRequestDTO dto, @MappingTarget User user);


    // --------------------------------------------------------

    protected Set<Integer> mapRolesToIds(Set<Role> roles) {
        if (roles == null) return Set.of();
        return roles.stream()
                .map(Role::getId)
                .collect(Collectors.toSet());
    }

    protected Set<String> mapRolesToNames(Set<Role> roles) {
        if (roles == null) return Set.of();
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }

    @Named("encodePassword")
    protected String encodePassword(String password) {
        if (password == null || password.isEmpty()) {
            return null;
        }
        return passwordEncoder.encode(password);
    }
}
