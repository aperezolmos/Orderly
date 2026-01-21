package es.ubu.inf.tfg.auth;

import es.ubu.inf.tfg.auth.dto.LoginRequestDTO;
import es.ubu.inf.tfg.auth.dto.RegisterRequestDTO;
import es.ubu.inf.tfg.exception.InvalidCredentialsException;
import es.ubu.inf.tfg.security.CustomUserDetails;
import es.ubu.inf.tfg.user.UserService;
import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.dto.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    
    private final UserService userService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    

    public UserResponseDTO login(LoginRequestDTO loginRequest, HttpServletRequest request, HttpServletResponse response) {
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            // Set the context and save the session (JSESSIONID)
            SecurityContextHolder.getContext().setAuthentication(authentication);
            securityContextRepository.saveContext(SecurityContextHolder.getContext(), request, response);

            return userService.findByUsername(loginRequest.getUsername());
        } 
        catch (AuthenticationException e) { throw new InvalidCredentialsException(); }
    }
    
    public UserResponseDTO register(RegisterRequestDTO registerRequest, HttpServletRequest request, HttpServletResponse response) {
        
        validatePasswordMatch(registerRequest);

        UserRequestDTO userRequest = userMapper.toRequestFromRegister(registerRequest); 
        UserResponseDTO createdUser = userService.create(userRequest); 

        // The newly created user is authenticated so that they are already logged in
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(registerRequest.getUsername(), registerRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        securityContextRepository.saveContext(SecurityContextHolder.getContext(), request, response);

        return createdUser;
    }

    public void logout(HttpServletRequest request) {

        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    public UserResponseDTO getCurrentUser(CustomUserDetails userDetails) {
        return userService.findByUsername(userDetails.getUsername());
    }


    // --------------------------------------------------------

    private void validatePasswordMatch(RegisterRequestDTO registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
    }
}
