package es.ubu.inf.tfg.role;

import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.dto.RoleRequestDTO;
import es.ubu.inf.tfg.user.role.dto.RoleResponseDTO;
import es.ubu.inf.tfg.user.role.dto.mapper.RoleMapper;
import es.ubu.inf.tfg.user.role.permission.Permission;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class RoleMapperTest {

    @Autowired
    private RoleMapper roleMapper;

    private RoleRequestDTO roleRequestDTO;
    private Role roleEntity;
    private Role roleEntityWithUsers;

    private static final Integer ROLE_ID = 1;
    private static final String ROLE_NAME = "TEST_ROLE";
    private static final String ROLE_DESCRIPTION = "Test Role Description";
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();
    private static final Integer USER_COUNT = 2;


    @BeforeEach
    void setUp() {
        
        roleRequestDTO = RoleRequestDTO.builder()
                .name(ROLE_NAME)
                .description(ROLE_DESCRIPTION)
                .permissions(Arrays.asList(Permission.ROLE_CREATE, Permission.ROLE_EDIT))
                .build();

        
        roleEntity = Role.builder()
                .id(ROLE_ID)
                .name(ROLE_NAME)
                .description(ROLE_DESCRIPTION)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .permissions(new ArrayList<>(Arrays.asList(Permission.ROLE_CREATE, Permission.ROLE_EDIT)))
                .users(Collections.emptySet())
                .build();

        
        User user1 = User.builder().id(1).username("user1").build();
        User user2 = User.builder().id(2).username("user2").build();
        
        roleEntityWithUsers = Role.builder()
                .id(ROLE_ID)
                .name(ROLE_NAME)
                .description(ROLE_DESCRIPTION)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .permissions(new ArrayList<>(Arrays.asList(Permission.ROLE_CREATE)))
                .users(new HashSet<>(Arrays.asList(user1, user2)))
                .build();
    }


    // --------------------------------------------------------

    @Test
    void toEntity_FromValidDTO_ShouldMapCorrectly() {

        Role role = roleMapper.toEntity(roleRequestDTO);

        assertThat(role.getId()).isNull();
        assertThat(role.getName()).isEqualTo(ROLE_NAME);
        assertThat(role.getDescription()).isEqualTo(ROLE_DESCRIPTION);
        assertThat(role.getPermissions()).containsExactly(Permission.ROLE_CREATE, Permission.ROLE_EDIT);
        assertThat(role.getUsers()).isEmpty();
        assertThat(role.getCreatedAt()).isNull();
        assertThat(role.getUpdatedAt()).isNull();
    }

    @Test
    void toEntity_FromDTOWithNullPermissions_ShouldSetEmptyList() {

        roleRequestDTO.setPermissions(null);

        Role role = roleMapper.toEntity(roleRequestDTO);

        assertThat(role.getPermissions()).isEmpty();
    }

    @Test
    void toResponseDTO_FromRole_ShouldMapCorrectly() {

        RoleResponseDTO dto = roleMapper.toResponseDTO(roleEntityWithUsers);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(ROLE_ID);
        assertThat(dto.getName()).isEqualTo(ROLE_NAME);
        assertThat(dto.getDescription()).isEqualTo(ROLE_DESCRIPTION);
        assertThat(dto.getCreatedAt()).isEqualTo(CREATED_AT);
        assertThat(dto.getUpdatedAt()).isEqualTo(UPDATED_AT);
        assertThat(dto.getUserCount()).isEqualTo(USER_COUNT);
        assertThat(dto.getPermissions()).isNull();
    }

    @Test
    void toResponseDTO_FromRole_WithNullUsers_ShouldCalculateZeroUserCount() {

        RoleResponseDTO dto = roleMapper.toResponseDTO(roleEntity);

        assertThat(dto.getUserCount()).isZero();
    }

    @Test
    void toDetailedResponseDTO_FromRole_ShouldMapPermissions() {

        RoleResponseDTO dto = roleMapper.toDetailedResponseDTO(roleEntityWithUsers);

        assertThat(dto.getPermissions()).isNotNull();
        assertThat(dto.getPermissions()).containsExactly(Permission.ROLE_CREATE);
        assertThat(dto.getUserCount()).isEqualTo(USER_COUNT);
    }

    @Test
    void toDetailedResponseDTO_FromRole_WithNullPermissions_ShouldSetEmptyPermissionList() {

        roleEntity.setPermissions(null);

        RoleResponseDTO dto = roleMapper.toDetailedResponseDTO(roleEntity);

        assertThat(dto.getPermissions()).isEmpty();
    }

    @Test
    void toEntity_FromNullDTO_ShouldReturnNull() {
        assertThat(roleMapper.toEntity(null)).isNull();
    }

    @Test
    void toResponseDTO_FromNullRole_ShouldReturnNull() {
        assertThat(roleMapper.toResponseDTO(null)).isNull();
    }

    @Test
    void toDetailedResponseDTO_FromNullRole_ShouldReturnNull() {
        assertThat(roleMapper.toDetailedResponseDTO(null)).isNull();
    }
}
