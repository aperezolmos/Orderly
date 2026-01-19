package es.ubu.inf.tfg.food.classification;

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
public class NutritionalMetrics {
    
    private String nutriScore;

    private Integer novaGroup;
}
