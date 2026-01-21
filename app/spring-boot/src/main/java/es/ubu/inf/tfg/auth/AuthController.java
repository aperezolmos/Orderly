package es.ubu.inf.tfg.auth;

import es.ubu.inf.tfg.auth.dto.LoginRequestDTO;
import es.ubu.inf.tfg.auth.dto.RegisterRequestDTO;
import es.ubu.inf.tfg.security.CustomUserDetails;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(
            @RequestBody @Valid LoginRequestDTO loginRequest, 
            HttpServletRequest request, 
            HttpServletResponse response) {
        
        UserResponseDTO userDTO = authService.login(loginRequest, request, response);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(
            @RequestBody @Valid RegisterRequestDTO registerRequest,
            HttpServletRequest request,
            HttpServletResponse response) {
        
        UserResponseDTO userDTO = authService.register(registerRequest, request, response);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserResponseDTO userDTO = authService.getCurrentUser(userDetails);
        return ResponseEntity.ok(userDTO);
    }
}
