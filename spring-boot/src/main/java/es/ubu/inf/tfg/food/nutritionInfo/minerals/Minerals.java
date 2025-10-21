package es.ubu.inf.tfg.food.nutritionInfo.minerals;

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
}
