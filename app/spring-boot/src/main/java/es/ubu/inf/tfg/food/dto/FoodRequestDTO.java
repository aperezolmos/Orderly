package es.ubu.inf.tfg.food.dto;

import java.math.BigDecimal;

import es.ubu.inf.tfg.food.classification.FoodGroup;
import es.ubu.inf.tfg.food.classification.dto.AllergenInfoDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodRequestDTO {
    
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed {max} characters")
    private String name;

    @NotNull(message = "Food group is required")
    private FoodGroup foodGroup;

    @Positive(message = "Serving weight must be positive")
    private BigDecimal servingWeightGrams;

    @Valid
    private AllergenInfoDTO allergenInfo;

    @Valid
    private NutritionInfoDTO nutritionInfo;
}
