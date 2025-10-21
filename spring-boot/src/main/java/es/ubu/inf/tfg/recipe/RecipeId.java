package es.ubu.inf.tfg.recipe;

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
public class RecipeId implements Serializable {

    private Integer foodId;
    
    private Integer productId;
}
