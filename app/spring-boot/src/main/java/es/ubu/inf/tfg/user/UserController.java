package es.ubu.inf.tfg.user;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.dto.validation.UserValidationGroups;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    
    private final UserService userService;
    

    @GetMapping
    @PreAuthorize("hasAuthority('USER_VIEW_LIST')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.findAll();
        return ResponseEntity.ok(users);
    }
        
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Integer id) {
        UserResponseDTO user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        UserResponseDTO user = userService.findByUsername(username);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public ResponseEntity<UserResponseDTO> createUser(
            @Validated(UserValidationGroups.OnCreate.class) @RequestBody UserRequestDTO userRequest) {
        UserResponseDTO createdUser = userService.create(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_EDIT_MYSELF') or hasAuthority('USER_EDIT_OTHERS')")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Integer id,
            @Validated(UserValidationGroups.OnUpdate.class) @RequestBody UserRequestDTO userRequest) {
        UserResponseDTO updatedUser = userService.update(id, userRequest);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.existsById(id));
    }

    @GetMapping("/username/{username}/exists")
    public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
        return ResponseEntity.ok(userService.existsByUsername(username));
    }

    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsernameAvailability(@RequestParam String username) {
        boolean available = !userService.existsByUsername(username);
        return ResponseEntity.ok(available);
    }

    // --------------------------------------------------------

    @PostMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('USER_EDIT_OTHERS') and hasAuthority('USER_EDIT_ROLES')")
    public ResponseEntity<UserResponseDTO> addRoleToUser(
            @PathVariable Integer userId,
            @PathVariable Integer roleId) {
        UserResponseDTO user = userService.addRoleToUser(userId, roleId);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('USER_EDIT_OTHERS') and hasAuthority('USER_EDIT_ROLES')")
    public ResponseEntity<UserResponseDTO> removeRoleFromUser(
            @PathVariable Integer userId,
            @PathVariable Integer roleId) {
        UserResponseDTO user = userService.removeRoleFromUser(userId, roleId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}/roles")
    @PreAuthorize("hasAuthority('USER_EDIT_OTHERS') and hasAuthority('USER_EDIT_ROLES')")
    public ResponseEntity<UserResponseDTO> setUserRoles(
            @PathVariable Integer userId,
            @RequestBody Set<Integer> roleIds) {
        UserResponseDTO user = userService.setUserRoles(userId, roleIds);
        return ResponseEntity.ok(user);
    }
}
