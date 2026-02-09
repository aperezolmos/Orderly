package es.ubu.inf.tfg.food.nutritionInfo;

import java.math.BigDecimal;

import es.ubu.inf.tfg.food.nutritionInfo.minerals.Minerals;
import es.ubu.inf.tfg.food.nutritionInfo.vitamins.Vitamins;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;

import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class NutritionInfo {

    @Builder.Default
    @Column(precision = 8, scale = 4)
    private BigDecimal calories = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision = 8, scale = 4)
    private BigDecimal carbohydrates = BigDecimal.ZERO;
    
    @Builder.Default
    @Column(precision = 8, scale = 4)
    private BigDecimal fats = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision = 8, scale = 4)
    private BigDecimal fiber = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision = 8, scale = 4)
    private BigDecimal protein = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision = 8, scale = 4)
    private BigDecimal salt = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision = 8, scale = 4)
    private BigDecimal saturatedFats = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision = 8, scale = 4)
    private BigDecimal sugars = BigDecimal.ZERO;
 
    @Builder.Default
    @Embedded
    private Minerals minerals = Minerals.builder().build();

    @Builder.Default
    @Embedded
    private Vitamins vitamins = Vitamins.builder().build();


    // --------------------------------------------------------
    
    public NutritionInfo add(NutritionInfo other) {
        if (other == null) return null;
        return NutritionInfo.builder()
                .calories(this.calories.add(other.calories))
                .carbohydrates(this.carbohydrates.add(other.carbohydrates))
                .fats(this.fats.add(other.fats))
                .fiber(this.fiber.add(other.fiber))
                .protein(this.protein.add(other.protein))
                .salt(this.salt.add(other.salt))
                .saturatedFats(this.saturatedFats.add(other.saturatedFats))
                .sugars(this.sugars.add(other.sugars))
                .minerals(this.minerals.add(other.minerals))
                .vitamins(this.vitamins.add(other.vitamins))
                .build();
    }

    public NutritionInfo multiplyByFactor(BigDecimal factor) {
        if (factor == null) return null;
        return NutritionInfo.builder()
                .calories(this.calories.multiply(factor))
                .carbohydrates(this.carbohydrates.multiply(factor))
                .fats(this.fats.multiply(factor))
                .fiber(this.fiber.multiply(factor))
                .protein(this.protein.multiply(factor))
                .salt(this.salt.multiply(factor))
                .saturatedFats(this.saturatedFats.multiply(factor))
                .sugars(this.sugars.multiply(factor))
                .minerals(this.minerals.multiplyByFactor(factor))
                .vitamins(this.vitamins.multiplyByFactor(factor))
                .build();
    }
}
