package es.ubu.inf.tfg.user.mapper;

import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.role.Role;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import org.mapstruct.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
@RequiredArgsConstructor
@NoArgsConstructor(force = true)
public abstract class UserMapper {

    protected final PasswordEncoder passwordEncoder;


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "password", expression = "java(encodePassword(dto.getPassword()))")
    public abstract User toEntity(UserRequestDTO dto);

    @Mapping(target = "roleIds", expression = "java(mapRolesToIds(user.getRoles()))")
    @Mapping(target = "roleNames", expression = "java(mapRolesToNames(user.getRoles()))")
    @Mapping(target = "roleCount", expression = "java(user.getRoles() != null ? user.getRoles().size() : 0)")
    public abstract UserResponseDTO toResponseDTO(User user);

    // --------------------------------------------------------

    protected String encodePassword(String password) {
        return password != null ? passwordEncoder.encode(password) : null;
    }

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

    // --------------------------------------------------------

    // Method for partial update (ignore password if null)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    public abstract void updateUserFromDTO(UserRequestDTO dto, @MappingTarget User user);
}
