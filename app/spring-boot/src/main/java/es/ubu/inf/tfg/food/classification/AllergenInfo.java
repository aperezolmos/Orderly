package es.ubu.inf.tfg.food.classification;

import es.ubu.inf.tfg.food.classification.type.Allergen;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class AllergenInfo {
    
    @Builder.Default
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Allergen> allergens = new HashSet<>();


    // --------------------------------------------------------

    public boolean addAllergen(Allergen allergen) {
        if (this.allergens == null) this.allergens = new HashSet<>();
        return this.allergens.add(allergen);
    }

    public boolean removeAllergen(Allergen allergen) {
        if (this.allergens == null) return false;
        return this.allergens.remove(allergen);
    }

    public void setAllergens(Set<Allergen> allergens) {
        if (this.allergens != null) {
            this.allergens = new HashSet<>(allergens);
        }
        else {
            this.allergens = new HashSet<>();
        }
    }

    public AllergenInfo addAll(AllergenInfo other) {
        
        if (other == null || other.getAllergens() == null || other.getAllergens().isEmpty()) {
            return AllergenInfo.builder().allergens(this.allergens == null ? Collections.emptySet() 
                : new HashSet<>(this.allergens)).build();
        }
        
        Set<Allergen> union = new HashSet<>();
        if (this.allergens != null) union.addAll(this.allergens);
        union.addAll(other.getAllergens());
        return AllergenInfo.builder().allergens(union).build();
    }
}
