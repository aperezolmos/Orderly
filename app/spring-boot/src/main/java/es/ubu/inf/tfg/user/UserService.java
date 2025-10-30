package es.ubu.inf.tfg.user;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.mapper.UserMapper;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final RoleService roleService;
    private final UserMapper userMapper;

    @Value("${DEFAULT_USER_ROLE:ROLE_USER}")
    private String defaultUserRole;


    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponseDTO)
                .toList();
    }
    
    public UserResponseDTO findById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return userMapper.toResponseDTO(user);
    }

    public User findEntityById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }
    
    public UserResponseDTO findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + username));
        return userMapper.toResponseDTO(user);
    }

    public boolean existsById(Integer id) {
        return userRepository.existsById(id);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    // --------------------------------------------------------

    public UserResponseDTO create(UserRequestDTO userRequest) {
        
        if (existsByUsername(userRequest.getUsername())) {
            throw new IllegalArgumentException("Username '" + userRequest.getUsername() + "' is already in use");
        }

        if (!userRequest.getPassword().equals(userRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        Set<Role> roles = validateAndLoadRoles(userRequest.getRoleIds());
        
        // Granted role by default
        Role userRole = roleService.findEntityByName(defaultUserRole); 
        roles.add(userRole);

        User user = userMapper.toEntity(userRequest);
        user.setRoles(roles);
        
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    public UserResponseDTO update(Integer id, UserRequestDTO userRequest) {
        
        User existingUser = findEntityById(id);

        // Update username if changed and not already taken
        if (userRequest.getUsername() != null && !userRequest.getUsername().equals(existingUser.getUsername())) {
            if (existsByUsername(userRequest.getUsername())) {
                throw new IllegalArgumentException("Username '" + userRequest.getUsername() + "' is already in use");
            }
        }

        // Update basic fields
        userMapper.updateUserFromDTO(userRequest, existingUser);

        // Handle password update if provided -> mapper already encodes it
        if (userRequest.getPassword() != null && !userRequest.getPassword().isBlank()) {
            if (!userRequest.getPassword().equals(userRequest.getConfirmPassword())) {
                throw new IllegalArgumentException("Passwords do not match");
            }
        }

        // Update roles if provided
        if (userRequest.getRoleIds() != null && !userRequest.getRoleIds().isEmpty()) {
            Set<Role> roles = validateAndLoadRoles(userRequest.getRoleIds());
            Role userRole = roleService.findEntityByName(defaultUserRole);
            roles.add(userRole);
            existingUser.setRoles(roles);
        }

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponseDTO(updatedUser);
    }

    public void delete(Integer id) {
        User user = findEntityById(id);
        userRepository.delete(user);
    }

    // --------------------------------------------------------

    public UserResponseDTO addRoleToUser(Integer userId, Integer roleId) {
        
        User user = findEntityById(userId);
        Role role = roleService.findEntityById(roleId);

        user.addRole(role);
        
        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }

    public UserResponseDTO removeRoleFromUser(Integer userId, Integer roleId) {
        
        User user = findEntityById(userId);
        Role role = roleService.findEntityById(roleId);

        user.removeRole(role);
        
        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }

    public UserResponseDTO setUserRoles(Integer userId, Set<Integer> roleIds) {
        
        User user = findEntityById(userId);

        Set<Role> roles = validateAndLoadRoles(roleIds);
        
        // Keep roles in sync (bidirectional)
        user.clearRoles();
        for (Role role : roles) {
            user.addRole(role);
        }

        // Granted role by default
        Role userRole = roleService.findEntityByName(defaultUserRole);
        user.addRole(userRole);
        
        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }

    // --------------------------------------------------------

    private Set<Role> validateAndLoadRoles(Set<Integer> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            throw new IllegalArgumentException("At least one role must be assigned");
        }

        return roleIds.stream()
                .map(roleId -> roleService.findEntityById(roleId))
                .collect(Collectors.toSet());
    }
}
