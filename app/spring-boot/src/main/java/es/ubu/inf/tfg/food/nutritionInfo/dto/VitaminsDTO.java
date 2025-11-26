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
public class VitaminsDTO {

    @PositiveOrZero(message = "Vitamin A cannot be negative")
    private BigDecimal vitaminA;

    @PositiveOrZero(message = "Vitamin C cannot be negative")
    private BigDecimal vitaminC;

    @PositiveOrZero(message = "Vitamin D cannot be negative")
    private BigDecimal vitaminD;

    @PositiveOrZero(message = "Vitamin E cannot be negative")
    private BigDecimal vitaminE;

    @PositiveOrZero(message = "Vitamin B1 cannot be negative")
    private BigDecimal vitaminB1;

    @PositiveOrZero(message = "Vitamin B2 cannot be negative")
    private BigDecimal vitaminB2;

    @PositiveOrZero(message = "Vitamin B3 cannot be negative")
    private BigDecimal vitaminB3;

    @PositiveOrZero(message = "Vitamin B6 cannot be negative")
    private BigDecimal vitaminB6;

    @PositiveOrZero(message = "Vitamin B9 cannot be negative")
    private BigDecimal vitaminB9;

    @PositiveOrZero(message = "Vitamin B12 cannot be negative")
    private BigDecimal vitaminB12;
}
