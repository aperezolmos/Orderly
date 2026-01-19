package es.ubu.inf.tfg.food.classification;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FoodGroup {
    DAIRY(1, "Dairy"),
    PROTEINS(2, "Protein-rich Foods"),
    FRUIT(3, "Fruit"),
    VEGETABLES(4, "Vegetables"),
    GRAINS(5, "Grains"),
    FATS(6, "Fats"),
    LEGUMES(7, "Legumes"),
    COMBINATION(8, "Food Combination"),
    NOT_APPLICABLE(9, "Not Applicable");

    private final int code;
    private final String foodGroup;
}
