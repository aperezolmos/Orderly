package es.ubu.inf.tfg.security;

import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SecurityAuthorizationService {
    
    public boolean currentUserHasAuthority(String authority) {
        if (!hasValidAuthentication()) return false;
        return getCurrentAuthentication().getAuthorities().stream()
                .anyMatch(a -> authority.equals(a.getAuthority()));
    }
    
    public boolean currentUserHasAnyAuthority(String... authorities) {
        if (!hasValidAuthentication()) return false;
        return getCurrentAuthentication().getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(Set.of(authorities)::contains);
    }
    
    public String getCurrentUsername() {
        Authentication auth = getCurrentAuthentication();
        return auth != null ? auth.getName() : null;
    }

    // --------------------------------------------------------
    
    private Authentication getCurrentAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    private boolean hasValidAuthentication() {
        Authentication auth = getCurrentAuthentication();
        return auth != null && auth.getAuthorities() != null;
    }
}
