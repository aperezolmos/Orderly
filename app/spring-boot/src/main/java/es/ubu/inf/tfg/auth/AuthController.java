package es.ubu.inf.tfg.auth;

import es.ubu.inf.tfg.auth.dto.LoginRequestDTO;
import es.ubu.inf.tfg.auth.dto.RegisterRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        UserResponseDTO user = authService.login(loginRequest);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        UserResponseDTO createdUser = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
    
    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("Auth service is running!");
    }
}
