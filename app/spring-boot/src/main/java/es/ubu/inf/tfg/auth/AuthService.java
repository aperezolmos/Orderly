package es.ubu.inf.tfg.auth;

import es.ubu.inf.tfg.auth.dto.LoginRequestDTO;
import es.ubu.inf.tfg.auth.dto.RegisterRequestDTO;
import es.ubu.inf.tfg.exception.InvalidCredentialsException;
import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserService;
import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.mapper.UserMapper;

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


    public UserResponseDTO login(LoginRequestDTO loginRequest) {

        User user = userService.findEntityByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException());

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }
        return userMapper.toResponseDTO(user);
    }

    public UserResponseDTO register(RegisterRequestDTO registerRequest) {
        UserRequestDTO userRequest = userMapper.toRequestFromRegister(registerRequest);
        return userService.create(userRequest);
    }
}
