package es.ubu.inf.tfg.user.role;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RoleService {
    
    private final RoleRepository roleRepository;
    

    public List<Role> findAll() {
        return roleRepository.findAll();
    }
    
    public Role findById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));
    }
    
    public Role findByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with name: " + name));
    }

    // --------------------------------------------------------
    
    public Role save(Role role) {
        
        if (roleRepository.existsByName(role.getName())) {
            throw new IllegalArgumentException("Role with name '" + role.getName() + "'' already exists");
        }
        return roleRepository.save(role);
    }

    public Role update(Integer id, Role role) {
        
        Role existingRole = findById(id);

        if (role.getName() != null && !role.getName().equals(existingRole.getName())) {
            if (roleRepository.existsByName(role.getName())) {
                throw new IllegalArgumentException("Role with name '" + role.getName() + "'' already exists");
            }
            existingRole.setName(role.getName());
        }

        existingRole.setDescription(role.getDescription());
        
        return roleRepository.save(existingRole);
    }
    
    public void delete(Integer id) {
        
        Role role = findById(id);
        try {
            roleRepository.delete(role);
        }
        catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Role", id);
        }
    }
}
