package es.ubu.inf.tfg.user.role;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.ubu.inf.tfg.user.role.dto.RoleRequestDTO;
import es.ubu.inf.tfg.user.role.dto.RoleResponseDTO;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RoleController {
    
    private final RoleService roleService;
    

    @GetMapping
    public ResponseEntity<List<RoleResponseDTO>> getAllRoles() {
        List<RoleResponseDTO> roles = roleService.findAll();
        return ResponseEntity.ok(roles);
    }
        
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponseDTO> getRoleById(@PathVariable Integer id) {
        RoleResponseDTO role = roleService.findById(id);
        return ResponseEntity.ok(role);
    }
    
    @GetMapping("/name/{name}")
    public ResponseEntity<RoleResponseDTO> getRoleByName(@PathVariable String name) {
        RoleResponseDTO role = roleService.findByName(name);
        return ResponseEntity.ok(role);
    }
    
    @PostMapping
    public ResponseEntity<RoleResponseDTO> createRole(@Valid @RequestBody RoleRequestDTO roleRequest) {
        RoleResponseDTO savedRole = roleService.save(roleRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRole);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponseDTO> updateRole(
            @PathVariable Integer id,
            @Valid @RequestBody RoleRequestDTO roleRequest) {
        RoleResponseDTO updatedRole = roleService.update(id, roleRequest);
        return ResponseEntity.ok(updatedRole);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        roleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkRoleExists(@PathVariable Integer id) {
        return ResponseEntity.ok(roleService.existsById(id));
    }

    @GetMapping("/name/{name}/exists")
    public ResponseEntity<Boolean> checkRoleNameExists(@PathVariable String name) {
        return ResponseEntity.ok(roleService.existsByName(name));
    }
}
