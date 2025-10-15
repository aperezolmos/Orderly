package es.ubu.inf.tfg.user;

import es.ubu.inf.tfg.user.dto.UserRequestDTO;
import es.ubu.inf.tfg.user.dto.UserResponseDTO;
import es.ubu.inf.tfg.user.dto.validation.UserValidationGroups;
import es.ubu.inf.tfg.user.role.RoleService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserEditController {

    private final UserService userService;
    private final RoleService roleService;

    private record EditUserContext(
        UserResponseDTO user,
        UserResponseDTO editor,
        boolean isAdmin, 
        boolean isSelfEdit
    ) {}


    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Integer id, Model model) {
        
        try {
            EditUserContext context = prepareEditContext(id, model);
            
            UserRequestDTO userRequestDTO = UserRequestDTO.builder()
                .username(context.user().getUsername())
                .firstName(context.user().getFirstName())
                .lastName(context.user().getLastName())
                .roleId(context.isAdmin() ? context.user().getRoleId() : null)
                .build();

            model.addAttribute("userRequestDTO", userRequestDTO);
            return "user-edit";
        } 
        catch (AccessDeniedException e) {
            return "redirect:/access-denied";
        }
    }

    @PostMapping("/{id}/edit")
    public String editUser(
            @PathVariable Integer id,
            @Validated(UserValidationGroups.OnUpdate.class) @ModelAttribute("userRequestDTO") UserRequestDTO userRequestDTO,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes) {

        try {
            EditUserContext context = prepareEditContext(id, model);
            boolean usernameChanged = !userRequestDTO.getUsername().equals(context.user().getUsername());

            if (bindingResult.hasErrors()) {
                return "user-edit";
            }

            userService.edit(context.user().getId(), userRequestDTO, context.isAdmin());
            
            if (context.isSelfEdit() && usernameChanged) {
                return "redirect:/logout";
            }
            
            redirectAttributes.addFlashAttribute("editSuccess", true);
            redirectAttributes.addFlashAttribute("successMessage", "Usuario editado correctamente.");
            return "redirect:/users/" + id + "/edit";
            
        } 
        catch (AccessDeniedException e) {
            return "redirect:/access-denied";
        } 
        catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "user-edit";
        }
    }

    // --------------------------------------------------------

    private EditUserContext prepareEditContext(Integer userId, Model model) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String editorUsername = auth.getName();

        UserResponseDTO user = userService.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        UserResponseDTO editor = userService.findByUsername(editorUsername)
            .orElseThrow(() -> new IllegalArgumentException("Usuario editor no encontrado"));

        boolean isAdmin = "ROLE_ADMIN".equals(editor.getRoleName());
        boolean isSelfEdit = editor.getId().equals(user.getId());

        if (!isAdmin && !isSelfEdit) {
            throw new AccessDeniedException("Acceso denegado");
        }

        model.addAttribute("user", user);
        model.addAttribute("isAdmin", isAdmin);
        model.addAttribute("isSelfEdit", isSelfEdit);
        if (isAdmin) {
            model.addAttribute("roles", roleService.findAll());
        }

        return new EditUserContext(user, editor, isAdmin, isSelfEdit);
    }
}
