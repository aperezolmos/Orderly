package es.ubu.inf.tfg.recipe.dto;

import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeResponseDTO {
    private Integer foodId;
    private String foodName;
    private Integer productId;
    private String productName;
    private Double quantity;
    private NutritionInfoDTO nutritionInfo;
}
