package es.ubu.inf.tfg.product.ingredient.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientResponseDTO {
    private Integer foodId;
    private String foodName;
    private BigDecimal quantityInGrams;
}
