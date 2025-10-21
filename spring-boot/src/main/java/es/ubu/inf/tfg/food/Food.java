package es.ubu.inf.tfg.food;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import es.ubu.inf.tfg.food.foodGroup.FoodGroup;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;

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

    // TODO: relación con 'Product'...
}
