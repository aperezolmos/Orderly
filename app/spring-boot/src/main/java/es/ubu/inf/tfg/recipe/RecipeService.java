package es.ubu.inf.tfg.recipe;

import java.util.List;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.FoodService;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.product.Product;
import es.ubu.inf.tfg.product.ProductService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RecipeService {
    
    private final RecipeRepository recipeRepository;
    private final FoodService foodService;
    private final ProductService productService;


    public Recipe findById(RecipeId id) {

        Integer foodId = id.getFoodId();
        Integer productId = id.getProductId();

        return recipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found for foodId: " + foodId
                + " and productId: " + productId));
    }

    public List<Recipe> findByFood(Integer foodId) {
        return recipeRepository.findByFoodId(foodId);
    }

    public List<Recipe> findByProduct(Integer productId) {
        return recipeRepository.findByProductId(productId);
    }

    // --------------------------------------------------------

    public Recipe create(Integer foodId, Integer productId, Double quantity) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Food food = foodService.findById(foodId);
        Product product = productService.findById(productId);

        RecipeId recipeId = new RecipeId(foodId, productId);
        if (recipeRepository.existsById(recipeId)) {
            throw new IllegalArgumentException("Recipe already exists for this food and product");
        }

        // La consistencia bidireccional se maneja automáticamente
        // El builder en el constructor de Recipe usa los setters personalizados que aseguran consistencia
        Recipe recipe = Recipe.builder()
                .id(recipeId)
                .quantity(quantity)
                .food(food)
                .product(product)
                .build();

        log.debug("Food has " + food.getRecipes().size() + " recipes"); // TODO: borrar tras comprobación
        log.debug("Product has " + product.getRecipes().size() + " recipes");

        return recipeRepository.save(recipe);
    }

    public Recipe updateQuantity(Integer productId, Integer foodId, Double newQuantity) {
        
        if (newQuantity == null || newQuantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Recipe recipe = findById(new RecipeId(foodId, productId));
        recipe.setQuantity(newQuantity);
        
        return recipeRepository.save(recipe);
    }

    public void delete(Integer productId, Integer foodId) {
        Recipe recipe = findById(new RecipeId(foodId, productId));
        recipeRepository.delete(recipe);
    }

    public void deleteByFood(Integer foodId) {
        recipeRepository.deleteByFoodId(foodId);
    }

    public void deleteByProduct(Integer productId) { 
        recipeRepository.deleteByProductId(productId);
    }

    // --------------------------------------------------------

    public NutritionInfo calculateNutritionInfoForRecipes(List<RecipeId> recipeIds) {
        
        NutritionInfo total = NutritionInfo.builder().build();
        
        for (RecipeId recipeId : recipeIds) {
            Recipe recipe = findById(recipeId);
            NutritionInfo recipeNutrition = recipe.calculateNutritionInfo();
            total = total.add(recipeNutrition);
        }
        return total;
    }
}
