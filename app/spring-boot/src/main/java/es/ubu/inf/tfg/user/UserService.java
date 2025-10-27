package es.ubu.inf.tfg.user;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.mapper.UserMapper;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


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
    // MÉTODOS PARA CONTROLADORES WEB (FORMULARIOS)
 
    public UserResponseDTO register(UserRequestDTO registerDTO) {
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso.");
        }

        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden.");
        }

        Role roleUser = roleRepository.findByName("ROLE_USER")
            .orElseThrow(() -> new IllegalArgumentException("Rol ROLE_USER no encontrado."));
        
        Set<Role> roles = new HashSet<>();
        roles.add(roleUser);

        User user = User.builder()
                .username(registerDTO.getUsername())
                .firstName(registerDTO.getFirstName())
                .lastName(registerDTO.getLastName())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .roles(roles)
                .build();
            
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    public UserResponseDTO edit(Integer targetId, UserRequestDTO userRequestDTO, boolean isAdmin) {
        
        User target = userRepository.findById(targetId)
            .orElseThrow(() -> new IllegalArgumentException("Usuario a editar no encontrado con ID: " + targetId));

        // Username
        if (userRequestDTO.getUsername() != null && !userRequestDTO.getUsername().equals(target.getUsername())) {
            if (userRepository.existsByUsername(userRequestDTO.getUsername())) {
                throw new IllegalArgumentException("El username ya está en uso: " + userRequestDTO.getUsername());
            }
            target.setUsername(userRequestDTO.getUsername());
            log.info("<Username editado>");
        }

        // Nombre y apellidos
        target.setFirstName(userRequestDTO.getFirstName());
        target.setLastName(userRequestDTO.getLastName());

        // Password
        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isBlank()) {
            if (userRequestDTO.getConfirmPassword() == null ||
                !userRequestDTO.getPassword().equals(userRequestDTO.getConfirmPassword())) {
                throw new IllegalArgumentException("Las contraseñas nuevas no coinciden.");
            }
            if (!isAdmin) {
                if (userRequestDTO.getCurrentPassword() == null ||
                    !passwordEncoder.matches(userRequestDTO.getCurrentPassword(), target.getPassword())) {
                    throw new IllegalArgumentException("La contraseña actual es incorrecta.");
                }
            }
            log.info("<Password editado>");
            target.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }

        // Roles -> solo admins pueden cambiarlos. Asegurar ROLE_USER siempre presente.
        if (isAdmin && userRequestDTO.getRoleIds() != null) {
            Set<Role> newRoles = userRequestDTO.getRoleIds().stream()
                .map(id -> roleRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con ID: " + id)))
                .collect(Collectors.toSet());
            
            roleRepository.findByName("ROLE_USER").ifPresent(newRoles::add);
            target.setRoles(newRoles);
            log.info("<Roles editados>");
        }

        User updatedUser = userRepository.save(target);
        return userMapper.toResponseDTO(updatedUser);
    }

    // --------------------------------------------------------
    // MÉTODOS PARA CONTROLADORES REST

    public UserResponseDTO create(UserRequestDTO userRequest) {
        
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new IllegalArgumentException("El username ya está en uso: " + userRequest.getUsername());
        }

        if (userRequest.getRoleIds() == null || userRequest.getRoleIds().isEmpty()) {
            throw new IllegalArgumentException("Debe asignar al menos un rol.");
        }

        if (!userRequest.getPassword().equals(userRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden.");
        }

        Set<Role> roles = userRequest.getRoleIds().stream()
                .map(id -> roleRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con ID: " + id)))
                .collect(Collectors.toSet());

        // garantizar ROLE_USER mínimo
        roleRepository.findByName("ROLE_USER").ifPresent(roles::add);
        
        User user = User.builder()
                .username(userRequest.getUsername())
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .roles(roles)
                .build();
        
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    public UserResponseDTO update(Integer id, UserRequestDTO userRequestDTO) {
        
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
        
        if (userRequestDTO.getUsername() != null && !userRequestDTO.getUsername().equals(existingUser.getUsername())) {
            if (userRepository.existsByUsername(userRequestDTO.getUsername())) {
                throw new IllegalArgumentException("El username ya está en uso: " + userRequestDTO.getUsername());
            }
            existingUser.setUsername(userRequestDTO.getUsername());
        }
        
        existingUser.setFirstName(userRequestDTO.getFirstName());
        existingUser.setLastName(userRequestDTO.getLastName());

        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isBlank()) {
            if (!userRequestDTO.getPassword().equals(userRequestDTO.getConfirmPassword())) {
                throw new IllegalArgumentException("Las contraseñas nuevas no coinciden.");
            }
            existingUser.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }
        if (userRequestDTO.getRoleIds() != null && !userRequestDTO.getRoleIds().isEmpty()) {
            Set<Role> roles = userRequestDTO.getRoleIds().stream()
                    .map(roleId -> roleRepository.findById(roleId)
                            .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con ID: " + roleId)))
                    .collect(Collectors.toSet());
            roleRepository.findByName("ROLE_USER").ifPresent(roles::add);
            existingUser.setRoles(roles);
        }
        
        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponseDTO(updatedUser);
    }

    public void delete(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
        userRepository.deleteById(id);
    }
}
