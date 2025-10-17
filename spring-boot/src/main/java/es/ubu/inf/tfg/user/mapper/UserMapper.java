package es.ubu.inf.tfg.user.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.role.Role;

@Component
public class UserMapper {
    
    public UserResponseDTO toResponseDTO(User user) {
        
        if (user == null) return null;

        Set<Integer> roleIds = user.getRoles().stream().map(Role::getId).collect(Collectors.toSet());
        Set<String> roleNames = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roleIds(roleIds)
                .roleNames(roleNames)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
