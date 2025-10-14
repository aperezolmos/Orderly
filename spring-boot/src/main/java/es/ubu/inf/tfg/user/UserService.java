package es.ubu.inf.tfg.user;

import java.util.List;
import java.util.Optional;
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

@Service
@Transactional
@RequiredArgsConstructor
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
    
    public UserResponseDTO create(UserRequestDTO userRequest) {
        // Validaciones de grupo OnCreate
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new IllegalArgumentException("El username ya está en uso: " + userRequest.getUsername());
        }

        Role role = roleRepository.findById(userRequest.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con ID: " + userRequest.getRoleId()));
        
        if (!userRequest.getPassword().equals(userRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden.");
        }
        
        User user = User.builder()
                .username(userRequest.getUsername())
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .role(role)
                .build();
        
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    public UserResponseDTO register(UserRequestDTO registerDTO) {
        // Igual que create, pero roleId se asigna por defecto
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso.");
        }

        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden.");
        }

        // Por defecto, los usuarios tendrán ROLE_USER
        // TODO: cambiar -> cuando se implementen varios roles para un mismo usuario
        Role roleUser = roleRepository.findByName("ROLE_USER")
            .orElseThrow(() -> new IllegalArgumentException("Rol ROLE_USER no encontrado."));
        
        User user = User.builder()
                .username(registerDTO.getUsername())
                .firstName(registerDTO.getFirstName())
                .lastName(registerDTO.getLastName())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(roleUser)
                .build();
            
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }
    
    public UserResponseDTO update(Integer id, UserRequestDTO userRequestDTO) {
        // Validaciones de grupo OnUpdate
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
        if (userRequestDTO.getRoleId() != null) {
            Role role = roleRepository.findById(userRequestDTO.getRoleId())
                    .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con ID: " + userRequestDTO.getRoleId()));
            existingUser.setRole(role);
        }
        
        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponseDTO(updatedUser);
    }

    public UserResponseDTO edit(Integer editorId, Integer targetId, UserRequestDTO userRequestDTO) {
        
        User editor = userRepository.findById(editorId)
            .orElseThrow(() -> new IllegalArgumentException("Usuario editor no encontrado con ID: " + editorId));
        User target = userRepository.findById(targetId)
            .orElseThrow(() -> new IllegalArgumentException("Usuario a editar no encontrado con ID: " + targetId));

        boolean isAdmin = editor.getRole().getName().equals("ROLE_ADMIN");
        boolean isSelfEdit = editorId.equals(targetId); // TODO: Trasladar lógica¿?

        // Validaciones de negocio específicas del formulario
        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isBlank()) {
            // Si el editor es el propio usuario, debe introducir la contraseña actual
            if (isSelfEdit) {
                if (userRequestDTO.getCurrentPassword() == null ||
                    !passwordEncoder.matches(userRequestDTO.getCurrentPassword(), target.getPassword())) {
                    throw new IllegalArgumentException("La contraseña actual es incorrecta.");
                }
            }
            // Confirmar nueva contraseña
            if (userRequestDTO.getConfirmPassword() == null ||
                !userRequestDTO.getPassword().equals(userRequestDTO.getConfirmPassword())) {
                throw new IllegalArgumentException("Las contraseñas nuevas no coinciden.");
            }
        }

        // Solo admins pueden cambiar el rol
        if (!isAdmin) {
            userRequestDTO.setRoleId(null);
        }

        return update(targetId, userRequestDTO);
    }

    public void delete(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
        userRepository.deleteById(id);
    }
}
