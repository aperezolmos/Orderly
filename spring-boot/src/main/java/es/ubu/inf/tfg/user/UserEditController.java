package es.ubu.inf.tfg.user;

import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.dto.validation.UserValidationGroups;
import es.ubu.inf.tfg.user.role.RoleService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserEditController {

    private final UserService userService;
    private final RoleService roleService;


    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Integer id, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String editorUsername = auth.getName();

        UserResponseDTO user = userService.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        UserResponseDTO editor = userService.findByUsername(editorUsername)
            .orElseThrow(() -> new IllegalArgumentException("Usuario editor no encontrado"));

        boolean isAdmin = "ROLE_ADMIN".equals(editor.getRoleName());
        boolean isSelfEdit = editor.getId().equals(user.getId());

        // Restricción de acceso
        if (!isAdmin && !isSelfEdit) {
            return "redirect:/access-denied";
        }

        UserRequestDTO userRequestDTO = UserRequestDTO.builder()
            .username(user.getUsername())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .roleId(isAdmin ? user.getRoleId() : null)
            .build();

        model.addAttribute("userRequestDTO", userRequestDTO);
        model.addAttribute("user", user);
        model.addAttribute("isAdmin", isAdmin);
        model.addAttribute("isSelfEdit", isSelfEdit);
        if (isAdmin) {
            model.addAttribute("roles", roleService.findAll());
        }
        return "user-edit";
    }


    @PostMapping("/{id}/edit")
    public String editUser(
            @PathVariable Integer id,
            @Validated(UserValidationGroups.OnUpdate.class) @ModelAttribute("userRequestDTO") UserRequestDTO userRequestDTO,
            BindingResult bindingResult,
            Model model) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String editorUsername = auth.getName();

        UserResponseDTO user = userService.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        UserResponseDTO editor = userService.findByUsername(editorUsername)
            .orElseThrow(() -> new IllegalArgumentException("Usuario editor no encontrado"));

        boolean isAdmin = "ROLE_ADMIN".equals(editor.getRoleName());
        boolean isSelfEdit = editor.getId().equals(user.getId());

        // Restricción de acceso
        if (!isAdmin && !isSelfEdit) {
            return "redirect:/access-denied";
        }

        model.addAttribute("user", user);
        model.addAttribute("isAdmin", isAdmin);
        model.addAttribute("isSelfEdit", isSelfEdit);
        if (isAdmin) {
            model.addAttribute("roles", roleService.findAll());
        }

        if (bindingResult.hasErrors()) {
            return "user-edit";
        }

        try {
            userService.edit(editor.getId(), user.getId(), userRequestDTO);
            model.addAttribute("successMessage", "Usuario editado correctamente.");
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
        }
        return "user-edit";
    }
}
