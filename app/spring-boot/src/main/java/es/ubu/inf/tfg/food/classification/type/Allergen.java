package es.ubu.inf.tfg.food.classification.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Allergen {
    GLUTEN(1),
    CRUSTACEANS(2),
    EGGS(3),
    FISH(4),
    PEANUTS(5),
    SOYBEANS(6),
    MILK(7),
    NUTS(8),
    CELERY(9),
    MUSTARD(10),
    SESAME_SEEDS(11),
    SULPHUR_DIOXIDE_SULPHITES(12),
    LUPIN(13),
    MOLLUSCS(14);

    private final int id;
}
