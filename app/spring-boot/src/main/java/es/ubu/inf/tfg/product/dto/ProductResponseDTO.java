package es.ubu.inf.tfg.product.dto;

import java.time.LocalDateTime;
import java.util.Set;

import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;
import es.ubu.inf.tfg.product.ingredient.dto.IngredientResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    private Integer id;
    private String name;
    private String description;
    private Double price;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int ingredientCount;
    private NutritionInfoDTO totalNutrition;
    private Set<IngredientResponseDTO> ingredients;
}
