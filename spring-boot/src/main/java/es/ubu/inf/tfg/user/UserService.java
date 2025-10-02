package es.ubu.inf.tfg.user;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.mapper.UserMapper;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    //TODO: passwordencoder
    

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<UserResponseDTO> findById(Integer id) {
        return userRepository.findById(id)
                .map(userMapper::toResponseDTO);
    }
    
    public Optional<UserResponseDTO> findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toResponseDTO);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    // --------------------------------------------------------
    
    public UserResponseDTO create(UserRequestDTO userRequest) {

        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new IllegalArgumentException("El username ya está en uso: " + userRequest.getUsername());
        }

        Role role = roleRepository.findById(userRequest.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con ID: " + userRequest.getRoleId()));
        
        User user = User.builder()
                .username(userRequest.getUsername())
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .password(userRequest.getPassword())
                .role(role)
                .build();
        
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }
    
    // TODO: update
    
    public void delete(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
        userRepository.deleteById(id);
    }
}
