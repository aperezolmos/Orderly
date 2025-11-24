package es.ubu.inf.tfg.reservation.diningTable;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "dining_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class DiningTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Integer id;

    @Column(nullable = false, unique = true, length = 10)
    @ToString.Include
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    @Column(length = 100)
    private String locationDescription;
    
    @Builder.Default
    private Boolean isActive = true;

    
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
}
