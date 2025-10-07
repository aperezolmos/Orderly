package es.ubu.inf.tfg.user.mapper;

import org.springframework.stereotype.Component;

import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.dto.UserEditDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.dto.UserUpdateDTO;

@Component
public class UserMapper {
    
    public UserResponseDTO toResponseDTO(User user) {
        if (user == null) return null;
        
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roleId(user.getRole().getId())
                .roleName(user.getRole().getName())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserUpdateDTO toUpdateDTO(UserEditDTO editDTO) {
        if (editDTO == null) return null;
        
        return UserUpdateDTO.builder()
                .username(editDTO.getUsername())
                .firstName(editDTO.getFirstName())
                .lastName(editDTO.getLastName())
                .password(editDTO.getPassword())
                .roleId(editDTO.getRoleId())
                .build();
    }
    
    //TODO: toentity¿?
}
