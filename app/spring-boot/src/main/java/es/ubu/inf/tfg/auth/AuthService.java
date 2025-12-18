package es.ubu.inf.tfg.auth;

import es.ubu.inf.tfg.auth.dto.LoginRequestDTO;
import es.ubu.inf.tfg.auth.dto.RegisterRequestDTO;
import es.ubu.inf.tfg.exception.InvalidCredentialsException;
import es.ubu.inf.tfg.security.CustomUserDetails;
import es.ubu.inf.tfg.security.session.SessionManager;
import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserService;
import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.dto.mapper.UserMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    
    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final SessionManager sessionManager;


    public UserResponseDTO login(LoginRequestDTO loginRequest, HttpServletRequest request) {
        
        User user = validateCredentials(loginRequest);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        sessionManager.authenticateUser(userDetails, request);
        
        return userMapper.toResponseDTO(user);
    }
    
    public UserResponseDTO register(RegisterRequestDTO registerRequest, HttpServletRequest request) {
        
        validatePasswordMatch(registerRequest);

        UserRequestDTO userRequest = userMapper.toRequestFromRegister(registerRequest);
        UserResponseDTO createdUser = userService.create(userRequest);
        
        User user = userService.findEntityByUsername(createdUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("User not found after creation"));
        
        CustomUserDetails userDetails = new CustomUserDetails(user);
        sessionManager.authenticateUser(userDetails, request);
        
        return createdUser;
    }
    
    public void logout(HttpServletRequest request) {
        sessionManager.logoutUser(request);
    }
    
    public UserResponseDTO getCurrentUser(User user) {
        return userMapper.toResponseDTO(user);
    }
    
    
    // --------------------------------------------------------

    private User validateCredentials(LoginRequestDTO loginRequest) {
        
        User user = userService.findEntityByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException());

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }
        return user;
    }
    
    private void validatePasswordMatch(RegisterRequestDTO registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
    }
}
