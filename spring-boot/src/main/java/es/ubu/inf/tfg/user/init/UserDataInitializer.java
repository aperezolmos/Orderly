package es.ubu.inf.tfg.user.init;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserRepository;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleRepository;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${DEFAULT_ADMIN_USERNAME:admin}")
    private String adminUsername;

    @Value("${DEFAULT_ADMIN_PASSWORD:admin}")
    private String adminPassword;

    @Value("${DEFAULT_ADMIN_ROLE:ROLE_ADMIN}")
    private String adminRoleName;

    @Value("${DEFAULT_USER_ROLE:ROLE_USER}")
    private String userRoleName;


    @Override
    @Transactional
    public void run(String... args) throws Exception {
        createRoleIfNotExists(adminRoleName, "System administrator");
        createRoleIfNotExists(userRoleName, "Standard user");
        initializeAdminUser();
    }


    private void createRoleIfNotExists(String roleName, String description) {
        
        if (!roleRepository.existsByName(roleName)) {
            Role role = Role.builder()
                    .name(roleName)
                    .description(description)
                    .build();
            
            roleRepository.save(role);
            log.info("Created role: {}", roleName);
        } 
        else {
            log.debug("Role already exists: {}", roleName);
        }
    }

    private void initializeAdminUser() {
        
        if (!userRepository.existsByUsername(adminUsername)) {
            
            Role adminRole = roleRepository.findByName(adminRoleName)
                    .orElseThrow(() -> new IllegalStateException("Admin role not found. Please check database initialization."));
            Role userRole = roleRepository.findByName(userRoleName)
                    .orElseThrow(() -> new IllegalStateException("User role not found. Please check database initialization."));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(userRole);

            User adminUser = User.builder()
                    .username(adminUsername)
                    .firstName("Administrator")
                    .password(passwordEncoder.encode(adminPassword))
                    .roles(roles)
                    .build();

            userRepository.save(adminUser);
            log.info("Created admin user: {}", adminUsername);
        } 
        else {
            log.debug("Admin user already exists: {}", adminUsername);
        }
    }
}
