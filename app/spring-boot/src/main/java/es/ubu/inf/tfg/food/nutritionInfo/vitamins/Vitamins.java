package es.ubu.inf.tfg.food.nutritionInfo.vitamins;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
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
       
    
    // --------------------------------------------------------
    
    public Vitamins add(Vitamins other) {
        return Vitamins.builder()
                .vitaminA(this.vitaminA.add(other.vitaminA))
                .vitaminC(this.vitaminC.add(other.vitaminC))
                .vitaminD(this.vitaminD.add(other.vitaminD))
                .vitaminE(this.vitaminE.add(other.vitaminE))
                .vitaminB1(this.vitaminB1.add(other.vitaminB1))
                .vitaminB2(this.vitaminB2.add(other.vitaminB2))
                .vitaminB3(this.vitaminB3.add(other.vitaminB3))
                .vitaminB6(this.vitaminB6.add(other.vitaminB6))
                .vitaminB9(this.vitaminB9.add(other.vitaminB9))
                .vitaminB12(this.vitaminB12.add(other.vitaminB12))
                .build();
    }
    
    public Vitamins multiplyByFactor(BigDecimal factor) {
        return Vitamins.builder()
                .vitaminA(this.vitaminA.multiply(factor))
                .vitaminC(this.vitaminC.multiply(factor))
                .vitaminD(this.vitaminD.multiply(factor))
                .vitaminE(this.vitaminE.multiply(factor))
                .vitaminB1(this.vitaminB1.multiply(factor))
                .vitaminB2(this.vitaminB2.multiply(factor))
                .vitaminB3(this.vitaminB3.multiply(factor))
                .vitaminB6(this.vitaminB6.multiply(factor))
                .vitaminB9(this.vitaminB9.multiply(factor))
                .vitaminB12(this.vitaminB12.multiply(factor))
                .build();
    }
}
