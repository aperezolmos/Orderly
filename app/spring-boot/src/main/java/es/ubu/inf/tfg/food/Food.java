package es.ubu.inf.tfg.food;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import es.ubu.inf.tfg.food.foodGroup.FoodGroup;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.product.ingredient.Ingredient;

import lombok.*;

@Entity
@Table(name = "foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class Food {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Integer id;

    @Column(nullable = false, unique = true)
    @ToString.Include
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @ToString.Include
    private FoodGroup foodGroup;

    private BigDecimal servingWeightGrams;

    @Embedded
    private NutritionInfo nutritionInfo;
    

    @Builder.Default
    @OneToMany(mappedBy = "food", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Ingredient> usages = new HashSet<>();


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

    public NutritionInfo getNutritionInfoForQuantity(BigDecimal quantityInGrams) {
        
        if ((quantityInGrams == null || quantityInGrams.compareTo(BigDecimal.ZERO) <= 0) ||
            (this.servingWeightGrams == null || this.servingWeightGrams.compareTo(BigDecimal.ZERO) <= 0)) {
            return NutritionInfo.builder().build();
        }
        BigDecimal factor = quantityInGrams.divide(this.servingWeightGrams);
        return this.nutritionInfo.multiplyByFactor(factor);
    }
}
