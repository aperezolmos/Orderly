package es.ubu.inf.tfg.product;

import java.util.List;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.FoodService;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;
import es.ubu.inf.tfg.product.dto.IngredientResponseDTO;
import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;
import es.ubu.inf.tfg.product.dto.mapper.IngredientMapper;
import es.ubu.inf.tfg.product.dto.mapper.ProductMapper;
import es.ubu.inf.tfg.product.ingredient.Ingredient;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final FoodService foodService;
    private final ProductMapper productMapper;
    private final IngredientMapper ingredientMapper;

    
    public List<ProductResponseDTO> findAll() {
        return productRepository.findAll().stream()
                .map(productMapper::toResponseDTO)
                .toList();
    }

    public ProductResponseDTO findById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
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

    public List<ProductResponseDTO> findByMaxPrice(Double maxPrice) {
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
        
        if (existsByName(productRequest.getName())) {
            throw new IllegalArgumentException("Product with name '" + productRequest.getName() + "' already exists");
        }
        
        Product product = productMapper.toEntity(productRequest);
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(savedProduct);
    }

    public ProductResponseDTO update(Integer id, ProductRequestDTO productRequest) {
        
        Product existingProduct = findEntityById(id);
        
        if (productRequest.getName() != null && !productRequest.getName().equals(existingProduct.getName())) {
            if (existsByName(productRequest.getName())) {
                throw new IllegalArgumentException("Product with name '" + productRequest.getName() + "' already exists");
            }
            existingProduct.setName(productRequest.getName());
        }
        
        existingProduct.setDescription(productRequest.getDescription());
        
        if (productRequest.getPrice() >= 0) {
            existingProduct.setPrice(productRequest.getPrice());
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

    public IngredientResponseDTO addIngredientToProduct(Integer foodId, Integer productId, Double quantity) {
        
        Product product = findEntityById(productId);
        Food food = foodService.findEntityById(foodId);
        
        Ingredient ingredient = product.addIngredient(food, quantity);
        productRepository.save(product);
        
        return ingredientMapper.toResponseDTO(ingredient);
    }

    public IngredientResponseDTO updateIngredientQuantity(Integer foodId, Integer productId, Double newQuantity) {
        
        Product product = findEntityById(productId);
        product.updateIngredientQuantity(foodId, newQuantity);
        productRepository.save(product);
        
        // Retrieve the updated ingredient for the response DTO
        Ingredient updatedIngredient = product.getIngredients().stream()
                .filter(ing -> ing.getId().getFoodId().equals(foodId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Ingredient not found for foodId: " + foodId
                + " and productId: " + productId));
                
        return ingredientMapper.toResponseDTO(updatedIngredient);
    }

    public void removeIngredientFromProduct(Integer foodId, Integer productId) {
        
        Product product = findEntityById(productId);
        product.removeIngredient(foodId);
        productRepository.save(product);
    }


    // --------------------------------------------------------
    // INFO

    public NutritionInfoDTO calculateProductNutritionInfo(Integer productId) {
        
        Product product = findEntityById(productId);
        NutritionInfo totalNutrition = product.calculateTotalNutrition();
        return productMapper.toNutritionInfoDTO(totalNutrition);
    }

    public ProductResponseDTO getProductDetailedInfo(Integer productId, boolean includeIngredients) {
        
        Product product = findEntityById(productId);
        NutritionInfoDTO nutritionInfo = calculateProductNutritionInfo(productId);
        
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
}
