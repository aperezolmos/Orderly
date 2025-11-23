package es.ubu.inf.tfg.user.role;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.role.permission.Permission;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Integer id;
    
    @Column(nullable = false, unique = true, length = 50)
    @ToString.Include
    private String name;
    
    private String description;

    @Builder.Default
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private List<Permission> permissions = new ArrayList<>();


    @Builder.Default
    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();


    private LocalDateTime createdAt; 
    
    private LocalDateTime updatedAt;
    
    
    // --------------------------------------------------------

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now(); 
    }


    // --------------------------------------------------------

    public boolean addPermission(Permission permission) {
        if (this.permissions == null) {
            this.permissions = new ArrayList<>();
        }
        if (!this.permissions.contains(permission)) {
            return this.permissions.add(permission);
        }
        return false;
    }

    public boolean removePermission(Permission permission) {
        if (this.permissions != null) {
            return this.permissions.remove(permission);
        }
        return false;
    }

    public void setPermissions(List<Permission> permissions) {
        if (permissions != null) {
            this.permissions = new ArrayList<>(permissions);
        }
        else {
            this.permissions = new ArrayList<>();
        }
    }
}
