package es.ubu.inf.tfg.food.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import es.ubu.inf.tfg.food.classification.FoodGroup;
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
    private BigDecimal servingWeightGrams;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer recipeCount;
    private NutritionInfoDTO nutritionInfo;
}
