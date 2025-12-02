package es.ubu.inf.tfg.product;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.FoodService;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;

import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;
import es.ubu.inf.tfg.product.dto.mapper.ProductMapper;

import es.ubu.inf.tfg.product.ingredient.Ingredient;
import es.ubu.inf.tfg.product.ingredient.dto.IngredientRequestDTO;
import es.ubu.inf.tfg.product.ingredient.dto.IngredientResponseDTO;
import es.ubu.inf.tfg.product.ingredient.dto.mapper.IngredientMapper;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final FoodService foodService;
    private final IngredientMapper ingredientMapper;

    
    public List<ProductResponseDTO> findAll() {
        return productRepository.findAll().stream()
                .map(productMapper::toResponseDTO)
                .toList();
    }

    public ProductResponseDTO findById(Integer id) {
        Product product = findEntityById(id);
        return productMapper.toResponseDTO(product);
    }

    public Product findEntityById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    public ProductResponseDTO findByName(String name) {
        Product product = productRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with name: " + name));
        return productMapper.toResponseDTO(product);
    }

    public List<ProductResponseDTO> findByNameContaining(String namePart) {
        return productRepository.findByNameContainingIgnoreCase(namePart).stream()
                .map(productMapper::toResponseDTO)
                .toList();
    }

    public List<ProductResponseDTO> findByMaxPrice(BigDecimal maxPrice) {
        return productRepository.findByPriceLessThanEqual(maxPrice).stream()
                .map(productMapper::toResponseDTO)
                .toList();
    }

    public List<ProductResponseDTO> findProductsByFood(Integer foodId) {
        return productRepository.findByIngredients_FoodId(foodId).stream()
                .map(productMapper::toResponseDTO)
                .toList();
    }

    public boolean existsById(Integer id) {
        return productRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    public boolean existsByFoodId(Integer foodId) {
        return productRepository.existsByIngredients_FoodId(foodId);
    }


    // --------------------------------------------------------
    // CRUD METHODS

    public ProductResponseDTO create(ProductRequestDTO productRequest) {
        
        checkProductNameExists(productRequest.getName());
        Product product = productMapper.toEntity(productRequest);

        if (productRequest.getIngredients() != null) {
            setProductIngredients(product, productRequest.getIngredients());
        }

        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(savedProduct);
    }

    public ProductResponseDTO update(Integer id, ProductRequestDTO productRequest) {
        
        Product existingProduct = findEntityById(id);
        
        if (productRequest.getName() != null && !productRequest.getName().equals(existingProduct.getName())) {
            checkProductNameExists(productRequest.getName());
            existingProduct.setName(productRequest.getName());
        }
        
        existingProduct.setDescription(productRequest.getDescription());
        
        if (productRequest.getPrice().compareTo(BigDecimal.ZERO) >= 0) {
            existingProduct.setPrice(productRequest.getPrice());
        }
        
        if (productRequest.getIngredients() != null) {
            setProductIngredients(existingProduct, productRequest.getIngredients());
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.toResponseDTO(updatedProduct);
    }

    public void delete(Integer id) {
        
        Product product = findEntityById(id);

        if (!product.getIngredients().isEmpty()) {
            throw new ResourceInUseException("Product", id, "Food");
        }
        productRepository.delete(product);
    }


    // --------------------------------------------------------
    // DOMAIN METHODS (ingredients)

    public IngredientResponseDTO addIngredientToProduct(Integer productId, Integer foodId, BigDecimal quantity) {

        Product product = findEntityById(productId);

        Ingredient ingredient = createIngredient(product, foodId, quantity);
        productRepository.save(product);
        
        return ingredientMapper.toResponseDTO(ingredient);
    }

    public IngredientResponseDTO updateIngredientQuantity(Integer productId, Integer foodId, BigDecimal newQuantity) {
        
        validateQuantityPositive(newQuantity);

        Ingredient ingredient = findIngredientById(productId, foodId);
        Product product = findEntityById(productId);

        ingredient.setQuantity(newQuantity);
        productRepository.save(product);
                
        return ingredientMapper.toResponseDTO(ingredient);
    }

    public void removeIngredientFromProduct(Integer productId, Integer foodId) {

        Ingredient ingredient = findIngredientById(productId, foodId);
        ingredient.remove();
    }


    // --------------------------------------------------------
    // INFO

    public NutritionInfo calculateProductNutritionInfo(Integer productId) {
        
        Product product = findEntityById(productId);
        return product.calculateTotalNutrition();
    }

    public ProductResponseDTO getProductDetailedInfo(Integer productId, boolean includeIngredients) {
        
        Product product = findEntityById(productId);
        NutritionInfo nutritionInfo = calculateProductNutritionInfo(productId);
        
        if (includeIngredients) {
            return productMapper.toCompleteResponseDTO(product, nutritionInfo);
        } 
        else {
            return productMapper.toNutritionalResponseDTO(product, nutritionInfo);
        }
    }

    public List<IngredientResponseDTO> getProductIngredients(Integer productId) {
        
        Product product = findEntityById(productId);
        return product.getIngredients().stream()
                .map(ingredientMapper::toResponseDTO)
                .toList();
    }


    // --------------------------------------------------------

    private void checkProductNameExists(String productName) {
        if (existsByName(productName)) {
            throw new IllegalArgumentException("Product with name '" + productName + "' already exists");
        }
    }

    private void validateQuantityPositive(BigDecimal quantity){
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
    }

    private Ingredient createIngredient(Product product, Integer foodId, BigDecimal quantity) {
        
        validateQuantityPositive(quantity);
        Food food = foodService.findEntityById(foodId);

        if (existsIngredientById(product.getId(), foodId)) {
            throw new IllegalArgumentException("Ingredient with productId: " + product.getId() + " and foodId: "
                + foodId + " already exists");
        }

        // Internally ensures bidirectional consistency and collection updates
        return new Ingredient(product, food, quantity);
    }

    private void setProductIngredients(Product product, Set<IngredientRequestDTO> ingredients) {
        
        if (product.getIngredients() != null) {
            product.clearIngredients();
        }
        else {
            product.setIngredients(new HashSet<>());
        }

        if (ingredients != null && !ingredients.isEmpty()) {
            for (IngredientRequestDTO dto : ingredients) {
                createIngredient(product, dto.getFoodId(), dto.getQuantityInGrams());
            }
        }
    }

    private Ingredient findIngredientById(Integer productId, Integer foodId) {
        return productRepository.findIngredientByProductIdAndFoodId(productId, foodId)
                .orElseThrow(() -> new EntityNotFoundException("Ingredient not found for productId: "
                + productId + " and foodId: " + foodId));
    }

    private boolean existsIngredientById(Integer productId, Integer foodId) {
        return productRepository.existsIngredientByProductIdAndFoodId(productId, foodId);
    }
}
