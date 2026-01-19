package es.ubu.inf.tfg.food.external.openFoodFacts.dto.mapper;

import es.ubu.inf.tfg.food.classification.type.Allergen;

import lombok.experimental.UtilityClass;

import java.util.Map;

@UtilityClass
public class OpenFoodFactsRegistry {
    
    public final Map<String, Allergen> ALLERGEN_CODES = Map.ofEntries(
        Map.entry("en:gluten", Allergen.GLUTEN),
        Map.entry("en:crustaceans", Allergen.CRUSTACEANS),
        Map.entry("en:eggs", Allergen.EGGS),
        Map.entry("en:fish", Allergen.FISH),
        Map.entry("en:peanuts", Allergen.PEANUTS),
        Map.entry("en:soybeans", Allergen.SOYBEANS),
        Map.entry("en:milk", Allergen.MILK),
        Map.entry("en:nuts", Allergen.NUTS),
        Map.entry("en:celery", Allergen.CELERY),
        Map.entry("en:mustard", Allergen.MUSTARD),
        Map.entry("en:sesame-seeds", Allergen.SESAME_SEEDS),
        Map.entry("en:sulphur-dioxide-and-sulphites", Allergen.SULPHUR_DIOXIDE_SULPHITES),
        Map.entry("en:lupin", Allergen.LUPIN),
        Map.entry("en:molluscs", Allergen.MOLLUSCS)
    );

    @UtilityClass
    public class Nutriments {
        public static final String CALORIES = "energy-kcal_100g";
        public static final String CARBS = "carbohydrates_100g";
        public static final String FAT = "fat_100g";
        public static final String FIBER = "fiber_100g";
        public static final String PROTEIN = "proteins_100g";
        public static final String SALT = "salt_100g";
        public static final String SATURATED_FAT = "saturated-fat_100g";
        public static final String SUGARS = "sugars_100g";

        // Minerals
        public static final String CALCIUM = "calcium_100g";
        public static final String IRON = "iron_100g";
        public static final String MAGNESIUM = "magnesium_100g";
        public static final String PHOSPHORUS = "phosphorus_100g";
        public static final String POTASSIUM = "potassium_100g";
        public static final String SELENIUM = "selenium_100g";
        public static final String SODIUM = "sodium_100g";
        public static final String ZINC = "zinc_100g";

        // Vitamins
        public static final String VIT_A = "vitamin-a_100g";
        public static final String VIT_B1 = "vitamin-b1_100g";
        public static final String VIT_B2 = "vitamin-b2_100g";
        public static final String VIT_B3 = "vitamin-pp_100g";
        public static final String VIT_B6 = "vitamin-b6_100g";
        public static final String VIT_B9 = "vitamin-b9_100g";
        public static final String VIT_B12 = "vitamin-b12_100g";
        public static final String VIT_C = "vitamin-c_100g";
        public static final String VIT_D = "vitamin-d_100g";
        public static final String VIT_E = "vitamin-e_100g";
    }
}
