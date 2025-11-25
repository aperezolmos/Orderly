package es.ubu.inf.tfg.product.ingredient;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class IngredientId implements Serializable {

    private Integer productId;

    private Integer foodId;
}
