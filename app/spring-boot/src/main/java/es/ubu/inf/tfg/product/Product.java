package es.ubu.inf.tfg.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.product.ingredient.Ingredient;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Integer id;

    @Column(nullable = false, unique = true)
    @ToString.Include
    private String name;

    private String description;

    private BigDecimal price;


    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Ingredient> ingredients = new HashSet<>();
    

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

    public void clearIngredients() {
        if (ingredients != null) {
            Set<Ingredient> toRemove = new HashSet<>(ingredients);
            for (Ingredient ingredient : toRemove) {
                ingredient.remove();
            }
        }
    }
    
    public NutritionInfo calculateTotalNutrition() {
        NutritionInfo total = NutritionInfo.builder().build();
        for (Ingredient ingredient : ingredients) {
            NutritionInfo ingredientNutrition = ingredient.calculateNutritionInfo();
            total = total.add(ingredientNutrition);
        }
        return total;
    }
}
