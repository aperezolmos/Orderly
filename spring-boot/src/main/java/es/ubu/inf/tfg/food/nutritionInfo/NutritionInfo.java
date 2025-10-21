package es.ubu.inf.tfg.food.nutritionInfo;

import java.math.BigDecimal;

import es.ubu.inf.tfg.food.nutritionInfo.minerals.Minerals;
import es.ubu.inf.tfg.food.nutritionInfo.vitamins.Vitamins;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionInfo {

    @Builder.Default
    @Column(precision=6, scale=2)
    private BigDecimal calories = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=6, scale=2)
    private BigDecimal carbohydrates = BigDecimal.ZERO;
    
    @Builder.Default
    @Column(precision=6, scale=2)
    private BigDecimal fats = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=6, scale=2)
    private BigDecimal fiber = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=6, scale=2)
    private BigDecimal protein = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=6, scale=2)
    private BigDecimal salt = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=6, scale=2)
    private BigDecimal saturatedFats = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=6, scale=2)
    private BigDecimal sugars = BigDecimal.ZERO;
 
    @Embedded
    private Minerals minerals;

    @Embedded
    private Vitamins vitamins;
}
