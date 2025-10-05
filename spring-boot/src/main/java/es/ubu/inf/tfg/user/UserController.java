package es.ubu.inf.tfg.user;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.dto.UserUpdateDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@Slf4j
public class UserController {
    
    private final UserService userService;
    

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.findAll();
        return ResponseEntity.ok(users);
    }
        
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Integer id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO userRequest) {
        try {
            UserResponseDTO createdUser = userService.create(userRequest);
            log.info("Usuario creado exitosamente con ID: {} y username: {}", 
                        createdUser.getId(), createdUser.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } 
        catch (IllegalArgumentException e) {
            log.error("Error al crear usuario - {}: {}", e.getClass().getSimpleName(), e.getMessage());
            log.debug("Stack trace completo del error:", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserUpdateDTO userUpdate) {
        try {
            UserResponseDTO updatedUser = userService.update(id, userUpdate);
            log.info("Usuario actualizado exitosamente con ID: {}", id);
            return ResponseEntity.ok(updatedUser);
        } 
        catch (IllegalArgumentException e) {
            log.error("Error al actualizar usuario con ID {} - {}: {}", 
                     id, e.getClass().getSimpleName(), e.getMessage());
            log.debug("Stack trace completo del error:", e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        try {
            userService.delete(id);
            log.info("Usuario eliminado exitosamente con ID: {}", id);
            return ResponseEntity.noContent().build();
        }
        catch (IllegalArgumentException e) {
            log.error("Error al eliminar usuario con ID {} - {}: {}", 
                        id, e.getClass().getSimpleName(), e.getMessage());
            log.debug("Stack trace completo del error:", e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsernameAvailability(@RequestParam String username) {
        boolean available = !userService.existsByUsername(username);
        return ResponseEntity.ok(available);
    }
}
