package es.ubu.inf.tfg.food.nutritionInfo.minerals;

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
public class Minerals {
    
    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal calcium = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal iron = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal magnesium = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal phosphorus = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal potassium = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal selenium = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal sodium = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision=10, scale=4)
    private BigDecimal zinc = BigDecimal.ZERO;

    
    // --------------------------------------------------------
    
    public Minerals add(Minerals other) {
        if (other == null) return null;
        return Minerals.builder()
                .calcium(this.calcium.add(other.calcium))
                .iron(this.iron.add(other.iron))
                .magnesium(this.magnesium.add(other.magnesium))
                .phosphorus(this.phosphorus.add(other.phosphorus))
                .potassium(this.potassium.add(other.potassium))
                .selenium(this.selenium.add(other.selenium))
                .sodium(this.sodium.add(other.sodium))
                .zinc(this.zinc.add(other.zinc))
                .build();
    }
    
    public Minerals multiplyByFactor(BigDecimal factor) {
        if (factor == null) return null;
        return Minerals.builder()
                .calcium(this.calcium.multiply(factor))
                .iron(this.iron.multiply(factor))
                .magnesium(this.magnesium.multiply(factor))
                .phosphorus(this.phosphorus.multiply(factor))
                .potassium(this.potassium.multiply(factor))
                .selenium(this.selenium.multiply(factor))
                .sodium(this.sodium.multiply(factor))
                .zinc(this.zinc.multiply(factor))
                .build();
    }
}
