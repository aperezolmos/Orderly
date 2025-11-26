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
public class MineralsDTO {
    
    @PositiveOrZero(message = "Calcium cannot be negative")
    private BigDecimal calcium;

    @PositiveOrZero(message = "Iron cannot be negative")
    private BigDecimal iron;

    @PositiveOrZero(message = "Magnesium cannot be negative")
    private BigDecimal magnesium;

    @PositiveOrZero(message = "Phosphorus cannot be negative")
    private BigDecimal phosphorus;

    @PositiveOrZero(message = "Potassium cannot be negative")
    private BigDecimal potassium;

    @PositiveOrZero(message = "Selenium cannot be negative")
    private BigDecimal selenium;

    @PositiveOrZero(message = "Sodium cannot be negative")
    private BigDecimal sodium;

    @PositiveOrZero(message = "Zinc cannot be negative")
    private BigDecimal zinc;
}
