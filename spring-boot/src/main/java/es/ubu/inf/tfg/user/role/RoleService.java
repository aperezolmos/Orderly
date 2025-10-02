package es.ubu.inf.tfg.user.role;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

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
    
    public Optional<Role> findById(Integer id) {
        return roleRepository.findById(id);
    }
    
    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    public boolean existsById(Integer id) {
        return roleRepository.existsById(id);
    }

    // --------------------------------------------------------
    
    public Role save(Role role) {
        if (roleRepository.existsByName(role.getName())) {
            throw new IllegalArgumentException("Ya existe un rol con el nombre: " + role.getName());
        }
        return roleRepository.save(role);
    }

    // TODO: update¿?
    
    public void delete(Integer id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con ID: " + id));
        
        if (!role.getUsers().isEmpty()) {
            throw new IllegalStateException("No se puede eliminar el rol. Hay usuarios asignados a este rol.");
        }
        
        roleRepository.delete(role);
    }
}
