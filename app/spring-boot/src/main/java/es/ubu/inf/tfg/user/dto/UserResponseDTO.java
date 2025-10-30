package es.ubu.inf.tfg.user.dto;

import java.time.LocalDateTime;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Integer id;
    private String username;
    private String firstName;
    private String lastName;
    private Set<Integer> roleIds;
    private Set<String> roleNames;
    private Integer roleCount;
    private LocalDateTime createdAt;
}
