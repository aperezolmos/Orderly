package es.ubu.inf.tfg.food;

import jakarta.persistence.*;

import java.math.BigDecimal;
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
    @ToString.Include
    private FoodGroup foodGroup;

    private Double servingWeightGrams;

    //private String ingredientStatement; // campo 'nf_ingredient_statement' de Nutritionix

    @Embedded
    private NutritionInfo nutritionInfo;

    //info sobre cuándo se actualizó por última vez desde nutritionix -> para cachear datos y reducir llamadas
    

    @Builder.Default
    @OneToMany(mappedBy = "food", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Ingredient> usages = new HashSet<>();

    // --------------------------------------------------------

    public NutritionInfo getNutritionInfoForQuantity(Double quantityInGrams) {
        
        if (quantityInGrams == null || quantityInGrams <= 0) {
            return NutritionInfo.builder().build();
        }
        BigDecimal factor = BigDecimal.valueOf(quantityInGrams / this.servingWeightGrams);
        return this.nutritionInfo.multiplyByFactor(factor);
    }
}
