package es.ubu.inf.tfg.product;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.recipe.Recipe;
import es.ubu.inf.tfg.recipe.RecipeService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final RecipeService recipeService;


    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    public Product findByName(String name) {
        return productRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with name: " + name));
    }

    public List<Product> findByNameContaining(String namePart) {
        return productRepository.findByNameContainingIgnoreCase(namePart);
    }

    public List<Product> findByMaxPrice(Double maxPrice) {
        return productRepository.findByPriceLessThanEqual(maxPrice);
    }

    public List<Product> findProductsByFood(Integer foodId) {
        return productRepository.findByRecipes_FoodId(foodId);
    }

    // --------------------------------------------------------

    public Product create(Product product) {
        
        if (productRepository.existsByName(product.getName())) {
            throw new IllegalArgumentException("Product with name '" + product.getName() + "' already exists");
        }
        return productRepository.save(product);
    }

    public Product update(Integer id, Product productUpdate) {
        
        Product existingProduct = findById(id);
        
        if (productUpdate.getName() != null && !productUpdate.getName().equals(existingProduct.getName())) {
            if (productRepository.existsByName(productUpdate.getName())) {
                throw new IllegalArgumentException("Product with name '" + productUpdate.getName() + "' already exists");
            }
            existingProduct.setName(productUpdate.getName());
        }
        
        existingProduct.setDescription(productUpdate.getDescription());
        
        if (productUpdate.getPrice() != null) {
            existingProduct.setPrice(productUpdate.getPrice());
        }
        
        return productRepository.save(existingProduct);
    }

    public void delete(Integer id) {

        Product product = findById(id);

        if (!product.getRecipes().isEmpty()) {
            throw new ResourceInUseException("Product", id, "Food");
        }
        productRepository.delete(product);
    }

    // --------------------------------------------------------

    public Recipe addFoodToProduct(Integer productId, Integer foodId, Double quantity) {
        return recipeService.create(productId, foodId, quantity);
    }

    public Recipe updateFoodQuantityInProduct(Integer productId, Integer foodId, Double newQuantity) {
        return recipeService.updateQuantity(productId, foodId, newQuantity);
    }

    public void removeFoodFromProduct(Integer productId, Integer foodId) {
        recipeService.delete(productId, foodId);
    }

    public NutritionInfo calculateProductNutritionInfo(Integer productId) {
        
        Product product = findById(productId);
        NutritionInfo totalNutrition = NutritionInfo.builder().build();
        
        for (Recipe recipe : product.getRecipes()) {
            NutritionInfo recipeNutrition = recipe.calculateNutritionInfo();
            totalNutrition = totalNutrition.add(recipeNutrition);
        }
        
        return totalNutrition;
    }

    public Map<String, Object> getProductDetailedInfo(Integer productId) {
        
        Product product = findById(productId);
        NutritionInfo nutritionInfo = calculateProductNutritionInfo(productId);
        
        Map<String, Object> detailedInfo = new HashMap<>();
        detailedInfo.put("product", product);
        detailedInfo.put("nutritionInfo", nutritionInfo);
        detailedInfo.put("ingredientCount", product.getRecipes().size());
        detailedInfo.put("totalCalories", nutritionInfo.getCalories());
        
        return detailedInfo;
    }
}
