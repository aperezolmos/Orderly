package es.ubu.inf.tfg.user;

import es.ubu.inf.tfg.auth.dto.RegisterRequestDTO;
import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.dto.mapper.UserMapperImpl;
import es.ubu.inf.tfg.user.role.Role;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class) 
class UserMapperTest {

    @InjectMocks
    private UserMapperImpl userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    private static final Integer USER_ID = 1;
    private static final String USERNAME = "testuser";
    private static final String FIRST_NAME = "Test";
    private static final String LAST_NAME = "User";
    private static final String PASSWORD = "password123";
    private static final String ENCODED_PASSWORD = "$2a$10$encodedpassword";
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();
    
    private static final String ROLE_ADMIN = "ROLE_ADMIN";
    private static final String ROLE_USER = "ROLE_USER";
    private static final Integer ROLE_COUNT = 2;
    private static final String NEW_USERNAME = "newusername";
    private static final String NEW_PASSWORD = "newpassword";
    private static final String NEW_ENCODED_PASSWORD = "$2a$10$newencodedpassword";
    private static final String NEW_FIRST_NAME = "newfirstname";
    private static final String NEW_LAST_NAME = "newlastname";

    private UserRequestDTO userRequestDTO;
    private RegisterRequestDTO registerRequestDTO;
    private User userEntity;
    private User userEntityWithRoles;


    @BeforeEach
    void setUp() {

        userRequestDTO = UserRequestDTO.builder()
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .currentPassword("currentPass123")
                .roleIds(new HashSet<>(Arrays.asList(1, 2)))
                .build();

        registerRequestDTO = new RegisterRequestDTO();
        registerRequestDTO.setUsername(USERNAME);
        registerRequestDTO.setFirstName(FIRST_NAME);
        registerRequestDTO.setLastName(LAST_NAME);
        registerRequestDTO.setPassword(PASSWORD);
        registerRequestDTO.setConfirmPassword(PASSWORD);

        userEntity = User.builder()
                .id(USER_ID)
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(ENCODED_PASSWORD)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .roles(new HashSet<>())
                .build();


        Role role1 = Role.builder().id(1).name(ROLE_ADMIN).build();
        Role role2 = Role.builder().id(2).name(ROLE_USER).build();
        
        userEntityWithRoles = User.builder()
                .id(USER_ID)
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(ENCODED_PASSWORD)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .roles(new HashSet<>(Arrays.asList(role1, role2)))
                .build();
    }


    // --------------------------------------------------------

    @Test
    void toEntity_FromValidDTO_ShouldMapCorrectly() {

        when(passwordEncoder.encode(PASSWORD)).thenReturn(ENCODED_PASSWORD);
        
        User user = userMapper.toEntity(userRequestDTO);

        assertThat(user.getId()).isNull();
        assertThat(user.getUsername()).isEqualTo(USERNAME);
        assertThat(user.getFirstName()).isEqualTo(FIRST_NAME);
        assertThat(user.getLastName()).isEqualTo(LAST_NAME);
        assertThat(user.getPassword()).isEqualTo(ENCODED_PASSWORD);
        assertThat(user.getRoles()).isNull();
        assertThat(user.getCreatedAt()).isNull();
        assertThat(user.getUpdatedAt()).isNull();
    }

    @Test
    void toEntity_FromDTOWithNullOrEmptyPassword_ShouldSetNullPassword() {
        
        userRequestDTO.setPassword(null);

        User user1 = userMapper.toEntity(userRequestDTO);

        assertThat(user1.getPassword()).isNull();
        

        userRequestDTO.setPassword("");

        User user2 = userMapper.toEntity(userRequestDTO);

        assertThat(user2.getPassword()).isNull();
    }

    @Test
    void toRequestFromRegister_FromValidRegisterDTO_ShouldMapCorrectly() {
        
        UserRequestDTO result = userMapper.toRequestFromRegister(registerRequestDTO);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo(USERNAME);
        assertThat(result.getFirstName()).isEqualTo(FIRST_NAME);
        assertThat(result.getLastName()).isEqualTo(LAST_NAME);
        assertThat(result.getPassword()).isEqualTo(PASSWORD);
        assertThat(result.getCurrentPassword()).isNull();
        assertThat(result.getRoleIds()).isNull();
    }

    @Test
    void toRequestFromRegister_FromNullRegisterDTO_ShouldReturnNull() {
        
        UserRequestDTO result = userMapper.toRequestFromRegister(null);

        assertThat(result).isNull();
    }

    @Test
    void toResponseDTO_FromUserWithRoles_ShouldMapCorrectly() {
        
        UserResponseDTO dto = userMapper.toResponseDTO(userEntityWithRoles);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(USER_ID);
        assertThat(dto.getUsername()).isEqualTo(USERNAME);
        assertThat(dto.getFirstName()).isEqualTo(FIRST_NAME);
        assertThat(dto.getLastName()).isEqualTo(LAST_NAME);
        assertThat(dto.getCreatedAt()).isEqualTo(CREATED_AT);
        assertThat(dto.getUpdatedAt()).isEqualTo(UPDATED_AT);
        assertThat(dto.getRoleIds()).containsExactlyInAnyOrder(1, 2);
        assertThat(dto.getRoleNames()).containsExactlyInAnyOrder(ROLE_ADMIN, ROLE_USER);
        assertThat(dto.getRoleCount()).isEqualTo(ROLE_COUNT);
    }

    @Test
    void toResponseDTO_FromUserWithoutRoles_ShouldMapWithEmptyRoleCollections() {
        
        UserResponseDTO dto = userMapper.toResponseDTO(userEntity);

        assertThat(dto.getRoleIds()).isEmpty();
        assertThat(dto.getRoleNames()).isEmpty();
        assertThat(dto.getRoleCount()).isZero();
    }

    @Test
    void toResponseDTO_FromUserWithNullRoles_ShouldMapWithEmptyRoleCollections() {
        
        userEntity.setRoles(null);

        UserResponseDTO dto = userMapper.toResponseDTO(userEntity);

        assertThat(dto.getRoleIds()).isEmpty();
        assertThat(dto.getRoleNames()).isEmpty();
        assertThat(dto.getRoleCount()).isZero();
    }

    @Test
    void updateEntityFromDTO_WithValidDTO_ShouldUpdateNonNullFields() {

        when(passwordEncoder.encode(NEW_PASSWORD)).thenReturn(NEW_ENCODED_PASSWORD);
        
        UserRequestDTO updateDTO = UserRequestDTO.builder()
                .username(NEW_USERNAME)
                .firstName(NEW_FIRST_NAME)
                .lastName(NEW_LAST_NAME)
                .password(NEW_PASSWORD)
                .build();

        User existingUser = User.builder()
                .id(USER_ID)
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(ENCODED_PASSWORD)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .roles(new HashSet<>())
                .build();

        userMapper.updateEntityFromDTO(updateDTO, existingUser);

        assertThat(existingUser.getId()).isEqualTo(USER_ID);
        assertThat(existingUser.getUsername()).isEqualTo(NEW_USERNAME);
        assertThat(existingUser.getFirstName()).isEqualTo(NEW_FIRST_NAME);
        assertThat(existingUser.getLastName()).isEqualTo(NEW_LAST_NAME);
        assertThat(existingUser.getPassword()).isEqualTo(NEW_ENCODED_PASSWORD);
        assertThat(existingUser.getCreatedAt()).isEqualTo(CREATED_AT);
        assertThat(existingUser.getUpdatedAt()).isEqualTo(UPDATED_AT);
        assertThat(existingUser.getRoles()).isEmpty();
    }

    @Test
    void updateEntityFromDTO_WithNullUsername_ShouldNotUpdateUsername() {
        
        UserRequestDTO updateDTO = UserRequestDTO.builder()
                .username(null)
                .firstName(NEW_FIRST_NAME)
                .lastName(NEW_LAST_NAME)
                .password(NEW_PASSWORD)
                .build();

        userMapper.updateEntityFromDTO(updateDTO, userEntity);

        assertThat(userEntity.getUsername()).isEqualTo(USERNAME);
        assertThat(userEntity.getFirstName()).isEqualTo(NEW_FIRST_NAME);
        assertThat(userEntity.getLastName()).isEqualTo(NEW_LAST_NAME);
    }

    @Test
    void updateEntityFromDTO_WithNullPassword_ShouldNotUpdatePassword() {
        
        UserRequestDTO updateDTO = UserRequestDTO.builder()
                .username(NEW_USERNAME)
                .firstName(NEW_FIRST_NAME)
                .lastName(NEW_LAST_NAME)
                .password(null)
                .build();

        userMapper.updateEntityFromDTO(updateDTO, userEntity);

        assertThat(userEntity.getPassword()).isEqualTo(ENCODED_PASSWORD);
    }

    @Test
    void updateEntityFromDTO_WithNullDTO_ShouldNotChangeEntity() {
        
        User originalUser = User.builder()
                .id(USER_ID)
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(ENCODED_PASSWORD)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .roles(new HashSet<>())
                .build();

        userMapper.updateEntityFromDTO(null, originalUser);

        assertThat(originalUser.getUsername()).isEqualTo(USERNAME);
        assertThat(originalUser.getFirstName()).isEqualTo(FIRST_NAME);
        assertThat(originalUser.getLastName()).isEqualTo(LAST_NAME);
        assertThat(originalUser.getPassword()).isEqualTo(ENCODED_PASSWORD);
    }

    @Test
    void toEntity_FromNullDTO_ShouldReturnNull() {
        assertThat(userMapper.toEntity(null)).isNull();
    }

    @Test
    void toResponseDTO_FromNullUser_ShouldReturnNull() {
        assertThat(userMapper.toResponseDTO(null)).isNull();
    }
}