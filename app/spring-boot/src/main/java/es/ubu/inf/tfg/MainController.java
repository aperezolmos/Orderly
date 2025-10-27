package es.ubu.inf.tfg; // TODO: cambiar ubicación

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
    
    @GetMapping("/")
    public String main(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Si el usuario está autenticado y no es "anonymousUser"
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String username = auth.getName();
            String role = auth.getAuthorities().stream()
                    .findFirst()
                    .map(a -> a.getAuthority())
                    .orElse("Sin rol");
            model.addAttribute("username", username);
            model.addAttribute("role", role);
            model.addAttribute("loggedIn", true);
        } else {
            model.addAttribute("loggedIn", false);
        }
        return "main";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}
