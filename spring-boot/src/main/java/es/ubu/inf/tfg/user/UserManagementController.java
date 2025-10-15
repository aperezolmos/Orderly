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
@RequestMapping("/admin/users")
public class UserManagementController {

    private final UserService userService;
    private final RoleService roleService;


    @GetMapping
    public String listUsers(Model model,
                            @RequestParam(value = "successMessage", required = false) String successMessage,
                            @RequestParam(value = "errorMessage", required = false) String errorMessage) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String editorUsername = auth.getName();
        UserResponseDTO editor = userService.findByUsername(editorUsername)
            .orElseThrow(() -> new IllegalArgumentException("Usuario editor no encontrado"));
        if (!"ROLE_ADMIN".equals(editor.getRoleName())) {
            return "redirect:/access-denied";
        }
        model.addAttribute("users", userService.findAll());
        model.addAttribute("editorId", editor.getId());
        if (successMessage != null) model.addAttribute("successMessage", successMessage);
        if (errorMessage != null) model.addAttribute("errorMessage", errorMessage);
        return "user-management";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("userRequestDTO", new UserRequestDTO());
        model.addAttribute("roles", roleService.findAll());
        return "user-create";
    }

    @PostMapping("/create")
    public String createUser(
            @Validated(UserValidationGroups.OnCreate.class) @ModelAttribute("userRequestDTO") UserRequestDTO userRequestDTO,
            BindingResult bindingResult,
            Model model) {
        
        if (bindingResult.hasErrors()) {
            model.addAttribute("roles", roleService.findAll());
            return "user-create";
        }
        try {
            // Permitir seleccionar rol al crear usuario desde admin
            if (userRequestDTO.getRoleId() == null) {
                throw new IllegalArgumentException("Debe seleccionar un rol.");
            }
            userService.create(userRequestDTO);
            return "redirect:/admin/users?successMessage=Usuario creado correctamente.";
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("roles", roleService.findAll());
            return "user-create";
        }
    }

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
        if (!isAdmin) {
            return "redirect:/access-denied";
        }
        UserRequestDTO userRequestDTO = UserRequestDTO.builder()
            .username(user.getUsername())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .roleId(user.getRoleId())
            .build();
        model.addAttribute("userRequestDTO", userRequestDTO);
        model.addAttribute("user", user);
        model.addAttribute("isAdmin", isAdmin);
        model.addAttribute("isSelfEdit", isSelfEdit);
        model.addAttribute("roles", roleService.findAll());
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
        if (!isAdmin) {
            return "redirect:/access-denied";
        }
        model.addAttribute("user", user);
        model.addAttribute("isAdmin", isAdmin);
        model.addAttribute("isSelfEdit", isSelfEdit);
        model.addAttribute("roles", roleService.findAll());
        if (bindingResult.hasErrors()) {
            return "user-edit";
        }
        try {
            userService.edit(user.getId(), userRequestDTO, isAdmin);
            return "redirect:/admin/users?successMessage=Usuario editado correctamente.";
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "user-edit";
        }
    }

    @PostMapping("/{id}/delete")
    public String deleteUser(@PathVariable Integer id, Model model) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String editorUsername = auth.getName();
        UserResponseDTO editor = userService.findByUsername(editorUsername)
            .orElseThrow(() -> new IllegalArgumentException("Usuario editor no encontrado"));
        if (!"ROLE_ADMIN".equals(editor.getRoleName())) {
            return "redirect:/access-denied";
        }
        if (editor.getId().equals(id)) {
            return "redirect:/admin/users?errorMessage=No puedes eliminarte a ti mismo.";
        }
        try {
            userService.delete(id);
            return "redirect:/admin/users?successMessage=Usuario eliminado correctamente.";
        } catch (IllegalArgumentException e) {
            return "redirect:/admin/users?errorMessage=" + e.getMessage();
        }
    }
}
