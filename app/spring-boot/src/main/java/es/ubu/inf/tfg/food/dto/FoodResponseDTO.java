package es.ubu.inf.tfg.food.dto;

import es.ubu.inf.tfg.food.foodGroup.FoodGroup;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodResponseDTO {
    private Integer id;
    private String name;
    private FoodGroup foodGroup;
    private double servingWeightGrams;
    private NutritionInfoDTO nutritionInfo;
    private int recipeCount;
}
