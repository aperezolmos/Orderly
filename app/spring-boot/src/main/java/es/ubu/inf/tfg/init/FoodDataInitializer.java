package es.ubu.inf.tfg.init;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.FoodRepository;
import es.ubu.inf.tfg.food.classification.AllergenInfo;
import es.ubu.inf.tfg.food.classification.FoodGroup;
import es.ubu.inf.tfg.food.classification.NutritionalMetrics;
import es.ubu.inf.tfg.food.classification.type.Allergen;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.minerals.Minerals;
import es.ubu.inf.tfg.food.nutritionInfo.vitamins.Vitamins;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.math.BigDecimal;
import java.util.Set;
import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "APP_INIT_DEMO_DATA", havingValue = "true")
public class FoodDataInitializer implements CommandLineRunner {

    private final FoodRepository foodRepository;


    @Override
    public void run(String... args) {
        
        if (foodRepository.count() > 0) {
            log.info("Food table already contains data. Skipping FoodDataInitializer");
            return;
        }

        List<Food> foods = List.of(
            
            // PROTEINS
            prepareFood("Huevo de Gallina", FoodGroup.PROTEINS, "50", Set.of(Allergen.EGGS), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("72")).protein(bd("6.3")).fats(bd("4.8")).saturatedFats(bd("1.5"))
                    .vitamins(Vitamins.builder().vitaminB12(bd("0.006")).vitaminD(bd("0.002")).build())
                    .build()).build(),
            
            prepareFood("Carne de Vacuno", FoodGroup.PROTEINS, "150", Set.of(), "B", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("250")).protein(bd("20")).fats(bd("18")).saturatedFats(bd("8.0"))
                    .minerals(Minerals.builder().iron(bd("4.5")).zinc(bd("7.0")).build())
                    .vitamins(Vitamins.builder().vitaminB3(bd("6.0")).build())
                    .build()).build(),

            prepareFood("Bacon Ahumado", FoodGroup.PROTEINS, "30", Set.of(), "E", 3)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("150")).protein(bd("4")).fats(bd("22")).salt(bd("0.8")).saturatedFats(bd("22.0"))
                    .minerals(Minerals.builder().sodium(bd("2200")).selenium(bd("0.020")).build())
                    .build()).build(),

            prepareFood("Salmón Noruego", FoodGroup.PROTEINS, "120", Set.of(Allergen.FISH), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("240")).protein(bd("24")).fats(bd("16")).saturatedFats(bd("3.0"))
                    .vitamins(Vitamins.builder().vitaminD(bd("0.020")).vitaminB12(bd("0.003")).build())
                    .build()).build(),
            
            prepareFood("Langostinos", FoodGroup.PROTEINS, "100", Set.of(Allergen.CRUSTACEANS), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("95")).protein(bd("20")).fats(bd("1")).salt(bd("0.4"))
                    .minerals(Minerals.builder().selenium(bd("0.060")).zinc(bd("1.5")).build())
                    .build()).build(),
            
            prepareFood("Pechuga de Pollo", FoodGroup.PROTEINS, "100", Set.of(), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("110")).protein(bd("23")).fats(bd("1.2"))
                    .minerals(Minerals.builder().phosphorus(bd("210")).build())
                    .vitamins(Vitamins.builder().vitaminB3(bd("10.0")).build())
                    .build()).build(),
            
            
            // VEGETABLES
            prepareFood("Lechuga Iceberg", FoodGroup.VEGETABLES, "20", Set.of(), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("3")).fiber(bd("0.2"))
                    .vitamins(Vitamins.builder().vitaminA(bd("0.1")).build())
                    .build()).build(),
            
            prepareFood("Aguacate", FoodGroup.VEGETABLES, "100", Set.of(), "B", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("160")).fats(bd("15")).fiber(bd("7"))
                    .minerals(Minerals.builder().potassium(bd("485")).build())
                    .vitamins(Vitamins.builder().vitaminE(bd("2.0")).build())
                    .build()).build(),

            prepareFood("Tomate", FoodGroup.VEGETABLES, "80", Set.of(), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("18")).carbohydrates(bd("3.9")).protein(bd("0.9")).sugars(bd("4.0"))
                    .minerals(Minerals.builder().potassium(bd("237")).build())
                    .vitamins(Vitamins.builder().vitaminC(bd("13.7")).build())
                    .build()).build(),

            prepareFood("Cebolla", FoodGroup.VEGETABLES, "50", Set.of(), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("20")).carbohydrates(bd("3.9")).protein(bd("0.9"))
                    .minerals(Minerals.builder().magnesium(bd("10")).build())
                    .vitamins(Vitamins.builder().vitaminB6(bd("0.1")).build())
                    .build()).build(),

            prepareFood("Patatas", FoodGroup.VEGETABLES, "100", Set.of(), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("77")).carbohydrates(bd("3.9")).protein(bd("0.9"))
                    .minerals(Minerals.builder().potassium(bd("3800")).build())
                    .vitamins(Vitamins.builder().vitaminC(bd("19")).build())
                    .build()).build(),


            // GRAINS
            prepareFood("Pan Brioche", FoodGroup.GRAINS, "80", 
                Set.of(Allergen.GLUTEN, Allergen.MILK, Allergen.SESAME_SEEDS), "C", 4)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("280")).carbohydrates(bd("45")).sugars(bd("8")).saturatedFats(bd("4.0"))
                    .minerals(Minerals.builder().calcium(bd("150")).build())
                    .vitamins(Vitamins.builder().vitaminB1(bd("0.3")).build())
                    .build()).build(),

            prepareFood("Spaghetti", FoodGroup.GRAINS, "100", Set.of(Allergen.GLUTEN), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("250")).carbohydrates(bd("70")).protein(bd("12"))
                    .minerals(Minerals.builder().phosphorus(bd("160")).selenium(bd("0.03")).build())
                    .build()).build(),
            
            prepareFood("Harina de Trigo", FoodGroup.GRAINS, "100", Set.of(Allergen.GLUTEN), "C", 2)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("364")).carbohydrates(bd("76")).protein(bd("10")).fiber(bd("2.7"))
                    .minerals(Minerals.builder().iron(bd("20.0")).build())
                    .vitamins(Vitamins.builder().vitaminB1(bd("0.5")).build())
                    .build()).build(),

            prepareFood("Arroz Blanco", FoodGroup.GRAINS, "100", Set.of(), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("130")).carbohydrates(bd("76")).protein(bd("10"))
                    .minerals(Minerals.builder().magnesium(bd("25")).build())
                    .build()).build(),


            // DAIRY
            prepareFood("Nata para Cocinar", FoodGroup.DAIRY, "100", Set.of(Allergen.MILK), "D", 3)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("335")).fats(bd("35")).sugars(bd("2")).saturatedFats(bd("25.0"))
                    .minerals(Minerals.builder().calcium(bd("80")).build())
                    .vitamins(Vitamins.builder().vitaminA(bd("0.15")).build())
                    .build()).build(),
            
            prepareFood("Queso Parmesano", FoodGroup.DAIRY, "30", Set.of(Allergen.MILK), "D", 3)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("110")).protein(bd("9")).fats(bd("8")).salt(bd("0.5")).saturatedFats(bd("6.0"))
                    .minerals(Minerals.builder().calcium(bd("1100")).phosphorus(bd("200")).build())
                    .build()).build(),

            prepareFood("Queso Mozzarella", FoodGroup.DAIRY, "60", Set.of(Allergen.MILK), "C", 2)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("160")).protein(bd("18")).fats(bd("21")).salt(bd("0.7")).saturatedFats(bd("12.0"))
                    .minerals(Minerals.builder().calcium(bd("505")).build())
                    .vitamins(Vitamins.builder().vitaminB12(bd("0.002")).build())
                    .build()).build(),

            
            // SAUCES AND FATS
            prepareFood("Salsa de Soja", FoodGroup.COMBINATION, "15", 
                Set.of(Allergen.SOYBEANS, Allergen.GLUTEN), "E", 4)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("10")).protein(bd("1.5")).salt(bd("2.5")).sugars(bd("12.0"))
                    .minerals(Minerals.builder().sodium(bd("1500")).iron(bd("0.4")).build())
                    .build()).build(),

            prepareFood("Mayonesa", FoodGroup.FATS, "20", Set.of(Allergen.EGGS), "D", 4)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("140")).fats(bd("15"))
                    .vitamins(Vitamins.builder().vitaminE(bd("3.0")).build())
                    .build()).build(),

            prepareFood("Mostaza Dijon", FoodGroup.COMBINATION, "15", Set.of(Allergen.MUSTARD), "C", 4)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("15")).fats(bd("10")).salt(bd("0.4"))
                    .minerals(Minerals.builder().selenium(bd("0.010")).sodium(bd("200")).build())
                    .build()).build(),
            
            prepareFood("Aceite de Oliva", FoodGroup.FATS, "10", Set.of(), "B", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("90")).fats(bd("10"))
                    .vitamins(Vitamins.builder().vitaminE(bd("25.0")).build())
                    .build()).build(),
            

            // OTHER
            prepareFood("Nueces Peladas", FoodGroup.FATS, "30", Set.of(Allergen.NUTS), "A", 1)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("190")).protein(bd("4")).fats(bd("18"))
                    .minerals(Minerals.builder().magnesium(bd("450")).phosphorus(bd("100")).build())
                    .vitamins(Vitamins.builder().vitaminE(bd("0.2")).build())
                    .build()).build(),

            prepareFood("Chocolate Negro", FoodGroup.COMBINATION, "30", Set.of(Allergen.MILK), "D", 3)
                .nutritionInfo(NutritionInfo.builder()
                    .calories(bd("155")).protein(bd("1.5")).fats(bd("10")).saturatedFats(bd("8.5")).sugars(bd("45.0"))
                    .minerals(Minerals.builder().magnesium(bd("70")).iron(bd("3.5")).build())
                    .build()).build()
        );

        foodRepository.saveAll(foods);
        log.info("Inserted demo foods: {}", foods.stream().map(Food::getName).toList());
    }


    // --------------------------------------------------------

    private Food.FoodBuilder prepareFood(String name, FoodGroup group, String weight, 
                                         Set<Allergen> allergens, String nutriScore, Integer nova) {
        return Food.builder()
                .name(name)
                .foodGroup(group)
                .servingWeightGrams(bd(weight))
                .allergenInfo(AllergenInfo.builder().allergens(allergens).build())
                .nutritionalMetrics(NutritionalMetrics.builder()
                        .nutriScore(nutriScore)
                        .novaGroup(nova)
                        .build());
    }

    private BigDecimal bd(String val) {
        return val == null ? BigDecimal.ZERO : new BigDecimal(val);
    }
}
