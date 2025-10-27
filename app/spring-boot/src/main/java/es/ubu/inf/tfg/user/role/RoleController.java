package es.ubu.inf.tfg.user.role;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Validated
@Slf4j
public class RoleController {
    
    private final RoleService roleService;
    

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.findAll();
        return ResponseEntity.ok(roles);
    }
        
    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Integer id) {
        return roleService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Role> createRole(@Valid @RequestBody Role role) {
        try {
            Role savedRole = roleService.save(role);
            log.info("Rol creado exitosamente con ID: {} y nombre: {}", 
                        savedRole.getId(), savedRole.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRole);
        }
        catch (IllegalArgumentException e) {
            log.error("Error al crear rol - {}: {}", e.getClass().getSimpleName(), e.getMessage());
            log.debug("Stack trace completo del error:", e);
            return ResponseEntity.badRequest().build();
        }        
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(
            @PathVariable Integer id,
            @Valid @RequestBody Role role) {
        try {
            Role updatedRole = roleService.update(id, role);
            log.info("Rol actualizado exitosamente con ID: {}", id);
            return ResponseEntity.ok(updatedRole);
        }
        catch (IllegalArgumentException e) {
            log.error("Error al actualizar rol con ID {} - {}: {}", 
                     id, e.getClass().getSimpleName(), e.getMessage());
            log.debug("Stack trace completo del error:", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        try {
            roleService.delete(id);
            log.info("Rol eliminado exitosamente con ID: {}", id);
            return ResponseEntity.noContent().build();
        } 
        catch (IllegalStateException e) {
            log.error("Error al eliminar rol con ID {} - {}: {}", 
                        id, e.getClass().getSimpleName(), e.getMessage());
            log.debug("Stack trace completo del error:", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } 
        catch (IllegalArgumentException e) {
            log.error("Error al eliminar rol con ID {} - {}: {}", 
                        id, e.getClass().getSimpleName(), e.getMessage());
            log.debug("Stack trace completo del error:", e);
            return ResponseEntity.notFound().build();
        }
    }
}
