package es.ubu.inf.tfg.user;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;

import es.ubu.inf.tfg.TfgApplication;
import es.ubu.inf.tfg.user.UserRepositoryTest.TestConfig;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;

@DataJpaTest
@ContextConfiguration(classes = {TfgApplication.class, TestConfig.class})
class UserRepositoryTest {

    @Configuration
    static class TestConfig { // TODO: cambiar ubicacion a directorio mas general -> SRP
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // TODO: incluir el encoder a este nivel?? -> aislamiento

    private Role role;

    @BeforeEach
    void setUp() {
        role = Role.builder().name("USER").build();
        role = roleRepository.save(role);

        // Usuario de ejemplo para los tests
        User user = User.builder()
                .username("testuser")
                .firstName("Test")
                .lastName("User")
                .password(passwordEncoder.encode("password"))
                .role(role)
                .build();
        userRepository.save(user);
    }

    @Test
    void testSaveAndFindByUsername() {
        Optional<User> found = userRepository.findByUsername("testuser");
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Test");
        assertThat(passwordEncoder.matches("password", found.get().getPassword())).isTrue();
    }

    @Test
    void testExistsByUsername() {
        boolean exists = userRepository.existsByUsername("testuser");
        assertThat(exists).isTrue();
        boolean notExists = userRepository.existsByUsername("nouser");
        assertThat(notExists).isFalse();
    }
}
