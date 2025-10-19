package es.ubu.inf.tfg.food.nutritionInfo.vitamins;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vitamins {
    
    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminA = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminC = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminD = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminE = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminB1 = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminB2 = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminB3 = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminB6 = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminB9 = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal vitaminB12 = BigDecimal.ZERO;    
}
