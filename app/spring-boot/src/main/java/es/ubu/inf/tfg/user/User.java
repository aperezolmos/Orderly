package es.ubu.inf.tfg.user;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import es.ubu.inf.tfg.user.role.Role;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    @ToString.Include
    private String username;

    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    @Column(nullable = false, length = 255)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    private LocalDateTime createdAt;

    // --------------------------------------------------------

    public void addRole(Role role) {
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
        this.roles.add(role);
        if (role.getUsers() != null && !role.getUsers().contains(this)) {
            role.getUsers().add(this);
        }
    }

    public void removeRole(Role role) {
        if (this.roles != null) {
            this.roles.remove(role);
        }
        if (role.getUsers() != null) {
            role.getUsers().remove(this);
        }
    }

    public void clearRoles() {
        if (this.roles != null) {
            Set<Role> rolesToRemove = new HashSet<>(this.roles);
            for (Role role : rolesToRemove) {
                removeRole(role);
            }
        }
    }

    // --------------------------------------------------------

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now().plusHours(2);
    }
}
