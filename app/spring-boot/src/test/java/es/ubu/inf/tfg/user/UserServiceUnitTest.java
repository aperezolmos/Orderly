package es.ubu.inf.tfg.user;

import es.ubu.inf.tfg.security.SecurityAuthorizationService;
import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.dto.mapper.UserMapper;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleService;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashSet;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceUnitTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleService roleService;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private SecurityAuthorizationService securityAuthorizationService;

    @InjectMocks
    private UserService userService;

    private static final Integer USER_ID = 1;
    private static final String USERNAME = "testuser";
    private static final String OTHER_USERNAME = "otheruser";
    private static final String PASSWORD = "password123";
    private static final String ENCODED_PASSWORD = "$2a$10$encoded";
    private static final String CURRENT_PASSWORD = "current123";

    private User userEntity;
    private UserRequestDTO userRequestDTO;
    private UserResponseDTO userResponseDTO;
    private Role userRole;


    @BeforeEach
    void setUp() {
        
        ReflectionTestUtils.setField(userService, "defaultUserRole", "ROLE_USER");
        
        userRole = Role.builder().id(2).name("ROLE_USER").build();
        

        userEntity = User.builder()
                .id(USER_ID)
                .username(USERNAME)
                .firstName("Test")
                .lastName("User")
                .password(ENCODED_PASSWORD)
                .roles(new HashSet<>())
                .build();


        userRequestDTO = UserRequestDTO.builder()
                .username(USERNAME)
                .firstName("Test")
                .lastName("User")
                .password(PASSWORD)
                .currentPassword(CURRENT_PASSWORD)
                .roleIds(new HashSet<>())
                .build();

        
        userResponseDTO = UserResponseDTO.builder()
                .id(USER_ID)
                .username(USERNAME)
                .firstName("Test")
                .lastName("User")
                .roleCount(1)
                .build();
    }


    // --------------------------------------------------------
    // FIND METHODS

    @Test
    void findById_ExistingUser_ShouldReturnUser() {
        
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(userEntity));
        when(userMapper.toResponseDTO(userEntity)).thenReturn(userResponseDTO);

        UserResponseDTO result = userService.findById(USER_ID);

        assertThat(result).isEqualTo(userResponseDTO);
    }

    @Test
    void findById_NonExistingUser_ShouldThrowException() {
        
        when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById(USER_ID))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void existsByUsername_ShouldDelegateToRepository() {
        
        when(userRepository.existsByUsername(USERNAME)).thenReturn(true);

        boolean result = userService.existsByUsername(USERNAME);

        assertThat(result).isTrue();
        verify(userRepository).existsByUsername(USERNAME);
    }


    // --------------------------------------------------------
    // CRUD METHODS

    @Test
    void create_ValidUser_ShouldCreateWithDefaultRole() {
        
        when(userRepository.existsByUsername(USERNAME)).thenReturn(false);
        when(roleService.findEntityByName("ROLE_USER")).thenReturn(userRole);
        when(userMapper.toEntity(userRequestDTO)).thenReturn(userEntity);
        when(userRepository.save(userEntity)).thenReturn(userEntity);
        when(userMapper.toResponseDTO(userEntity)).thenReturn(userResponseDTO);

        UserResponseDTO result = userService.create(userRequestDTO);

        assertThat(result).isEqualTo(userResponseDTO);
        verify(userRepository).save(userEntity);
        assertThat(userEntity.getRoles()).contains(userRole);
    }

    @Test
    void create_ExistingUsername_ShouldThrowException() {
        
        when(userRepository.existsByUsername(USERNAME)).thenReturn(true);

        assertThatThrownBy(() -> userService.create(userRequestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username '" + USERNAME + "' is already in use");
    }

    @Test
    void create_UserWithBlankPassword_ShouldThrowException() {
        
        userRequestDTO.setPassword("   ");
        when(userRepository.existsByUsername(USERNAME)).thenReturn(false);

        assertThatThrownBy(() -> userService.create(userRequestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Password is required");
    }

    @Test
    void update_SelfEdit_ShouldUpdateSuccessfully() {
        
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(userEntity));
        when(securityAuthorizationService.getCurrentUsername()).thenReturn(USERNAME);
        when(passwordEncoder.matches(CURRENT_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
        when(userRepository.save(userEntity)).thenReturn(userEntity);
        when(userMapper.toResponseDTO(userEntity)).thenReturn(userResponseDTO);

        UserResponseDTO result = userService.update(USER_ID, userRequestDTO);

        assertThat(result).isEqualTo(userResponseDTO);
        verify(userMapper).updateEntityFromDTO(userRequestDTO, userEntity);
    }

    @Test
    void update_OtherUserWithoutPermission_ShouldThrowAccessDenied() {
        
        User otherUser = User.builder().id(2).username(OTHER_USERNAME).build();
        when(userRepository.findById(2)).thenReturn(Optional.of(otherUser));
        when(securityAuthorizationService.getCurrentUsername()).thenReturn(USERNAME);
        when(securityAuthorizationService.currentUserHasAuthority("USER_EDIT_OTHERS")).thenReturn(false);

        assertThatThrownBy(() -> userService.update(2, userRequestDTO))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("permission to edit other users");
    }

    @Test
    void update_SelfEditPasswordWithWrongCurrentPassword_ShouldThrowException() {
        
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(userEntity));
        when(securityAuthorizationService.getCurrentUsername()).thenReturn(USERNAME);
        when(passwordEncoder.matches(CURRENT_PASSWORD, ENCODED_PASSWORD)).thenReturn(false);

        assertThatThrownBy(() -> userService.update(USER_ID, userRequestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Current password is incorrect");
    }

    @Test
    void update_ChangeToExistingUsername_ShouldThrowException() {
        
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(userEntity));
        when(securityAuthorizationService.getCurrentUsername()).thenReturn(USERNAME);
        userRequestDTO.setUsername("existinguser");
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        assertThatThrownBy(() -> userService.update(USER_ID, userRequestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already in use");
    }

    @Test
    void delete_ExistingUser_ShouldDelete() {
        
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(userEntity));

        userService.delete(USER_ID);

        verify(userRepository).delete(userEntity);
    }

    @Test
    void delete_NonExistingUser_ShouldThrowException() {
        
        when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.delete(USER_ID))
                .isInstanceOf(EntityNotFoundException.class);
    }

    
    // --------------------------------------------------------
    // DOMAIN METHODS (roles)

    @Test
    void setUserRoles_WithNullRoleIds_ShouldSetOnlyDefaultRole() {
        
        User userMock = mock(User.class);
        
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(userMock));
        when(roleService.findEntityByName("ROLE_USER")).thenReturn(userRole);
        when(userRepository.save(userMock)).thenReturn(userMock);
        when(userMapper.toResponseDTO(userMock)).thenReturn(userResponseDTO);

        UserResponseDTO result = userService.setUserRoles(USER_ID, null);

        assertThat(result).isEqualTo(userResponseDTO);
        verify(userMock).clearRoles();
        verify(userMock).addRole(userRole);
    }

    @Test
    void addRoleToUser_ShouldCallEntityMethod() {
        
        User userMock = mock(User.class);
        Role customRole = Role.builder().id(3).name("CUSTOM_ROLE").build();
        
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(userMock));
        when(roleService.findEntityById(3)).thenReturn(customRole);
        when(userRepository.save(userMock)).thenReturn(userMock);
        when(userMapper.toResponseDTO(userMock)).thenReturn(userResponseDTO);

        userService.addRoleToUser(USER_ID, 3);

        verify(userMock).addRole(customRole);
    }
}
