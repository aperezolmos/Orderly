package es.ubu.inf.tfg.user.role;

import java.util.List;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.user.role.dto.RoleRequestDTO;
import es.ubu.inf.tfg.user.role.dto.RoleResponseDTO;
import es.ubu.inf.tfg.user.role.mapper.RoleMapper;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RoleService {
    
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;
    

    public List<RoleResponseDTO> findAll() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toResponseDTO)
                .toList();
    }
    
    public RoleResponseDTO findById(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));
        return roleMapper.toResponseDTO(role);
    }

    public Role findEntityById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));
    }
    
    public RoleResponseDTO findByName(String name) {
        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with name: " + name));
        return roleMapper.toResponseDTO(role);
    }

    public boolean existsById(Integer id) {
        return roleRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return roleRepository.existsByName(name);
    }

    // --------------------------------------------------------
    
    public RoleResponseDTO save(RoleRequestDTO roleRequest) {
        
        if (existsByName(roleRequest.getName())) {
            throw new IllegalArgumentException("Role with name '" + roleRequest.getName() + "' already exists");
        }
        
        Role role = roleMapper.toEntity(roleRequest);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toResponseDTO(savedRole);
    }

    public RoleResponseDTO update(Integer id, RoleRequestDTO roleRequest) {
        
        Role existingRole = findEntityById(id);

        if (roleRequest.getName() != null && !roleRequest.getName().equals(existingRole.getName())) {
            if (existsByName(roleRequest.getName())) {
                throw new IllegalArgumentException("Role with name '" + roleRequest.getName() + "' already exists");
            }
            existingRole.setName(roleRequest.getName());
        }

        existingRole.setDescription(roleRequest.getDescription());
        
        Role updatedRole = roleRepository.save(existingRole);
        return roleMapper.toResponseDTO(updatedRole);
    }
    
    public void delete(Integer id) {
        
        Role role = findEntityById(id);
        
        if (role.getUsers() != null && !role.getUsers().isEmpty()) {
            throw new ResourceInUseException("Role", id, "User");
        }
        roleRepository.delete(role);
    }
}
