package es.ubu.inf.tfg.product;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import es.ubu.inf.tfg.recipe.Recipe;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    private Double price; // TODO: precio fijo? o precio por unidad/por peso?

    private LocalDateTime createdAt; 
    
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Recipe> recipes = new HashSet<>();
    
    // --------------------------------------------------------

    //TODO: métodos addRecipe, removeRecipe...para ASEGURAR CONSISTENCIA a ambos lados de la relación

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now().plusHours(2); 
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now().plusHours(2); ; 
    }
}
