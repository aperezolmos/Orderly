package es.ubu.inf.tfg.product;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.FoodRepository;
import es.ubu.inf.tfg.food.classification.AllergenInfo;
import es.ubu.inf.tfg.food.classification.FoodGroup;
import es.ubu.inf.tfg.food.classification.type.Allergen;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.minerals.Minerals;
import es.ubu.inf.tfg.food.nutritionInfo.vitamins.Vitamins;
import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;
import es.ubu.inf.tfg.product.ingredient.Ingredient;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
class ProductServiceIntegrationTest {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private FoodRepository foodRepository;

    private Food cheese;
    private Food tomato;
    private Food ham;
    private Food lettuce;
    private ProductRequestDTO productRequestDTO;


    @BeforeEach
    void setUp() {
        cheese = foodRepository.save(Food.builder()
                .name("Cheese")
                .foodGroup(FoodGroup.DAIRY)
                .servingWeightGrams(new BigDecimal("100"))
                .allergenInfo(AllergenInfo.builder().allergens(Set.of(Allergen.MILK)).build())
                .nutritionInfo(NutritionInfo.builder()
                        .calories(new BigDecimal("400"))
                        .protein(new BigDecimal("25"))
                        .minerals(Minerals.builder().calcium(new BigDecimal("700")).build())
                        .vitamins(Vitamins.builder().vitaminA(new BigDecimal("0.3")).build())
                        .build())
                .build());

        tomato = foodRepository.save(Food.builder()
                .name("Tomato")
                .foodGroup(FoodGroup.VEGETABLES)
                .servingWeightGrams(new BigDecimal("100"))
                .allergenInfo(AllergenInfo.builder().allergens(Set.of()).build())
                .nutritionInfo(NutritionInfo.builder()
                        .calories(new BigDecimal("20"))
                        .protein(new BigDecimal("1"))
                        .minerals(Minerals.builder().potassium(new BigDecimal("250")).build())
                        .vitamins(Vitamins.builder().vitaminC(new BigDecimal("0.02")).build())
                        .build())
                .build());

        ham = foodRepository.save(Food.builder()
                .name("Ham")
                .foodGroup(FoodGroup.PROTEINS)
                .servingWeightGrams(new BigDecimal("100"))
                .allergenInfo(AllergenInfo.builder().allergens(Set.of(Allergen.MILK, Allergen.GLUTEN)).build())
                .nutritionInfo(NutritionInfo.builder()
                        .calories(new BigDecimal("150"))
                        .protein(new BigDecimal("20"))
                        .build())
                .build());

        lettuce = foodRepository.save(Food.builder()
                .name("Lettuce")
                .foodGroup(FoodGroup.VEGETABLES)
                .servingWeightGrams(new BigDecimal("100"))
                .allergenInfo(AllergenInfo.builder().allergens(Set.of(Allergen.GLUTEN)).build())
                .nutritionInfo(NutritionInfo.builder()
                        .calories(new BigDecimal("10"))
                        .protein(new BigDecimal("1"))
                        .build())
                .build());

        productRequestDTO = ProductRequestDTO.builder()
                .name("Pizza Margherita")
                .description("Classic pizza")
                .price(new BigDecimal("10.00"))
                .build();
    }


    // --------------------------------------------------------

    @Test
    void createProduct_ShouldPersistAndReturnDTO() {
        
        ProductResponseDTO response = productService.create(productRequestDTO);

        assertThat(response.getId()).isNotNull();
        assertThat(response.getName()).isEqualTo("Pizza Margherita");
        assertThat(response.getIngredientCount()).isZero();
    }

    @Test
    void addIngredientToProduct_ShouldPersistRelation() {
        
        ProductResponseDTO productDTO = productService.create(productRequestDTO);

        productService.addIngredientToProduct(productDTO.getId(), cheese.getId(), new BigDecimal("50"));

        Product product = productRepository.findById(productDTO.getId()).orElseThrow();
        assertThat(product.getIngredients()).hasSize(1);

        Ingredient ingredient = product.getIngredients().iterator().next();
        assertThat(ingredient.getFood().getName()).isEqualTo("Cheese");
        assertThat(ingredient.getQuantityInGrams()).isEqualTo(new BigDecimal("50"));
        
        // Check bidirectional: food knows about its usage
        assertThat(cheese.getUsages()).anyMatch(i -> i.getProduct().getId().equals(product.getId()));
    }

    @Test
    void calculateProductNutritionInfo_ShouldSumIngredients() {

        ProductResponseDTO productDTO = productService.create(productRequestDTO);

        productService.addIngredientToProduct(productDTO.getId(), cheese.getId(), new BigDecimal("50"));
        productService.addIngredientToProduct(productDTO.getId(), tomato.getId(), new BigDecimal("100"));

        // Cheese: 50g (half of serving), Tomato: 100g (full serving)
        // Cheese: 200 cal, 12.5 protein, 350 Ca, 0.15 vitA
        // Tomato: 20 cal, 1 protein, 250 K, 0.02 vitC

        var nutrition = productService.calculateProductNutritionInfo(productDTO.getId());

        assertThat(nutrition.getCalories()).isEqualByComparingTo(new BigDecimal("220.00"));
        assertThat(nutrition.getProtein()).isEqualByComparingTo(new BigDecimal("13.50"));
        assertThat(nutrition.getMinerals().getCalcium()).isEqualByComparingTo(new BigDecimal("350.0000"));
        assertThat(nutrition.getMinerals().getPotassium()).isEqualByComparingTo(new BigDecimal("250.0000"));
        assertThat(nutrition.getVitamins().getVitaminA()).isEqualByComparingTo(new BigDecimal("0.1500"));
        assertThat(nutrition.getVitamins().getVitaminC()).isEqualByComparingTo(new BigDecimal("0.0200"));
    }

    @Test
    void removeIngredientFromProduct_ShouldRemoveRelation() {
        
        ProductResponseDTO productDTO = productService.create(productRequestDTO);

        productService.addIngredientToProduct(productDTO.getId(), cheese.getId(), new BigDecimal("50"));
        productService.addIngredientToProduct(productDTO.getId(), tomato.getId(), new BigDecimal("100"));

        productService.removeIngredientFromProduct(productDTO.getId(), cheese.getId());

        Product product = productRepository.findById(productDTO.getId()).orElseThrow();
        assertThat(product.getIngredients()).hasSize(1);
        assertThat(product.getIngredients().iterator().next().getFood().getName()).isEqualTo("Tomato");

        // Check bidirectional: cheese should not have usage for this product anymore
        assertThat(cheese.getUsages()).noneMatch(i -> i.getProduct().getId().equals(product.getId()));
    }

    @Test
    void productAllergens_ShouldAggregateFromIngredients() {
        ProductResponseDTO productDTO = productService.create(productRequestDTO);

        productService.addIngredientToProduct(productDTO.getId(), cheese.getId(), new BigDecimal("50"));
        productService.addIngredientToProduct(productDTO.getId(), ham.getId(), new BigDecimal("100"));
        productService.addIngredientToProduct(productDTO.getId(), tomato.getId(), new BigDecimal("100"));

        // Cheese: MILK, Ham: MILK, GLUTEN, Tomato: none
        // Expected: MILK, GLUTEN

        var allergensDTO = productService.getProductAllergens(productDTO.getId());
        assertThat(allergensDTO.getAllergens()).containsExactlyInAnyOrder(Allergen.MILK, Allergen.GLUTEN);
    }

    @Test
    void productAllergens_ShouldHandleNoAllergens() {
        ProductResponseDTO productDTO = productService.create(productRequestDTO);

        productService.addIngredientToProduct(productDTO.getId(), tomato.getId(), new BigDecimal("100"));

        var allergensDTO = productService.getProductAllergens(productDTO.getId());
        assertThat(allergensDTO.getAllergens()).isEmpty();
    }

    @Test
    void productAllergens_ShouldHandleRepeatedAllergens() {
        ProductResponseDTO productDTO = productService.create(productRequestDTO);

        productService.addIngredientToProduct(productDTO.getId(), ham.getId(), new BigDecimal("100"));
        productService.addIngredientToProduct(productDTO.getId(), lettuce.getId(), new BigDecimal("100"));

        // Ham: MILK, GLUTEN; Lettuce: GLUTEN
        // Expected: MILK, GLUTEN

        var allergensDTO = productService.getProductAllergens(productDTO.getId());
        assertThat(allergensDTO.getAllergens()).containsExactlyInAnyOrder(Allergen.MILK, Allergen.GLUTEN);
    }

    @Test
    void productAllergens_ShouldUpdateWhenIngredientRemoved() {
        ProductResponseDTO productDTO = productService.create(productRequestDTO);

        productService.addIngredientToProduct(productDTO.getId(), ham.getId(), new BigDecimal("100"));
        productService.addIngredientToProduct(productDTO.getId(), cheese.getId(), new BigDecimal("50"));

        productService.removeIngredientFromProduct(productDTO.getId(), ham.getId());

        var allergensDTO = productService.getProductAllergens(productDTO.getId());
        assertThat(allergensDTO.getAllergens()).containsExactly(Allergen.MILK);
    }
}
