package es.ubu.inf.tfg.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Deshabilita CSRF para facilitar pruebas con Postman
            .authorizeHttpRequests(requests -> requests
                    .anyRequest().permitAll()); // Permite todas las solicitudes sin autenticación -> TODO: cambiar tras pruebas
        return http.build();
    }
}
