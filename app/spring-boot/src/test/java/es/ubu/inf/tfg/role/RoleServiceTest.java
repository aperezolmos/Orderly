package es.ubu.inf.tfg.role;

import es.ubu.inf.tfg.exception.PredefinedRoleDeletionException;
import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleRepository;
import es.ubu.inf.tfg.user.role.RoleService;
import es.ubu.inf.tfg.user.role.dto.RoleRequestDTO;
import es.ubu.inf.tfg.user.role.dto.RoleResponseDTO;
import es.ubu.inf.tfg.user.role.dto.mapper.RoleMapper;
import es.ubu.inf.tfg.user.role.permission.Permission;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;
    @Mock
    private RoleMapper roleMapper;

    @InjectMocks
    private RoleService roleService;

    private Role roleEntity;
    private RoleRequestDTO roleRequestDTO;
    private RoleResponseDTO roleResponseDTO;

    private static final Integer ROLE_ID_1 = 1;
    private static final Integer ROLE_ID_2 = 2;
    private static final Integer ROLE_ID_3 = 3;
    private static final String ROLE_NAME = "TEST_ROLE";
    private static final String ROLE_DESCRIPTION = "Test Role Description";
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();
    private static final String ADMIN_ROLE = "ROLE_ADMIN";
    private static final String USER_ROLE = "ROLE_USER";


    @BeforeEach
    void setUp() {

        ReflectionTestUtils.setField(roleService, "adminRoleName", ADMIN_ROLE);
        ReflectionTestUtils.setField(roleService, "userRoleName", USER_ROLE);

        roleEntity = Role.builder()
                .id(ROLE_ID_1)
                .name(ROLE_NAME)
                .description(ROLE_DESCRIPTION)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .permissions(new ArrayList<>(Arrays.asList(Permission.ROLE_CREATE, Permission.ROLE_EDIT)))
                .users(new HashSet<>())
                .build();

        roleRequestDTO = RoleRequestDTO.builder()
                .name(ROLE_NAME)
                .description(ROLE_DESCRIPTION)
                .permissions(Arrays.asList(Permission.ROLE_CREATE, Permission.ROLE_EDIT))
                .build();

        roleResponseDTO = RoleResponseDTO.builder()
                .id(ROLE_ID_1)
                .name(ROLE_NAME)
                .description(ROLE_DESCRIPTION)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .userCount(0)
                .permissions(Arrays.asList(Permission.ROLE_CREATE, Permission.ROLE_EDIT))
                .build();
    }


    // --------------------------------------------------------
    // FIND METHODS

    @Test
    void findAll_ShouldReturnMappedList() {
        
        List<Role> roles = List.of(roleEntity);
        when(roleRepository.findAll()).thenReturn(roles);
        when(roleMapper.toResponseDTO(roleEntity)).thenReturn(roleResponseDTO);

        List<RoleResponseDTO> result = roleService.findAll();

        assertThat(result).containsExactly(roleResponseDTO);
        verify(roleRepository).findAll();
        verify(roleMapper).toResponseDTO(roleEntity);
    }

    @Test
    void findById_ExistingId_ShouldReturnDetailedDTO() {
        
        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.of(roleEntity));
        when(roleMapper.toDetailedResponseDTO(roleEntity)).thenReturn(roleResponseDTO);

        RoleResponseDTO result = roleService.findById(ROLE_ID_1);

        assertThat(result).isEqualTo(roleResponseDTO);
        verify(roleRepository).findById(ROLE_ID_1);
        verify(roleMapper).toDetailedResponseDTO(roleEntity);
    }

    @Test
    void findById_NonExistingId_ShouldThrowException() {
        
        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleService.findById(ROLE_ID_1))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Role not found with id");
    }

    @Test
    void findEntityById_ExistingId_ShouldReturnEntity() {
        
        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.of(roleEntity));

        Role result = roleService.findEntityById(ROLE_ID_1);

        assertThat(result).isEqualTo(roleEntity);
    }

    @Test
    void findEntityById_NonExistingId_ShouldThrowException() {
        
        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleService.findEntityById(ROLE_ID_1))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void findByName_ExistingName_ShouldReturnDetailedDTO() {
        
        when(roleRepository.findByName(ROLE_NAME)).thenReturn(Optional.of(roleEntity));
        when(roleMapper.toDetailedResponseDTO(roleEntity)).thenReturn(roleResponseDTO);

        RoleResponseDTO result = roleService.findByName(ROLE_NAME);

        assertThat(result).isEqualTo(roleResponseDTO);
    }

    @Test
    void findByName_NonExistingName_ShouldThrowException() {
        
        when(roleRepository.findByName(ROLE_NAME)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleService.findByName(ROLE_NAME))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void findEntityByName_ExistingName_ShouldReturnEntity() {
        
        when(roleRepository.findByName(ROLE_NAME)).thenReturn(Optional.of(roleEntity));

        Role result = roleService.findEntityByName(ROLE_NAME);

        assertThat(result).isEqualTo(roleEntity);
    }

    @Test
    void findEntityByName_NonExistingName_ShouldThrowException() {
        
        when(roleRepository.findByName(ROLE_NAME)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleService.findEntityByName(ROLE_NAME))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void existsById_ShouldDelegateToRepository() {
        
        when(roleRepository.existsById(ROLE_ID_1)).thenReturn(true);

        assertThat(roleService.existsById(ROLE_ID_1)).isTrue();
        verify(roleRepository).existsById(ROLE_ID_1);
    }

    @Test
    void existsByName_ShouldDelegateToRepository() {
        
        when(roleRepository.existsByName(ROLE_NAME)).thenReturn(true);

        assertThat(roleService.existsByName(ROLE_NAME)).isTrue();
        verify(roleRepository).existsByName(ROLE_NAME);
    }


    // --------------------------------------------------------
    // CRUD METHODS

    @Test
    void save_NewRole_ShouldSaveAndReturnDTO() {
        
        when(roleRepository.existsByName(ROLE_NAME)).thenReturn(false);
        when(roleMapper.toEntity(roleRequestDTO)).thenReturn(roleEntity);
        when(roleRepository.save(roleEntity)).thenReturn(roleEntity);
        when(roleMapper.toResponseDTO(roleEntity)).thenReturn(roleResponseDTO);

        RoleResponseDTO result = roleService.save(roleRequestDTO);

        assertThat(result).isEqualTo(roleResponseDTO);
        verify(roleRepository).save(roleEntity);
    }

    @Test
    void save_ExistingRoleName_ShouldThrowException() {
        
        when(roleRepository.existsByName(ROLE_NAME)).thenReturn(true);

        assertThatThrownBy(() -> roleService.save(roleRequestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void update_ExistingRole_ShouldUpdateAndReturnDTO() {

        String NEW_NAME = "NEW_NAME";
        String NEW_DESC = "New description";
        
        Role updatedRole = Role.builder()
                .id(ROLE_ID_1)
                .name(NEW_NAME)
                .description(NEW_DESC)
                .permissions(Arrays.asList(Permission.ROLE_DELETE))
                .users(new HashSet<>())
                .build();

        RoleRequestDTO updateDTO = RoleRequestDTO.builder()
                .name(NEW_NAME)
                .description(NEW_DESC)
                .permissions(Arrays.asList(Permission.ROLE_DELETE))
                .build();

        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.of(roleEntity));
        when(roleRepository.existsByName(NEW_NAME)).thenReturn(false);
        when(roleRepository.save(any(Role.class))).thenReturn(updatedRole);
        when(roleMapper.toResponseDTO(updatedRole)).thenReturn(roleResponseDTO);

        RoleResponseDTO result = roleService.update(ROLE_ID_1, updateDTO);

        assertThat(result).isEqualTo(roleResponseDTO);
        verify(roleRepository).save(any(Role.class));
    }

    @Test
    void update_ChangeToExistingRoleName_ShouldThrowException() {

        String EXISTING_NAME = "EXISTING_NAME";
        
        RoleRequestDTO updateDTO = RoleRequestDTO.builder()
                .name(EXISTING_NAME)
                .description("Description")
                .permissions(Arrays.asList(Permission.ROLE_DELETE))
                .build();

        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.of(roleEntity));
        when(roleRepository.existsByName(EXISTING_NAME)).thenReturn(true);

        assertThatThrownBy(() -> roleService.update(ROLE_ID_1, updateDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void update_NonExistingRole_ShouldThrowException() {
        
        when(roleRepository.findById(ROLE_ID_3)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleService.update(ROLE_ID_3, roleRequestDTO))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void delete_ExistingRole_ShouldDelete() {
        
        Role deletableRole = Role.builder()
                .id(ROLE_ID_2)
                .name("CUSTOM_ROLE")
                .build();
        
        when(roleRepository.findById(ROLE_ID_2)).thenReturn(Optional.of(deletableRole));

        roleService.delete(ROLE_ID_2);

        verify(roleRepository).delete(deletableRole);
    }

    @Test
    void delete_AdminPredefinedRole_ShouldThrowException() {
        
        Role adminRole = Role.builder()
                .id(ROLE_ID_2)
                .name(ADMIN_ROLE)
                .build();
        
        when(roleRepository.findById(ROLE_ID_2)).thenReturn(Optional.of(adminRole));

        assertThatThrownBy(() -> roleService.delete(ROLE_ID_2))
                .isInstanceOf(PredefinedRoleDeletionException.class)
                .hasMessageContaining(ADMIN_ROLE);
        
        verify(roleRepository, never()).delete(any());
    }

    @Test
    void delete_UserPredefinedRole_ShouldThrowException() {
        
        Role userRole = Role.builder()
                .id(ROLE_ID_2)
                .name(USER_ROLE)
                .users(new HashSet<>())
                .build();
        
        when(roleRepository.findById(ROLE_ID_2)).thenReturn(Optional.of(userRole));

        assertThatThrownBy(() -> roleService.delete(ROLE_ID_2))
                .isInstanceOf(PredefinedRoleDeletionException.class)
                .hasMessageContaining(USER_ROLE);
        
        verify(roleRepository, never()).delete(any());
    }

    @Test
    void delete_RoleWithUsers_ShouldThrowException() {
        
        Set<User> users = new HashSet<>();
        users.add(User.builder().id(1).username("User1").build());
        
        Role roleWithUsers = Role.builder()
                .id(ROLE_ID_2)
                .name("SOME_ROLE")
                .users(users)
                .build();
        
        when(roleRepository.findById(ROLE_ID_2)).thenReturn(Optional.of(roleWithUsers));

        assertThatThrownBy(() -> roleService.delete(ROLE_ID_2))
                .isInstanceOf(ResourceInUseException.class);
        
        verify(roleRepository, never()).delete(any());
    }


    // --------------------------------------------------------
    // DOMAIN METHODS (permissions)

    @Test
    void addPermission_ShouldAddAndReturnDetailedDTO() {
        
        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.of(roleEntity));
        when(roleRepository.save(roleEntity)).thenReturn(roleEntity);
        when(roleMapper.toDetailedResponseDTO(roleEntity)).thenReturn(roleResponseDTO);

        RoleResponseDTO result = roleService.addPermission(ROLE_ID_1, Permission.ROLE_DELETE);

        assertThat(result).isEqualTo(roleResponseDTO);
        verify(roleRepository).save(roleEntity);
    }

    @Test
    void removePermission_ShouldRemoveAndReturnDetailedDTO() {
        
        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.of(roleEntity));
        when(roleRepository.save(roleEntity)).thenReturn(roleEntity);
        when(roleMapper.toDetailedResponseDTO(roleEntity)).thenReturn(roleResponseDTO);

        RoleResponseDTO result = roleService.removePermission(ROLE_ID_1, Permission.ROLE_EDIT);

        assertThat(result).isEqualTo(roleResponseDTO);
        verify(roleRepository).save(roleEntity);
    }

    @Test
    void setPermissions_ShouldSetAndReturnDetailedDTO() {
        
        List<Permission> newPerms = Arrays.asList(Permission.ROLE_VIEW_LIST, Permission.ROLE_CREATE);
        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.of(roleEntity));
        when(roleRepository.save(roleEntity)).thenReturn(roleEntity);
        when(roleMapper.toDetailedResponseDTO(roleEntity)).thenReturn(roleResponseDTO);

        RoleResponseDTO result = roleService.setPermissions(ROLE_ID_1, newPerms);

        assertThat(result).isEqualTo(roleResponseDTO);
        verify(roleRepository).save(roleEntity);
    }

    @Test
    void hasPermission_RoleHasPermission_ShouldReturnTrue() {
        
        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.of(roleEntity));

        boolean result = roleService.hasPermission(ROLE_ID_1, Permission.ROLE_CREATE);

        assertThat(result).isTrue();
    }

    @Test
    void hasPermission_RoleDoesNotHavePermission_ShouldReturnFalse() {
        
        when(roleRepository.findById(ROLE_ID_1)).thenReturn(Optional.of(roleEntity));

        boolean result = roleService.hasPermission(ROLE_ID_1, Permission.USER_CREATE);

        assertThat(result).isFalse();
    }

    @Test
    void getAllPermissions_ShouldReturnAllPermissionNames() {
        
        List<String> result = roleService.getAllPermissions();
        List<String> expectedPermissions = Arrays.stream(Permission.values())
            .map(Enum::name)
            .toList();

        assertThat(result.size()).isEqualTo(Permission.values().length);
        assertThat(result).containsExactlyInAnyOrderElementsOf(expectedPermissions);
    }
}
