package es.ubu.inf.tfg.user.role;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.exception.PredefinedRoleDeletionException;
import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.user.role.dto.RoleRequestDTO;
import es.ubu.inf.tfg.user.role.dto.RoleResponseDTO;
import es.ubu.inf.tfg.user.role.dto.mapper.RoleMapper;
import es.ubu.inf.tfg.user.role.permission.Permission;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RoleService {
    
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Value("${DEFAULT_ADMIN_ROLE:ROLE_ADMIN}")
    private String adminRoleName;

    @Value("${DEFAULT_USER_ROLE:ROLE_USER}")
    private String userRoleName;
    

    public List<RoleResponseDTO> findAll() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toResponseDTO)
                .toList();
    }
    
    public RoleResponseDTO findById(Integer id) {
        Role role = findEntityById(id);
        return roleMapper.toDetailedResponseDTO(role);
    }

    public Role findEntityById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));
    }
    
    public RoleResponseDTO findByName(String name) {
        Role role = findEntityByName(name);
        return roleMapper.toDetailedResponseDTO(role);
    }

    public Role findEntityByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with name: " + name));
    }

    public boolean existsById(Integer id) {
        return roleRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return roleRepository.existsByName(name);
    }


    // --------------------------------------------------------
    // CRUD METHODS
    
    public RoleResponseDTO save(RoleRequestDTO roleRequest) {
        
        checkRoleNameExists(roleRequest.getName());
        Role role = roleMapper.toEntity(roleRequest);

        Role savedRole = roleRepository.save(role);
        return roleMapper.toResponseDTO(savedRole);
    }

    public RoleResponseDTO update(Integer id, RoleRequestDTO roleRequest) {
        
        Role existingRole = findEntityById(id);

        if (roleRequest.getName() != null && !roleRequest.getName().equals(existingRole.getName())) {
            checkRoleNameExists(roleRequest.getName());
            existingRole.setName(roleRequest.getName());
        }

        existingRole.setDescription(roleRequest.getDescription());
        existingRole.setPermissions(roleRequest.getPermissions());
        
        Role updatedRole = roleRepository.save(existingRole);
        return roleMapper.toResponseDTO(updatedRole);
    }
    
    public void delete(Integer id) {
        
        Role role = findEntityById(id);

        if (role.getName().equals(adminRoleName) || role.getName().equals(userRoleName)) {
            throw new PredefinedRoleDeletionException(role.getName());
        }

        if (role.getUsers() != null && !role.getUsers().isEmpty()) {
            throw new ResourceInUseException("Role", id, "User");
        }
        roleRepository.delete(role);
    }


    // --------------------------------------------------------
    // DOMAIN METHODS (permissions)

    public RoleResponseDTO addPermission(Integer id, Permission permission) {
        
        Role role = findEntityById(id);
        role.addPermission(permission);
        
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDetailedResponseDTO(updatedRole);
    }

    public RoleResponseDTO removePermission(Integer id, Permission permission) {
        
        Role role = findEntityById(id);
        role.removePermission(permission);

        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDetailedResponseDTO(updatedRole);
    }

    public RoleResponseDTO setPermissions(Integer id, List<Permission> permissions) {
        
        Role role = findEntityById(id);
        role.setPermissions(permissions);

        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDetailedResponseDTO(updatedRole);
    }

    public boolean hasPermission(Integer id, Permission permission) {
        Role role = findEntityById(id);
        return role.getPermissions() != null && role.getPermissions().contains(permission);
    }

    public List<String> getAllPermissions() {
        return Arrays.stream(Permission.values())
                .map(Enum::name)
                .toList();
    }


    // --------------------------------------------------------

    private void checkRoleNameExists(String roleName) {
        if (existsByName(roleName)) {
            throw new IllegalArgumentException("Role with name '" + roleName + "' already exists");
        }
    }
}
