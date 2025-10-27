package es.ubu.inf.tfg.user; // TODO: cambiar ubicación?

import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.validation.UserValidationGroups;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.validation.annotation.Validated;

@Controller
@RequiredArgsConstructor
public class RegisterController {

    private final UserService userService;
    

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("userRequestDTO", new UserRequestDTO());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(
            @Validated(UserValidationGroups.OnCreate.class) @ModelAttribute("userRequestDTO") UserRequestDTO userRequestDTO,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            return "register";
        }

        try {
            userService.register(userRequestDTO);
            redirectAttributes.addFlashAttribute("registerSuccess", true); 
            redirectAttributes.addFlashAttribute("successMessage", "Usuario registrado correctamente. Ahora puede iniciar sesión.");
            return "redirect:/login";
        } 
        catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "register";
        }
    }
}
