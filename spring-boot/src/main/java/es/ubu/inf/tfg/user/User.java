package es.ubu.inf.tfg.user;

import java.time.LocalDateTime;

import es.ubu.inf.tfg.user.role.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    @Column(nullable = false, length = 255)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    private LocalDateTime createdAt;

    // --------------------------------------------------------

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now().plusHours(2);
    }
    
}
