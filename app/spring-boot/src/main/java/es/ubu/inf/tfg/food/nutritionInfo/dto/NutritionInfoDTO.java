package es.ubu.inf.tfg.food.nutritionInfo.dto;

import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionInfoDTO {
    
    @PositiveOrZero(message = "Calories cannot be negative")
    private Double calories;

    @PositiveOrZero(message = "Carbohydrates cannot be negative")
    private Double carbohydrates;

    @PositiveOrZero(message = "Fats cannot be negative")
    private Double fats;
    
    @PositiveOrZero(message = "Fiber cannot be negative")
    private Double fiber;
    
    @PositiveOrZero(message = "Protein cannot be negative")
    private Double protein;
    
    @PositiveOrZero(message = "Sugars cannot be negative")
    private Double sugars;
}
