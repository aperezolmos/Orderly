package es.ubu.inf.tfg.food.classification.dto;

import es.ubu.inf.tfg.food.classification.type.Allergen;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllergenInfoDTO {
    
    private Set<Allergen> allergens;
}
