package es.ubu.inf.tfg.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.role.Role;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        
        Set<GrantedAuthority> authorities = new HashSet<>();
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                
                // Authority by role
                if (role.getName() != null) {
                    authorities.add(new SimpleGrantedAuthority(role.getName()));
                }
                // Authorities by permissions contained in the role
                if (role.getPermissions() != null) {
                    role.getPermissions().stream()
                        .map(Enum::name)
                        .map(SimpleGrantedAuthority::new)
                        .forEach(authorities::add);
                }
            }
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }
}
