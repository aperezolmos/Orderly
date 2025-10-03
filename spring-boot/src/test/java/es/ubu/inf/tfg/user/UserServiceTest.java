package es.ubu.inf.tfg.user;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Optional;

import es.ubu.inf.tfg.TfgApplication;
import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserUpdateDTO;
//import es.ubu.inf.tfg.user.mapper.UserMapper;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;

@SpringBootTest
@ContextConfiguration(classes = TfgApplication.class)
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /*@Autowired
    private UserMapper userMapper;*/

    private Role role;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        roleRepository.deleteAll();
        role = Role.builder().name("USER").build();
        role = roleRepository.save(role);
    }

    @Test
    void testCreateUser() {
        UserRequestDTO dto = UserRequestDTO.builder()
                .username("newuser")
                .firstName("New")
                .lastName("User")
                .password("Password123")
                .roleId(role.getId())
                .build();

        var response = userService.create(dto);

        assertThat(response.getUsername()).isEqualTo("newuser");
        assertThat(userRepository.existsByUsername("newuser")).isTrue();
    }

    @Test
    void testCreateUserWithExistingUsernameThrows() {
        UserRequestDTO dto = UserRequestDTO.builder()
                .username("duplicate")
                .firstName("Dup")
                .lastName("User")
                .password("Password123")
                .roleId(role.getId())
                .build();

        userService.create(dto);

        assertThrows(IllegalArgumentException.class, () -> userService.create(dto));
    }

    @Test
    void testFindAllAndFindById() {
        UserRequestDTO dto = UserRequestDTO.builder()
                .username("findme")
                .firstName("Find")
                .lastName("Me")
                .password("Password123")
                .roleId(role.getId())
                .build();

        var created = userService.create(dto);

        List<?> all = userService.findAll();
        assertThat(all).isNotEmpty();

        Optional<?> found = userService.findById(created.getId());
        assertThat(found).isPresent();
        assertThat(((es.ubu.inf.tfg.user.dto.UserResponseDTO)found.get()).getUsername()).isEqualTo("findme");
    }

    @Test
    void testUpdateUser() {
        UserRequestDTO dto = UserRequestDTO.builder()
                .username("updateuser")
                .firstName("Update")
                .lastName("User")
                .password("Password123")
                .roleId(role.getId())
                .build();

        var created = userService.create(dto);

        UserUpdateDTO updateDTO = UserUpdateDTO.builder()
                .username("updateduser")
                .firstName("Updated")
                .lastName("User")
                .password("NewPassword123")
                .roleId(role.getId())
                .build();

        var updated = userService.update(created.getId(), updateDTO);

        assertThat(updated.getUsername()).isEqualTo("updateduser");
        assertThat(passwordEncoder.matches("NewPassword123", userRepository.findById(created.getId()).get().getPassword())).isTrue();
    }

    @Test
    void testDeleteUser() {
        UserRequestDTO dto = UserRequestDTO.builder()
                .username("deleteuser")
                .firstName("Delete")
                .lastName("User")
                .password("Password123")
                .roleId(role.getId())
                .build();

        var created = userService.create(dto);

        userService.delete(created.getId());

        assertThat(userRepository.existsById(created.getId())).isFalse();
    }

    @Test
    void testDeleteNonExistingUserThrows() {
        assertThrows(IllegalArgumentException.class, () -> userService.delete(9999));
    }
}
