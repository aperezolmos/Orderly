package es.ubu.inf.tfg.food.nutritionInfo.dto;

import java.math.BigDecimal;

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
    private BigDecimal calories;

    @PositiveOrZero(message = "Carbohydrates cannot be negative")
    private BigDecimal carbohydrates;

    @PositiveOrZero(message = "Fats cannot be negative")
    private BigDecimal fats;
    
    @PositiveOrZero(message = "Fiber cannot be negative")
    private BigDecimal fiber;
    
    @PositiveOrZero(message = "Protein cannot be negative")
    private BigDecimal protein;

    @PositiveOrZero(message = "Salt cannot be negative")
    private BigDecimal salt;

    @PositiveOrZero(message = "Saturated fats cannot be negative")
    private BigDecimal saturatedFats;
    
    @PositiveOrZero(message = "Sugars cannot be negative")
    private BigDecimal sugars;

    private MineralsDTO minerals;

    private VitaminsDTO vitamins;
}
