package es.ubu.inf.tfg.init;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserRepository;
import es.ubu.inf.tfg.user.role.Role;
import es.ubu.inf.tfg.user.role.RoleRepository;
import es.ubu.inf.tfg.user.role.permission.Permission;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(1)
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

            if (adminRoleName.equals(roleName)) {
                List<Permission> allPermissions = Arrays.asList(Permission.values());
                role.setPermissions(allPermissions);
                log.info("Assigned ALL permissions to role: {}", roleName);
            }
            else if (userRoleName.equals(roleName)) {
                role.addPermission(Permission.USER_EDIT_MYSELF);
            }
            
            roleRepository.save(role);
            log.info("Created role: {}", roleName);
        } 
        else {
            log.info("Role already exists: {}", roleName);
        }
    }

    private void initializeAdminUser() {
        
        if (!userRepository.existsByUsername(adminUsername)) {
            
            Role adminRole = roleRepository.findByName(adminRoleName)
                    .orElseThrow(() -> new IllegalStateException("Admin role not found. Please check database initialization"));
            Role userRole = roleRepository.findByName(userRoleName)
                    .orElseThrow(() -> new IllegalStateException("User role not found. Please check database initialization"));

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
            log.info("Admin user already exists: {}", adminUsername);
        }
    }
}
