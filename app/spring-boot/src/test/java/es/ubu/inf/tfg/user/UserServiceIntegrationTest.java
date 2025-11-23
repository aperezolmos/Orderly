package es.ubu.inf.tfg.user;

import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleRepository;
import es.ubu.inf.tfg.user.role.permission.Permission;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class UserServiceIntegrationTest {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserService userService;

    private static final String TEST_USERNAME = "testusername";
    private static final String TEST_PASSWORD = "testpassword";
    private static final String ROLE_NAME = "ROLE_TEST";
    private static final String DEFAULT_USER_ROLE = "ROLE_USER";

    private Role createdRole;
    private User createdUser;
    

    @BeforeEach
    void setUp() {
        
        userRepository.findByUsername(TEST_USERNAME).ifPresent(userRepository::delete);
        roleRepository.findByName(ROLE_NAME).ifPresent(roleRepository::delete);

        
        createdRole = roleRepository.save(Role.builder()
                .name(ROLE_NAME)
                .permissions(new ArrayList<>(List.of(Permission.ROLE_CREATE)))
                .build());

        
        createdUser = userRepository.save(User.builder()
                .username(TEST_USERNAME)
                .password(TEST_PASSWORD)
                .build());
    }


    // --------------------------------------------------------

    @Test
    void addRoleToUser_ShouldUpdateBothSides() {
        
        userService.addRoleToUser(createdUser.getId(), createdRole.getId());

        User user = userRepository.findById(createdUser.getId()).orElseThrow();
        Role role = roleRepository.findById(createdRole.getId()).orElseThrow();

        assertThat(user.getRoles()).contains(createdRole);
        assertThat(role.getUsers()).contains(createdUser);
    }

    @Test
    void removeRoleFromUser_ShouldUpdateBothSides() {
        
        userService.addRoleToUser(createdUser.getId(), createdRole.getId());

        userService.removeRoleFromUser(createdUser.getId(), createdRole.getId());

        User user = userRepository.findById(createdUser.getId()).orElseThrow();
        Role role = roleRepository.findById(createdRole.getId()).orElseThrow();

        assertThat(user.getRoles()).doesNotContain(createdRole);
        assertThat(role.getUsers()).doesNotContain(createdUser);
    }

    @Test
    void setUserRoles_ShouldSyncBidirectionallyAndIncludeDefaultRole() {

        Role defaultRole = roleRepository.findByName(DEFAULT_USER_ROLE).orElseThrow();
        Role extraRole1 = roleRepository.save(Role.builder().name("EXTRA_ROLE_1").build());
        Role extraRole2 = roleRepository.save(Role.builder().name("EXTRA_ROLE_2").build());

        Set<Integer> roleIds = Set.of(createdRole.getId(), extraRole1.getId(), extraRole2.getId());

        userService.setUserRoles(createdUser.getId(), roleIds);

        User user = userRepository.findById(createdUser.getId()).orElseThrow();
        

        assertThat(user.getRoles()).hasSize(4); // 3 roles + default role
        assertThat(user.getRoles()).extracting(Role::getName).contains(ROLE_NAME, DEFAULT_USER_ROLE);
        assertThat(createdRole.getUsers()).contains(user);
        assertThat(extraRole1.getUsers()).contains(user);
        assertThat(extraRole2.getUsers()).contains(user);
        assertThat(defaultRole.getUsers()).contains(user);
    }
}
