package es.ubu.inf.tfg.food;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

import es.ubu.inf.tfg.food.foodGroup.FoodGroup;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.recipe.Recipe;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "foods")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Food {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    private FoodGroup foodGroup;

    private double servingWeightGrams;

    //private String ingredientStatement; // campo 'nf_ingredient_statement' de Nutritionix

    @Embedded
    private NutritionInfo nutritionInfo;

    //info sobre cuándo se actualizó por última vez desde nutritionix -> para cachear datos y reducir llamadas

    @Builder.Default
    @OneToMany(mappedBy = "food", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Recipe> recipes = new HashSet<>();

    // --------------------------------------------------------

    //TODO: métodos addRecipe, removeRecipe...para ASEGURAR CONSISTENCIA a ambos lados de la relación
}
